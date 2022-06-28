#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform sampler2D noise;
uniform float segmentHeight;
uniform float lineWidth;
uniform float minAlpha;
uniform float antialiasing;
uniform float amplitude;
uniform float peaks;
uniform vec3 color;

varying vec2 uv;

void main() {
  // float n = texture2D(noise, uv).r;
  // gl_FragColor = vec4(n, 0.0, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);

  float height = pow(texture2D(noise, uv).a * amplitude, peaks);

  //isoline effect
  float modulus = mod(height, lineWidth + segmentHeight);
  float dist = min(modulus, segmentHeight - modulus);
  float clamped = clamp(dist, 0.0, lineWidth);
  // float a = 1.0 - (clamped / lineWidth);

  float stepped = step(lineWidth, abs(dist));
  float antialias = clamp((abs(dist - lineWidth) * stepped) / antialiasing, 0.0, 1.0);
  float a = stepped * antialias;

  float hasWidth = step(lineWidth, 0.0001);
  gl_FragColor.a = max(minAlpha, mix(a, 1.0, hasWidth));

  // gl_FragColor = vec4(texture2D(noise, uv).a, 0.0, 0.0, 1.0);



}
