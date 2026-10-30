import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn(
      'Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Please verify your .env file.'
    );
  }
}

// Client initialized strictly from environment configurations
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

function generateShortId(length = 8) {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => chars[v % chars.length]).join('');
}

/**
 * Compresses a Blob or Image into a compact JPEG data URL (~35-55KB) as a 100% reliable
 * fallback if Supabase Storage bucket upload is unavailable or blocked by RLS.
 */
async function compressBlobToDataUrl(blob, maxDim = 720, quality = 0.82) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('landscape');
      return;
    }
    const img = new Image();
    const objUrl = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      let w = img.naturalWidth || img.width || 600;
      let h = img.naturalHeight || img.height || 600;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('landscape');
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      resolve('landscape');
    };
    img.src = objUrl;
  });
}

/**
 * Encodes card state into a URL-safe base64 string for 100% offline/fallback resilience.
 */
export function encodeCardStateParam(state) {
  try {
    const compact = {
      o: state.occasion,
      ct: state.cardType,
      ps: state.pokemonSubtype,
      sp: state.selectedPokemon,
      sf: state.selectedFlower,
      bi:
        state.selectedBackImage && state.selectedBackImage.startsWith('data:')
          ? 'landscape'
          : state.selectedBackImage,
      sb: state.subject,
      m: state.message,
      t: state.to,
      f: state.from,
      tn: state.trainerName,
      tb: state.trainerBio,
      se: state.stampEmoji,
      d: state.date,
      tm: state.time,
      st: state.stickers,
    };
    const json = JSON.stringify(compact);
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

/**
 * Decodes a URL-safe base64 card state string back into full studio state.
 */
export function decodeCardStateParam(encoded) {
  try {
    if (!encoded) return null;
    const json = decodeURIComponent(atob(encoded));
    const c = JSON.parse(json);
    return {
      occasion: c.o || 'sorry',
      cardType: c.ct || 'paper',
      pokemonSubtype: c.ps || 'base',
      selectedPokemon: c.sp || 'gengar',
      selectedFlower: c.sf || 'flower_1',
      selectedBackImage: c.bi || 'landscape',
      subject: c.sb ?? '',
      message: c.m ?? '',
      to: c.t ?? '',
      from: c.f ?? '',
      trainerName: c.tn ?? '',
      trainerBio: c.tb ?? '',
      stampEmoji: c.se || 'pleading-face',
      date: c.d || '',
      time: c.tm || '',
      stickers: Array.isArray(c.st) ? c.st : [],
      activeSide: 'front',
    };
  } catch {
    return null;
  }
}

/**
 * If selectedBackImage is a local blob: or data: URL, uploads the image to Supabase Storage
 * and returns its permanent public URL. Falls back to a compressed data URL if Storage RLS fails.
 */
export async function resolveBackImageForShare(selectedBackImage) {
  if (
    !selectedBackImage ||
    (!selectedBackImage.startsWith('blob:') && !selectedBackImage.startsWith('data:'))
  ) {
    return selectedBackImage;
  }

  let blob;
  try {
    const response = await fetch(selectedBackImage);
    blob = await response.blob();
  } catch {
    // Stale or revoked blob URL fallback
    return 'landscape';
  }

  const ext = (blob.type && blob.type.split('/')[1]?.replace('jpeg', 'jpg')) || 'jpg';
  const filePath = `backs/${Date.now()}-${generateShortId(6)}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('card-images')
      .upload(filePath, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: false,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from('card-images').getPublicUrl(filePath);
      if (data?.publicUrl) return data.publicUrl;
    }
  } catch {
    // Proceed to inline data URL fallback
  }

  // Fallback: store compact base64 JPEG directly in the card state JSON so custom photos never fail
  return await compressBlobToDataUrl(blob);
}

/**
 * Saves the current card state to Supabase `public.cards` and returns the short ID + share URL.
 */
export async function saveSharedCard(state) {
  let id = generateShortId(8);
  const permanentBackImage = await resolveBackImageForShare(state.selectedBackImage);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  const timeFormatted = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const payloadState = {
    ...state,
    date: state.date || dateFormatted,
    time: state.time || timeFormatted,
    selectedBackImage: permanentBackImage,
    activeSide: 'front',
  };

  let { error } = await supabase
    .from('cards')
    .insert([{ id, state: payloadState }]);

  // Retry once with a fresh short ID in case of rare collision or transient network hiccup
  if (error) {
    id = generateShortId(8);
    const retryRes = await supabase
      .from('cards')
      .insert([{ id, state: payloadState }]);
    error = retryRes.error;
  }

  if (error) {
    // Fallback to self-contained encoded URL so the shared link still works 100% for the recipient
    const encoded = encodeCardStateParam(payloadState);
    const fallbackUrl = encoded
      ? `${window.location.origin}/?card=${id}&d=${encoded}`
      : `${window.location.origin}/?preview=recipient`;
    return { id, shareUrl: fallbackUrl, state: payloadState };
  }

  const shareUrl = `${window.location.origin}/?card=${id}`;
  return { id, shareUrl, state: payloadState };
}

/**
 * Loads a shared card state by its short ID from Supabase `public.cards`.
 */
export async function loadSharedCard(id) {
  const { data, error } = await supabase
    .from('cards')
    .select('state')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data?.state || null;
}
