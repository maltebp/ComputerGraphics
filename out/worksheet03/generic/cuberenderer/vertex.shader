precision mediump float;

uniform mat4 u_Camera;

attribute vec3 a_Position;
attribute vec4 a_Color;

varying vec4 o_Color;

void main() {

    vec4 position = u_Camera*vec4(a_Position.x, a_Position.y, a_Position.z, 1.0);
    position.z =  position.z/32000.0;
    gl_Position = position;  
    o_Color = a_Color;
}