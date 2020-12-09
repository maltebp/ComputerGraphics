uniform mat3 u_CameraMatrix;

attribute vec2 a_Position;
attribute float a_Depth;
attribute vec4 a_Color;

varying vec4 o_Color;

void main() {
    o_Color = a_Color;

    gl_Position = vec4(a_Depth, 0,0,1);

    gl_Position = vec4((u_CameraMatrix * vec3(a_Position, 1.0)).xy, 0, 1.0);   
}