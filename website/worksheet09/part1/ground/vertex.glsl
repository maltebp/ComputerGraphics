precision mediump float;

uniform mat4 u_ViewProjection;
uniform vec3 u_CameraPosition;
uniform vec3 u_LightPosition;

attribute vec2 a_Position;
attribute vec2 a_TextureCoordinates;

varying vec2 o_TextureCoordinates;
varying vec3 o_Position;
varying vec3 o_DirectionToObserver;
varying vec3 o_DirectionToLight;


void main() {

    o_Position = vec3(a_Position.x, 0, a_Position.y);
    o_TextureCoordinates = a_TextureCoordinates;

    o_DirectionToObserver = normalize(u_CameraPosition - o_Position);    
    o_DirectionToLight = normalize(u_LightPosition - o_Position);

    gl_Position = u_ViewProjection * vec4(o_Position, 1.0); 
}