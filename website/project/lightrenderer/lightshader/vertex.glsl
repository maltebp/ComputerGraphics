precision mediump float;

uniform mat3    u_CameraMatrix;
uniform vec2    u_LightPosition;
uniform float   u_LightRadius;

// Matrix which transforms world coordinates
// to texture coordinates in the diffuse map (same as occlusion map)
uniform mat3    u_DiffuseMapMatrix;

attribute vec2 a_Position;

varying vec2 o_DiffuseMapCoordinates;
varying vec2 o_TextureCoordinates;


void main() {

    vec2 modelPosition = a_Position * u_LightRadius + u_LightPosition;

    o_DiffuseMapCoordinates = (u_DiffuseMapMatrix * vec3(modelPosition, 1.0)).xy;

    o_TextureCoordinates = (a_Position + 1.0) / 2.0;

    vec3 transformedPosition = u_CameraMatrix * vec3(modelPosition, 1.0);

    gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);   
}