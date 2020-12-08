

// In lack of a better name...
// It finds the correct texture coordinates, such we get correctly
// sized and rotated tiles
uniform mat3 u_TextureMatrix;

attribute vec2 a_Position;

varying vec2 o_TextureCoordinates;

void main() {
    o_TextureCoordinates = (u_TextureMatrix * vec3(a_Position, 1.0)).xy;

    // Figure out which depth to use
    gl_Position = vec4(a_Position, 0.0, 1.0);
}