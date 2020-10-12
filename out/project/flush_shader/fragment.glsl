
precision highp float;

varying vec2 o_TexCoords;

uniform sampler2D u_ColorTexture;
uniform sampler2D u_AlphaTexture;

void main() {
    gl_FragColor = texture2D(u_ColorTexture, o_TexCoords);
}