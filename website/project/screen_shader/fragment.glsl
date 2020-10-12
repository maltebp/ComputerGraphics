#version 300 es

precision highp float;

in vec2 o_TexCoords;

uniform sampler2D u_ColorTexture;

out vec4 FragColor;

void main() {

    FragColor = texture(u_ColorTexture, o_TexCoords);
}