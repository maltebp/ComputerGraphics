
attribute vec2 a_Position;

varying vec2 o_Position;

void main() {
    o_Position = a_Position;
    gl_Position = vec4(a_Position, 0.0, 1.0);   
}