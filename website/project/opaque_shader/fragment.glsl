#version 300 es

precision mediump float;

in vec4 o_Color;

out vec4 FragColor;

void main() {
    FragColor = o_Color;
}
