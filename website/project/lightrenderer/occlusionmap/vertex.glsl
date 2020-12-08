
// Center of the occlusion map in world coordinates
uniform mat3 u_CameraMatrix;

attribute vec2 a_Position;

void main() {
    
    vec2 transformedPosition = (u_CameraMatrix * vec3(a_Position, 1.0)).xy;

    gl_Position = vec4(transformedPosition, 0.0, 1.0);   
}