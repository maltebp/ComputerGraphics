precision mediump float;

#define PI 3.1415926538


uniform vec3 u_AmbientEmission;

uniform sampler2D u_TextureSampler;

varying vec3 o_SurfaceNormal;
varying vec3 o_DiffuseLight;

void main(){
    
    // Renormalize surface normal
    vec3 surfaceNormal = normalize(o_SurfaceNormal);

    // Fetching texture
    float u = 1.0 - atan(surfaceNormal.z, surfaceNormal.x)/(2.0 * PI);
    float v = acos(surfaceNormal.y)/(PI);
    vec3 color = texture2D(u_TextureSampler, vec2(u, v)).xyz;

    // Lighting texture
    vec3 diffuse = color * o_DiffuseLight;
    vec3 ambience = color * u_AmbientEmission;

    gl_FragColor = vec4(diffuse + ambience, 1.0);
}