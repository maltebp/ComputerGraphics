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
attribute vec4 a_Color;

varying vec3 o_Normal;
varying vec3 o_Position;
varying vec3 o_ObserverDirection;
varying vec4 o_Color;


void main() {
    o_Color = a_Color;

    vec4 modelPos = u_Model * vec4(a_Position.xyz, 1.0);

    o_Normal = normalize(a_Position.xyz);
    o_Position = modelPos.xyz;
    o_ObserverDirection = normalize(u_CameraPos.xyz - modelPos.xyz);

    // Create base color from surface normal
    o_Color = vec4( ((o_Normal + vec3(1.0, 1.0, 1.0)) *  0.5).xyz, 1.0);

    gl_Position = u_ViewProjection * modelPos;
}