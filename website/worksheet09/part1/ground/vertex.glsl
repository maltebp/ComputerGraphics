precision mediump float;

uniform mat4 u_ViewProjection;

attribute vec3 a_Position;
attribute vec2 a_TextureCoordinates;

varying vec2 o_TextureCoordinates;

void main() {
    o_TextureCoordinates = a_TextureCoordinates;

    gl_Position = u_ViewProjection * vec4(a_Position.x, 0, a_Position.y, 1.0); 
}