#version 300 es

precision mediump float;

in vec2 a_Position;
in vec2 a_TexCoords;

out vec2 o_TexCoords;

void main() {
    gl_Position = vec4(a_Position.x, a_Position.y, 0.0, 1.0);  
    o_TexCoords = a_TexCoords;
}