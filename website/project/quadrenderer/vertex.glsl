
attribute vec2 a_Position;
attribute float a_Depth;
attribute vec4 a_Color;

varying vec4 o_Color;

void main() {
    o_Color = a_Color;
    gl_Position = vec4(a_Position.x, a_Position.y, a_Depth, 1.0);   
}