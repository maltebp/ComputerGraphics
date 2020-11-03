precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

uniform mat4 u_TextureMatrix;

uniform vec3 u_LightEmission;
uniform vec3 u_LightDirection;

attribute vec3 a_Position;
attribute vec4 a_Color;

varying vec3 o_SurfaceNormal;
varying vec3 o_DiffuseLight;

varying vec4 o_Color;
varying vec4 o_PixelDirection;

varying vec3 o_TextureCoordinates;


void main() {

    // Just there to prevent a_Color from being optimized away
    o_Color = a_Color;
    
    o_SurfaceNormal = normalize(a_Position.xyz);

    // Calculating diffuse light on vertex shader, and interpolate it
    vec3 surfaceNormal = normalize((u_Model * vec4(a_Position.xyz, 0)).xyz);
    vec3 directionToLight = normalize(-u_LightDirection);

    // Using "modelized" surface normal to ensure light won't follow the rotaiton of the sphere
    o_DiffuseLight = u_LightEmission * max(dot(surfaceNormal, directionToLight), 0.0); 
    
    o_TextureCoordinates = (u_TextureMatrix * vec4(a_Position, 1.0)).xyz;   

    gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 1.0);
}