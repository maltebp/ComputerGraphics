attribute vec4 a_Position;
attribute vec3 a_Color;

varying vec4 o_Color;

void main() {
    o_Color = vec4(a_Color, 1.0);
    gl_Position = a_Position;   
    gl_PointSize = 20.0;
}