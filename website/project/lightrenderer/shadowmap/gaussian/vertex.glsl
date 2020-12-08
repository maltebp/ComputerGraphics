/*
    Gaussian Vertex Shader

    Simple vertex shader, which draws vertices with their 
    positions as-is (expected to be in NDC)
*/

precision mediump float;

attribute vec2 a_Position;

varying vec2 o_TextureCoordinates;

void main() {
    o_TextureCoordinates = (a_Position + 1.0) / 2.0;
    gl_Position = vec4(a_Position.xy, 0.0, 1.0);   
}