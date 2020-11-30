precision mediump float;


uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

uniform vec3 u_AmbientEmission;
uniform vec3 u_LightEmission;

uniform float u_MaterialAmbient;
uniform float u_MaterialDiffuse;
uniform float u_MaterialSpecular;

uniform float u_MaterialPhongExponent;

uniform vec3 u_CameraPos;

varying vec3 o_ObserverDirection;
varying vec3 o_Normal;
varying vec4 o_Color;
varying vec3 o_DirectionToLight;

void main(){

    // Renormalizing direction vectors
    vec3 surfaceNormal = normalize(o_Normal);
    vec3 directionToObserver = normalize(o_ObserverDirection);
    vec3 directionToLight = normalize(o_DirectionToLight);

    vec3 baseColor = o_Color.xyz;

    // Specular
    vec3 perfectReflection = normalize(2.0 * dot(directionToLight, surfaceNormal) * surfaceNormal - directionToLight);
    vec3 specular = u_MaterialSpecular * baseColor * u_LightEmission * pow(max(dot(perfectReflection, directionToObserver), 0.0), u_MaterialPhongExponent);

    // Diffuse
    vec3 diffuse =  u_MaterialDiffuse * baseColor * u_LightEmission * max(dot(surfaceNormal, directionToLight), 0.0);

    // Ambience
    vec3 ambience = u_MaterialAmbient * baseColor * u_AmbientEmission;

    // Final Color
    vec3 finalColor = specular + diffuse + ambience;
    
    gl_FragColor = vec4(finalColor.xyz, 1.0);
}