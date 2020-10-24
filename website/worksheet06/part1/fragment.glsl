precision mediump float;

uniform sampler2D u_TextureSampler;

varying vec2 o_TextureCoordinates;

void main() {
    gl_FragColor = texture2D(u_TextureSampler, o_TextureCoordinates);
}