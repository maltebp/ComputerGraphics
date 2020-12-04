
precision mediump float;

void main() {
    gl_FragColor = vec4( gl_FragCoord.x/256.0, 0, 0, 1);
}