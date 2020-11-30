attribute vec2 a_Position;
attribute vec3 a_Color;

uniform vec2 u_BallPosition;


varying vec4 o_Color;

void main() {
    o_Color = vec4(a_Color, 1.0);
    vec2 transformedPosition = a_Position + u_BallPosition;
    gl_Position = vec4(transformedPosition.x, transformedPosition.y, 1.0, 1.0);   
    gl_PointSize = 20.0;
}