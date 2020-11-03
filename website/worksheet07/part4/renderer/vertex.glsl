precision mediump float;

#define PI 3.1415926538


uniform samplerCube u_TextureSampler;
uniform sampler2D u_NormalMap;
uniform mat4 u_ViewProjection;
uniform mat4 u_Model;
uniform mat4 u_TextureMatrix;
uniform mediump int u_Reflection;
uniform vec3 u_ViewPosition;


attribute vec3 a_Position;


varying vec3 o_SurfaceNormal;
varying vec3 o_TextureCoordinates;



vec3 rotate_to_normal(vec3 normal, vec3 v) {
    float a = 1.0/(1.0 + normal.z);
    float b = -normal.x*normal.y*a;
    return vec3(1.0 - normal.x*normal.x*a, b, -normal.x)*v.x
    + vec3(b, 1.0 - normal.y*normal.y*a, -normal.y)*v.y
    + normal*v.z;
} 


void main() {

    vec4 modelPos = u_Model * vec4(a_Position, 1.0); 

    if( u_Reflection == 1  ){
        vec3 incident = modelPos.xyz - u_ViewPosition;
        vec3 surfaceNormal = normalize(modelPos.xyz);

        float u = 1.0 - atan(surfaceNormal.z, surfaceNormal.x)/(2.0 * PI);
        float v = acos(surfaceNormal.y)/(PI);
        
        vec3 mappedNormal = rotate_to_normal(surfaceNormal, texture2D(u_NormalMap, vec2(u, v)).xyz*2.0 - vec3(1,1,1)); 
        o_TextureCoordinates = reflect(incident, mappedNormal);
    }else{
        o_TextureCoordinates = (u_TextureMatrix * modelPos).xyz;
    }

    gl_Position = u_ViewProjection * modelPos; 
}



