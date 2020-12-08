
// uniform mat3 u_CameraMatrix;

// uniform float u_Radius;

attribute vec2 a_Position;

varying vec2 o_Position;

void main() {

    o_Position = a_Position;

    // vec3 transformedPosition = u_CameraMatrix * vec3(a_Position * u_Radius, 1.0);
    vec3 transformedPosition = vec3(a_Position, 1.0);

    gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);   
}