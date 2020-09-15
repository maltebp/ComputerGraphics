precision mediump float;

attribute vec2 a_Position;
attribute float a_ZIndex;
attribute float a_Size;
attribute vec4 a_Color;

varying vec4 o_Color;

void main() {
    gl_Position = vec4(a_Position.x, a_Position.y, a_ZIndex, 1.0);   
    gl_PointSize = a_Size;
    o_Color = a_Color;
}