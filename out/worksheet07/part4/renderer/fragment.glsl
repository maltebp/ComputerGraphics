precision mediump float;

#define PI 3.1415926538

uniform samplerCube u_TextureSampler;
uniform sampler2D u_NormalMap;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;
uniform mat4 u_TextureMatrix;
uniform mediump int u_Reflection;
uniform vec3 u_ViewPosition;

varying vec3 o_SurfaceNormal;
varying vec3 o_TextureCoordinates;

void main(){

    gl_FragColor = textureCube(u_TextureSampler, o_TextureCoordinates);

    // if( u_Reflection == 1 ){
    //     float u = 1.0 - atan(surfaceNormal.z, surfaceNormal.x)/(2.0 * PI);
    //     float v = acos(surfaceNormal.y)/(PI);
    //     gl_FragColor = texture2D(u_NormalMap, vec2(u, v));

    // }else{

    // }
}