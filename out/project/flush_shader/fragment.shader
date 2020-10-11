
precision mediump float;

varying vec2 o_TexCoords;

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;

void main() {
    gl_FragColor = texture2D(u_Sampler0, o_TexCoords);
}