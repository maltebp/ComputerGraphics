precision mediump float;

uniform float u_WidthScaling;
uniform float u_HeightScaling;

attribute vec2 a_Position;
attribute vec2 a_TextureCoordinates;

varying vec2 o_TextureCoordinates;


void main() {

    o_TextureCoordinates = a_TextureCoordinates;
    gl_Position = vec4(a_Position.x*u_WidthScaling, a_Position.y*u_HeightScaling, 0.0, 1.0); 
}