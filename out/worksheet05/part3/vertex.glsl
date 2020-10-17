precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute vec4 a_Color;


varying vec3 o_Normal;
varying vec4 o_Color;


void main() {
    o_Color = a_Color;
    o_Normal = a_Normal;
    gl_Position = u_ViewProjection * u_Model * vec4(a_Position.xyz, 1.0);
}