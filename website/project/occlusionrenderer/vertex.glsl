uniform mat3 u_CameraMatrix;

attribute vec2 a_Position;

void main() {
    gl_Position = vec4((u_CameraMatrix * vec3(a_Position, 1.0)).xy,0.0, 1.0);   
}