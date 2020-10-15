precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

uniform vec3 u_AmbientEmission;
uniform vec3 u_LightEmission;
uniform vec3 u_LightDirection;

attribute vec3 a_Position;
attribute vec4 a_Color;

varying vec4 o_Color;


void main() {

    // This assignment is not used
    // It only exists to make sure the color attribute exists
    o_Color = a_Color;

    vec3 surfaceNormal = normalize(a_Position.xyz);

    // Create base color from surface normal
    vec3 baseColor = (surfaceNormal + vec3(1.0, 1.0, 1.0)) *  0.5;

    vec4 modelPos = u_Model * vec4(a_Position.xyz, 1.0);

    vec3 directionToLight = normalize(-u_LightDirection);

    // Diffuse
    vec3 diffuse =  baseColor.xyz * u_LightEmission * max(dot(surfaceNormal, directionToLight), 0.0);

    // Ambience
    vec3 ambience = baseColor.xyz * u_AmbientEmission;

    // Final Color
    vec3 finalColor = diffuse + ambience;

    o_Color = vec4(finalColor.xyz, 1.0);

    vec4 position = u_ViewProjection * modelPos;
    gl_Position = position;  

    
}