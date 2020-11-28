precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_LightViewProjection;

attribute vec2 a_Position;
attribute vec2 a_TextureCoordinates;

varying vec2 o_TextureCoordinates;
varying vec3 o_Position;


void main() {
    o_TextureCoordinates = a_TextureCoordinates;

    o_Position = vec3(a_Position.x, 0, a_Position.y);
    gl_Position = u_ViewProjection * vec4(a_Position.x, 0, a_Position.y, 1.0); 
}