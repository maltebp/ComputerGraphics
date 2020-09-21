precision mediump float;

uniform mat4 u_Transform;

attribute vec2 a_Position;
attribute float a_ZIndex;
attribute vec4 a_Color;

varying vec4 o_Color;

void main() {
    float z = a_ZIndex / 65535.0;
    gl_Position = u_Transform * vec4(a_Position.x, a_Position.y, z, 1.0);  
    o_Color = a_Color;
}