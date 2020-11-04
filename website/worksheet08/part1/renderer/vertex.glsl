precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

attribute vec3 a_Position;

varying vec3 o_TextureCoordinates;


void main() {

    /*
        While this solution proposed by the exercise does work in this case,
        it's sort of hardcoded to handle these two scenarios (sphere and background).
        If we translate the sphere, the mapping will fail, as the sphere's texture
        coordinates are based on its normals, and they have to be calculated after
        the model transformation. Of course, we could transform the position with
        w = 0, but it doesn't change the fact, that this is not a general solution
        to mapping the texture coordinates. Probably what we optimally would want,
        is to have access to the surface normals, and then render the background (
        skybox) in it's own render pass.    
    */

    vec3 surfaceNormal = (u_Model * vec4(a_Position, 0.0)).xyz;

    o_TextureCoordinates = surfaceNormal;
    
    gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 1.0); 
}