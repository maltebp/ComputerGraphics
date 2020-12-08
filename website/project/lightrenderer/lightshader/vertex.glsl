precision mediump float;

attribute vec2 a_Position;

uniform mat3 u_CameraMatrix;
uniform float u_LightSize;

varying vec2 o_TextureCoordinates;

void main() {

    vec3 transformedPosition = u_CameraMatrix * vec3(a_Position * 0.5 *  u_LightSize, 1.0);

    o_TextureCoordinates = (a_Position + 1.0) / 2.0;
    gl_Position = vec4(transformedPosition, 1.0);   
}