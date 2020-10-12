#version 300 es


precision mediump float;

uniform mat4 u_ViewProjection;

in vec3 a_Position;
in vec4 a_Color;

out vec4 o_Color;

void main() {

    // vec4 position = u_ViewProjection * vec4(a_Position.x, a_Position.y, a_Position.x, 1.0);
    vec4 position =  u_ViewProjection * vec4(a_Position.x, a_Position.y, a_Position.z, 1.0);
    gl_Position = position;  
    o_Color = a_Color;
}