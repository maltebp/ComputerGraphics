precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

uniform vec3 u_AmbientEmission;
uniform vec3 u_LightEmission;
uniform vec3 u_LightDirection;

uniform float u_MaterialAmbient;
uniform float u_MaterialDiffuse;
uniform float u_MaterialSpecular;

uniform float u_MaterialPhongExponent;

uniform vec3 u_CameraPos;

attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute vec4 a_Color;

varying vec3 o_Normal;
varying vec3 o_Position;
varying vec3 o_ObserverDirection;
varying vec4 o_Color;


void main() {

    vec4 modelPos = u_Model * vec4(a_Position.xyz, 1.0);

    o_Normal = a_Normal;
    o_Position = modelPos.xyz;
    o_ObserverDirection = normalize(u_CameraPos.xyz - modelPos.xyz);
    o_Color = a_Color;

    gl_Position = u_ViewProjection * modelPos;
}