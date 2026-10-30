import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';

const VERTEX_SHADER = `#version 300 es
in vec2 position;
out vec2 v_uv;
void main() {
    v_uv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_pixelRatio;
uniform vec4 u_colors[4];
uniform int u_colors_length;
uniform float u_seed;
uniform float u_speed;
uniform float u_scale;
uniform float u_turbAmp;
uniform float u_turbFreq;
uniform float u_turbIter;
uniform float u_waveFreq;
uniform float u_contrast;
uniform float u_exposure;
uniform float u_saturation;
uniform float u_dither;
uniform float u_ditherMode;
uniform float u_loop;
uniform float u_distBias;
uniform float u_jellify;

const float GOLDEN_ANGLE = 2.3999632;
const float TAU = 6.28318530;

uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

vec3 toLinear(vec3 c) {
    return pow(c, vec3(2.2));
}

vec3 toSrgb(vec3 c) {
    return pow(clamp(c, 0.0, 1.0), vec3(0.4545));
}

vec3 linearToOklab(vec3 c) {
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
    
    l = pow(max(l, 0.0), 1.0/3.0);
    m = pow(max(m, 0.0), 1.0/3.0);
    s = pow(max(s, 0.0), 1.0/3.0);
    
    return vec3(
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    );
}

vec3 oklabToLinear(vec3 c) {
    float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
    float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
    float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
    
    l = l * l * l;
    m = m * m * m;
    s = s * s * s;
    
    return vec3(
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}

vec3 oklabToLch(vec3 lab) {
    return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y));
}

vec3 lchToOklab(vec3 lch) {
    return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
}

vec3 mixLch(vec3 lab0, vec3 lab1, float t) {
    vec3 lch0 = oklabToLch(lab0);
    vec3 lch1 = oklabToLch(lab1);
    
    if (lch0.y < 0.05) lch0.z = lch1.z;
    if (lch1.y < 0.05) lch1.z = lch0.z;
    
    float dh = lch1.z - lch0.z;
    if (dh > 3.14159265) dh -= 6.28318530;
    if (dh < -3.14159265) dh += 6.28318530;
    
    return lchToOklab(vec3(
        mix(lch0.x, lch1.x, t),
        mix(lch0.y, lch1.y, t),
        lch0.z + dh * t
    ));
}

vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

vec3 paletteN(float t, int count) {
    if (count < 1) return vec3(0.0);
    if (count < 2) return toLinear(getColor(0));
    
    float segmentSize = 1.0 / float(count - 1);
    t = clamp(t, 0.0, 1.0);
    int idx = min(int(floor(t / segmentSize)), count - 2);
    float localT = clamp((t - float(idx) * segmentSize) / segmentSize, 0.0, 1.0);
    
    vec3 lab0 = linearToOklab(toLinear(getColor(idx)));
    vec3 lab1 = linearToOklab(toLinear(getColor(idx + 1)));
    
    return oklabToLinear(mixLch(lab0, lab1, localT));
}

float IGN(vec2 uv) {
    return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
}

float quickNoise(vec2 I) {
    return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453);
}

float getDither(vec2 I, float mode) {
    if (mode < 0.5) return 0.5;
    if (mode < 1.5) return IGN(I);
    return quickNoise(I);
}

vec3 softGamutMap(vec3 linearRgb) {
    float maxC = max(linearRgb.r, max(linearRgb.g, linearRgb.b));
    float minC = min(linearRgb.r, min(linearRgb.g, linearRgb.b));
    
    if (minC >= 0.0 && maxC <= 1.0) return linearRgb;
    
    vec3 lab = linearToOklab(max(linearRgb, 0.0));
    float L = clamp(lab.x, 0.0, 1.0);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);
    
    float maxChroma = 0.4 * (1.0 - pow(abs(2.0 * L - 1.0), 2.0));
    
    if (C > maxChroma * 0.7) {
        float knee = maxChroma * 0.7;
        C = knee + (maxChroma - knee) * tanh((C - knee) / (maxChroma - knee + 0.001));
    }
    
    return clamp(oklabToLinear(vec3(L, C * cos(h), C * sin(h))), 0.0, 1.0);
}

vec3 applyContrastSaturation(vec3 linearRgb, float contrast, float saturation) {
    vec3 lab = linearToOklab(linearRgb);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);
    
    lab.x = clamp((lab.x - 0.5) * contrast + 0.5, 0.0, 1.0);
    C *= saturation;
    lab.y = C * cos(h);
    lab.z = C * sin(h);
    
    return oklabToLinear(lab);
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 r = u_resolution;
    vec2 p = (fragCoord * 2.0 - r) / r.y;
    
    int colorCount = u_colors_length;
    if (colorCount < 1) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    float t = u_time * 0.3;
    float looping = step(0.5, u_loop);
    float phase = TAU * u_time / max(u_loop, 0.01);
    float radius = u_loop * u_speed * 0.3 / TAU;
    float tA = sin(phase) * radius;
    float tB = (1.0 - cos(phase)) * radius;
    
    vec3 seedOffset = seedRandom(u_seed);
    vec3 seedOffset2 = seedRandom(u_seed + 100.0);
    
    float seedAngle = u_seed * GOLDEN_ANGLE;
    vec2 seedPhase = (seedOffset2.xy - 0.5) * TAU;
    
    float cs = cos(seedAngle);
    float sn = sin(seedAngle);
    p = mat2(cs, -sn, sn, cs) * p;
    
    float dither = getDither(floor(fragCoord / u_pixelRatio), u_ditherMode);
    
    float totalVal = 0.0;
    float totalWeight = 0.0;
    int turbIter = int(u_turbIter);
    float freq = 1.0 / max(u_turbFreq, 0.01);
    
    for (float i = 0.0; i < 4.0; i++) {
        float eph = i / 4.0;
        vec2 q = p * u_scale;
        float sq = eph * eph;
        
        if (u_jellify > 0.5) {
            q.yx *= mix(1.0, 0.5, 1.0 - exp(-sq));
        }
        
        float a = seedPhase.x;
        float d = seedPhase.y;
        
        for (int j = 2; j < 13; j++) {
            if (j >= turbIter) break;
            float fj = float(j);
            float t1 = mix(t * u_speed, tA, looping);
            float t2 = mix(t * u_speed, tB, looping);
            q += u_turbAmp * sin(q.yx / freq * fj + t1 + vec2(a, d) + seedOffset.xy * fj) / fj;
            a += cos(fj + d * 1.2 + q.x * 2.0 - t1 + seedOffset2.z + t2 * 0.3 * looping);
            d += sin(fj * q.y + a + seedOffset.z + t1 + seedOffset2.y + t2 * 0.3 * looping);
        }
        
        float v = 0.5 + 0.5 * sin(length(q.yx + vec2(a, d) * 0.2) * u_waveFreq + i * i + seedOffset.x);
        float weight = smoothstep(0.0, 0.5, eph) * smoothstep(1.0, 0.5, eph);
        totalVal += v * weight;
        totalWeight += weight;
    }
    
    float val = totalVal / totalWeight;
    val = clamp((val - 0.3) / 0.4, 0.0, 1.0);
    val = pow(val, exp(-u_distBias));
    val = clamp(val + (dither - 0.5) * u_dither, 0.0, 1.0);
    
    vec3 col = paletteN(val, colorCount);
    col *= u_exposure;
    col = applyContrastSaturation(col, u_contrast, u_saturation);
    col = softGamutMap(col);
    col = toSrgb(col);
    
    fragColor = vec4(col, 1.0);
}
`;

