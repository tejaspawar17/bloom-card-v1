import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ssxskxgwmvecfmjhjrfj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6Fq9MqjVa-X0UaibdbWnWQ_u-DQq3pA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function generateShortId(length = 8) {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => chars[v % chars.length]).join('');
}

/**
 * If selectedBackImage is a local blob: URL, uploads the image to Supabase Storage
 * and returns its permanent public URL.
 */
export async function resolveBackImageForShare(selectedBackImage) {
  if (!selectedBackImage || !selectedBackImage.startsWith('blob:')) {
    return selectedBackImage;
  }

  const response = await fetch(selectedBackImage);
  const blob = await response.blob();
  const ext = (blob.type && blob.type.split('/')[1]) || 'png';
  const filePath = `backs/${Date.now()}-${generateShortId(6)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('card-images')
    .upload(filePath, blob, {
      contentType: blob.type || 'image/png',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('card-images').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Saves the current card state to Supabase `public.cards` and returns the short ID + share URL.
 */
export async function saveSharedCard(state) {
  const id = generateShortId(8);
  const permanentBackImage = await resolveBackImageForShare(state.selectedBackImage);

  const payloadState = {
    ...state,
    selectedBackImage: permanentBackImage,
    activeSide: 'front',
  };

  const { error } = await supabase
    .from('cards')
    .insert([{ id, state: payloadState }]);

  if (error) {
    throw error;
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
