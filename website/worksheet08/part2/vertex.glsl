precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

attribute vec3 a_Position;
attribute vec2 a_TextureCoordinates;
attribute float a_TextureIndex;

varying vec2 o_TextureCoordinates;
varying float o_TextureIndex;


void main() {
    o_TextureCoordinates = a_TextureCoordinates;
    o_TextureIndex = a_TextureIndex;

    gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 1.0); 
}