const SIZE_CONFIGS = {
  sm: 'px-5 py-2 text-[14px]',
  md: 'px-6 py-2.5 text-[14.5px] sm:px-8 sm:py-3.5 sm:text-[16px]',
  lg: 'px-10 py-4 text-[17px]',
};

export default function ShaderButton({
  children = "Design your card",
  onClick,
  className = "",
  style = {},
  showArrow = true,
  size = "lg",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!gl) return;

    // Compile Shader helper
    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uPixelRatio = gl.getUniformLocation(program, 'u_pixelRatio');
    const uColors = gl.getUniformLocation(program, 'u_colors');
    const uColorsLength = gl.getUniformLocation(program, 'u_colors_length');
    const uSeed = gl.getUniformLocation(program, 'u_seed');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uScale = gl.getUniformLocation(program, 'u_scale');
    const uTurbAmp = gl.getUniformLocation(program, 'u_turbAmp');
    const uTurbFreq = gl.getUniformLocation(program, 'u_turbFreq');
    const uTurbIter = gl.getUniformLocation(program, 'u_turbIter');
    const uWaveFreq = gl.getUniformLocation(program, 'u_waveFreq');
    const uContrast = gl.getUniformLocation(program, 'u_contrast');
    const uExposure = gl.getUniformLocation(program, 'u_exposure');
    const uSaturation = gl.getUniformLocation(program, 'u_saturation');
    const uDither = gl.getUniformLocation(program, 'u_dither');
    const uDitherMode = gl.getUniformLocation(program, 'u_ditherMode');
    const uLoop = gl.getUniformLocation(program, 'u_loop');
    const uDistBias = gl.getUniformLocation(program, 'u_distBias');
    const uJellify = gl.getUniformLocation(program, 'u_jellify');

    // Default palette matching Framer Shader Button:
    // rgb(10, 18, 2), rgb(26, 46, 5), rgb(101, 163, 13), rgb(163, 230, 53)
    const colors = [
      10 / 255, 18 / 255, 2 / 255, 1.0,
      26 / 255, 46 / 255, 5 / 255, 1.0,
      101 / 255, 163 / 255, 13 / 255, 1.0,
      163 / 255, 230 / 255, 53 / 255, 1.0,
    ];

    gl.uniform4fv(uColors, new Float32Array(colors));
    gl.uniform1i(uColorsLength, 4);
    gl.uniform1f(uSeed, 32.0);
    gl.uniform1f(uSpeed, 1.6);
    gl.uniform1f(uScale, 0.6);
    gl.uniform1f(uTurbAmp, 0.6);
    gl.uniform1f(uTurbFreq, 0.1);
    gl.uniform1f(uTurbIter, 4.0);
    gl.uniform1f(uWaveFreq, 2.4);
    gl.uniform1f(uContrast, 1.1);
    gl.uniform1f(uExposure, 1.1);
    gl.uniform1f(uSaturation, 1.0);
    gl.uniform1f(uDither, 0.08);
    gl.uniform1f(uDitherMode, 1.0);
    gl.uniform1f(uLoop, 0.0);
    gl.uniform1f(uDistBias, 0.0);
    gl.uniform1f(uJellify, 0.0);

    let animationFrameId;
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      const displayWidth = Math.round(width * dpr);
      const displayHeight = Math.round(height * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
        gl.uniform2f(uResolution, displayWidth, displayHeight);
        gl.uniform1f(uPixelRatio, dpr);
      }
    };

    const render = (now) => {
      resize();
      const elapsed = (now - startTime) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  const canHover = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
    : true;

  return (
    <motion.button
      type="button"
      initial="initial"
      whileHover={canHover ? "hover" : undefined}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center whitespace-nowrap ${showArrow ? 'gap-3' : 'gap-0'} ${SIZE_CONFIGS[size] || SIZE_CONFIGS.lg} rounded-full overflow-hidden cursor-pointer select-none bg-[#0A1202] text-white outline-none hig-focus ${className}`}
      style={style}
    >
      {/* 1. WebGL Liquid Gradient Shader Canvas (Framer micro-animation: hover dims opacity to 0.4 via 0.4s tween) */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-full overflow-hidden"
        variants={{
          initial: { opacity: 1 },
          hover: { opacity: 0.4 },
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.6, 1] }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-full"
          style={{ width: '100%', height: '100%', borderRadius: '9999px' }}
        />
      </motion.div>

      {/* 2. Inset Specular Border Glow (Framer micro-animation: hover dims opacity to 0.4 via 0.4s tween) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          backgroundColor: 'rgba(10, 18, 2, 0.02)',
          boxShadow: 'inset 0px 0px 14px 0px rgba(217, 249, 157, 0.42)',
          mixBlendMode: 'screen',
          borderRadius: '9999px',
        }}
        variants={{
          initial: { opacity: 1 },
          hover: { opacity: 0.4 },
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.6, 1] }}
      />

      {/* 3. Button Text */}
      <span className="relative z-10 font-sans font-medium leading-[1.4em] tracking-[-0.01em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
        {children}
      </span>

      {/* 4. Simple Side Arrow (Phosphor Icons) */}
      {showArrow && (
        <div className="relative z-10 flex items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
          <ArrowRight size={18} weight="regular" />
        </div>
      )}
    </motion.button>
  );
}
