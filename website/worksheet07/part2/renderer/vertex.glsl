precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;
uniform mat4 u_TextureMatrix;

attribute vec3 a_Position;

varying vec3 o_TextureCoordinates;


void main() {

    

    // We need the normal of the surface of the sphere, and to ensure that the texture
    // doesn't move with the sphere we have to multiply by the rotation and scaling
    vec4 scaledRotatedPos = vec4((u_Model * vec4(a_Position, 0.0)).xyz, 1.0);
    o_TextureCoordinates = (u_TextureMatrix * scaledRotatedPos).xyz;

    gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 1.0); 
}