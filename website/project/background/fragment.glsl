
precision mediump float;

uniform sampler2D u_Texture;

varying vec2 o_TextureCoordinates; 

void main() {
    gl_FragColor = texture2D(u_Texture, o_TextureCoordinates);
}