
// Just draw full screen (the 1 dimensional array),
// so no transformations here

attribute vec2 a_Position;

void main() {
    gl_Position = vec4(a_Position, 0.0, 1.0);   
}