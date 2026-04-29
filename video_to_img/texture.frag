precision mediump float;

varying vec2 vTexCoord;

uniform float uTime;
uniform float uSpeed;
uniform float uGradientMix;
uniform float uGradientHeight;
uniform float uStop1;
uniform float uStop2;
uniform float uStop3;
uniform float uStop4;
uniform float uStop5;
uniform float uStop6;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform vec3 uColor6;


vec3 gradientSixStop(float t) {
  float eps = 0.0001;

  float s1 = clamp(uStop1, 0.0, 1.0 - eps * 5.0);
  float s2 = clamp(max(uStop2, s1 + eps), 0.0, 1.0 - eps * 4.0);
  float s3 = clamp(max(uStop3, s2 + eps), 0.0, 1.0 - eps * 3.0);
  float s4 = clamp(max(uStop4, s3 + eps), 0.0, 1.0 - eps * 2.0);
  float s5 = clamp(max(uStop5, s4 + eps), 0.0, 1.0 - eps);
  float s6 = clamp(max(uStop6, s5 + eps), 0.0, 1.0);

  if (t <= s1) return uColor1;
  if (t < s2) return mix(uColor1, uColor2, smoothstep(s1, s2, t));
  if (t < s3) return mix(uColor2, uColor3, smoothstep(s2, s3, t));
  if (t < s4) return mix(uColor3, uColor4, smoothstep(s3, s4, t));
  if (t < s5) return mix(uColor4, uColor5, smoothstep(s4, s5, t));
  if (t < s6) return mix(uColor5, uColor6, smoothstep(s5, s6, t));
  return uColor6;
}

float easeOutExpo(float t) {
  return (t >= 1.0) ? 1.0 : (1.0 - pow(2.0, -10.0 * t));
}

float rhythmicDropProgress(float timeSec) {
  float cycleDuration = 3.0;
  float dropDuration = 3.0;
  float cycleT = mod(timeSec, cycleDuration);

  if (cycleT < dropDuration) {
    float dropT = cycleT / dropDuration;
    return easeOutExpo(dropT);
  }

  // Hold at the completed drop state.
  return 1.0;
}

float motionVisibility(float timeSec) {
  float cycleDuration = 3.0;
  float dropDuration = 3.0;
  float cycleT = mod(timeSec, cycleDuration);
  float edge = 0.06;

  float fadeIn = smoothstep(0.0, edge, cycleT);
  float fadeOut = 1.0 - smoothstep(dropDuration - edge, dropDuration, cycleT);
  return fadeIn * fadeOut;
}

void main() {
  vec3 base = vec3(0.8);
  float yTopToBottom = 1.0 - vTexCoord.y;
  float cycleDuration = 3.0;
  float cycleIndex = floor(uTime / cycleDuration);
  float dropProgress = rhythmicDropProgress(uTime);
  float gradientVisible = motionVisibility(uTime);
  float totalOffset = (cycleIndex + dropProgress) * uGradientHeight * uSpeed;
  float gradientT = fract((yTopToBottom - totalOffset) / max(uGradientHeight, 0.0001));
  vec3 movingGradient = gradientSixStop(gradientT);
  vec3 finalColor = mix(base, movingGradient, uGradientMix * gradientVisible);
  gl_FragColor = vec4(finalColor, 1.0);
}
