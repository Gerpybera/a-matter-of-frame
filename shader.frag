precision highp float;

uniform sampler2D uMask;
uniform vec2 uResolution;
uniform vec3 uInnerColor;
uniform vec3 uEdgeColor1;
uniform vec3 uEdgeColor2;
uniform vec3 uEdgeColor3;
uniform float uEdgeWidth;
uniform float uGlowWidth;

varying vec2 vTexCoord;

float sampleMask(vec2 uv) {
  uv.y = 1.0 - uv.y;
  return texture2D(uMask, uv).r;
}

void main() {
  vec2 uv = vTexCoord;
  vec2 px = 1.0 / uResolution;

  float c = sampleMask(uv);

  float edgeN = 0.0;
  edgeN = max(edgeN, sampleMask(uv + vec2(px.x * uEdgeWidth, 0.0)));
  edgeN = max(edgeN, sampleMask(uv + vec2(-px.x * uEdgeWidth, 0.0)));
  edgeN = max(edgeN, sampleMask(uv + vec2(0.0, px.y * uEdgeWidth)));
  edgeN = max(edgeN, sampleMask(uv + vec2(0.0, -px.y * uEdgeWidth)));
  edgeN = max(edgeN, sampleMask(uv + vec2(px.x * uEdgeWidth, px.y * uEdgeWidth)));
  edgeN = max(edgeN, sampleMask(uv + vec2(-px.x * uEdgeWidth, px.y * uEdgeWidth)));
  edgeN = max(edgeN, sampleMask(uv + vec2(px.x * uEdgeWidth, -px.y * uEdgeWidth)));
  edgeN = max(edgeN, sampleMask(uv + vec2(-px.x * uEdgeWidth, -px.y * uEdgeWidth)));

  float glowN = 0.0;
  glowN = max(glowN, sampleMask(uv + vec2(px.x * uGlowWidth, 0.0)));
  glowN = max(glowN, sampleMask(uv + vec2(-px.x * uGlowWidth, 0.0)));
  glowN = max(glowN, sampleMask(uv + vec2(0.0, px.y * uGlowWidth)));
  glowN = max(glowN, sampleMask(uv + vec2(0.0, -px.y * uGlowWidth)));
  glowN = max(glowN, sampleMask(uv + vec2(px.x * uGlowWidth, px.y * uGlowWidth)));
  glowN = max(glowN, sampleMask(uv + vec2(-px.x * uGlowWidth, px.y * uGlowWidth)));
  glowN = max(glowN, sampleMask(uv + vec2(px.x * uGlowWidth, -px.y * uGlowWidth)));
  glowN = max(glowN, sampleMask(uv + vec2(-px.x * uGlowWidth, -px.y * uGlowWidth)));

  float inside = smoothstep(0.5, 0.9, c);

  float edge = clamp(edgeN - c, 0.0, 1.0);
  edge = smoothstep(0.0, 1.0, edge);

  float glow = clamp(glowN - edgeN, 0.0, 1.0);
  glow = smoothstep(0.0, 1.0, glow);

  vec3 edgeColor = mix(uEdgeColor1, uEdgeColor2, smoothstep(0.0, 0.5, edge));
  edgeColor = mix(edgeColor, uEdgeColor3, smoothstep(0.5, 1.0, edge));

  vec3 color = vec3(0.0);
  color += uInnerColor * inside;
  color += edgeColor * edge;
  color += mix(uEdgeColor1, uEdgeColor2, 0.5) * glow * 0.55;

  float alpha = max(inside, max(edge, glow * 0.7));
  gl_FragColor = vec4(color, alpha);
}