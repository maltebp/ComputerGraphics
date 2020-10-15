precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

uniform vec3 u_AmbientColor;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;

uniform vec3 u_CameraPos;

attribute vec3 a_Position;
attribute vec4 a_Color;

varying vec4 o_Color;


void main() {

    // Just to remove the need for removing the color attribute
    // (it's getting optimized away)
    o_Color = a_Color;

    vec3 surfaceNormal = normalize(a_Position.xyz);

    vec3 baseColor = (surfaceNormal + vec3(1.0, 1.0, 1.0)) *  0.5;

    vec4 modelPos = u_Model * vec4(a_Position.xyz, 1.0);

    vec3 directionToObserver = normalize(u_CameraPos.xyz - modelPos.xyz);

    vec3 lightColor = u_LightColor;
    vec3 directionToLight = normalize(-u_LightDirection);
    vec3 incidentLight = lightColor;

    vec3 perfectReflection = normalize(2.0 * dot(directionToLight, surfaceNormal) * surfaceNormal - directionToLight);

    vec3 phong = baseColor.xyz * lightColor * pow(max(dot(perfectReflection, directionToObserver), 0.0), 200.0);

    //vec3 lightedColor = u_CameraPos.z < 0.0 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0); 

    vec3 lightedColor = 
    //     //baseColor.xyz * u_AmbientColor +
         phong + baseColor.xyz * incidentLight * max(dot(surfaceNormal, directionToLight), 0.0) ;

    // Note on ambient color:
    // Instead of having a coefficient on the sphere, the ambient is the same for all objects
    // and its intensity is given in the color (1,1,1 is full intensity)

    vec4 position = u_ViewProjection * modelPos;
    gl_Position = position;  

    o_Color = vec4(lightedColor.xyz, 1.0);
}