precision mediump float;

uniform mat4  u_View;
uniform mat4  u_ViewProjection; 
uniform vec3  u_Color;
uniform vec3  u_Position;
uniform float u_Size;

attribute vec2 a_Position;
attribute vec2 a_TextureCoordinates;

varying vec3 o_Color;
varying vec2 o_TextureCoordinates;

void main() {
    // Camera up- and right-vectors in world space
    vec3 camRight   = vec3(u_View[0][0], u_View[1][0], u_View[2][0]);
    vec3 camUp      = vec3(u_View[0][1], u_View[1][1], u_View[2][1]);

    vec3 worldPos = vec3(
        u_Position
        + camRight  * a_Position.x * u_Size
        + camUp     * a_Position.y * u_Size
    );

    o_Color = u_Color;
    o_TextureCoordinates = a_TextureCoordinates;

    gl_Position = u_ViewProjection * vec4(worldPos, 1.0);
}