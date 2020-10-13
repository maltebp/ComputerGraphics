precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

uniform vec3 u_AmbientColor;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;

attribute vec3 a_Position;
attribute vec4 a_Color;

varying vec4 o_Color;


void main() {
    o_Color = a_Color;

    vec4 baseColor = (vec4(a_Position.xyz, 1.0) + vec4(1.0, 1.0, 1.0, 1.0)) *  0.5;

    vec4 modelPos = u_Model * vec4(a_Position.x, a_Position.y, a_Position.z, 1.0);

    vec3 lightColor = u_LightColor;
    vec3 surfaceNormal = normalize(a_Position);
    vec3 directionToLight = normalize(-u_LightDirection);
    vec3 incidentLight = lightColor;

    vec3 lightedColor = baseColor.xyz * u_AmbientColor + baseColor.xyz * incidentLight * max(dot(surfaceNormal, directionToLight), 0.0) ;

    // Note on ambient color:
    // Instead of having a coefficient on the sphere, the ambient is the same for all objects
    // and its intensity is given in the color (1,1,1 is full intensity)

    vec4 position = u_ViewProjection * modelPos;
    gl_Position = position;  

    o_Color = vec4(lightedColor[0], lightedColor[1], lightedColor[2], 1.0);
}