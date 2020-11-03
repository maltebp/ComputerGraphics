precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;
uniform mat4 u_TextureMatrix;

uniform int u_Reflection;

uniform vec3 u_ViewPosition;

attribute vec3 a_Position;

varying vec3 o_TextureCoordinates;


void main() {

    vec4 modelPos = u_Model * vec4(a_Position, 1.0); 

    if( u_Reflection == 1  ){
        vec3 incident = modelPos.xyz - u_ViewPosition;
        o_TextureCoordinates = reflect(incident, normalize(modelPos.xyz));
    }else{
        o_TextureCoordinates = (u_TextureMatrix * modelPos).xyz;
    }

    gl_Position = u_ViewProjection * modelPos; 
}