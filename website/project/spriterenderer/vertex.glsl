uniform mat3 u_CameraMatrix;

attribute vec2 a_Position;
attribute vec3 a_Color;
attribute float a_TextureSlot;
attribute vec2 a_TextureCoordinates;

varying vec3 o_Color;
varying float o_TextureSlot;
varying vec2 o_TextureCoordinates;

void main() {
    o_Color = a_Color;
    o_TextureSlot = a_TextureSlot;
    o_TextureCoordinates = a_TextureCoordinates;

    gl_Position = vec4((u_CameraMatrix * vec3(a_Position, 1.0)).xy, 0, 1.0);   
}