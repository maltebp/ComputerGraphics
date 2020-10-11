
precision mediump float;

varying vec2 o_TexCoords;

uniform sampler2D u_Sampler;

void main() {
    gl_FragColor = texture2D(u_Sampler, o_TexCoords);
}