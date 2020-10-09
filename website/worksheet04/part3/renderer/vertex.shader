precision mediump float;

uniform vec3 u_DirectionalLight;
uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

attribute vec3 a_Position;
attribute vec4 a_Color;

varying vec4 o_Color;

void main() {


    o_Color = a_Color;
    vec4 baseColor = vec4(a_Position.xyz, 1.0);
    // vec3 w_i = lightPos.w == 0.0 ? normalize(-lightPos.xyz) : normalize(lightPos.xyz - pos.xyz);

    vec4 modelPos = u_Model * vec4(a_Position.x, a_Position.y, a_Position.z, 1.0);

    // 1.0, 1.0, 1.0
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 surfaceNormal = a_Position;
    vec3 directionToLight = normalize(-u_DirectionalLight);
    vec3 incidentLight = lightColor;

    vec3 lightedColor = baseColor.xyz * incidentLight * max(dot(surfaceNormal, directionToLight), 0.0);

    vec4 position = u_ViewProjection * modelPos;
    gl_Position = position;  

    o_Color = vec4(lightedColor[0], lightedColor[1], lightedColor[2], 1.0);
    // o_Color.xyz = lightedColorv;
    // o_Color.w = 1.0;
}