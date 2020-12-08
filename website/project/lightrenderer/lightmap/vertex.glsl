
precision mediump float;

attribute vec2 a_Position;

varying vec2 o_TextureCoordinates;

void main() {
    o_TextureCoordinates = (a_Position+1.0)/2.0;
    gl_Position = vec4(a_Position, 0, 1.0);
}