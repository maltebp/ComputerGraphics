
precision mediump float;

varying vec4 o_Color;

void main() {

    vec4 normalized = normalize(gl_FragCoord);
    gl_FragColor = vec4(normalized.x, normalized.y, 0.0, 1.0);
}