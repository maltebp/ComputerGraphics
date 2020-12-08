
precision mediump float;

varying float o_Diffuse;

void main() {
    gl_FragColor = vec4(1.0, o_Diffuse, 1.0, 1.0);
}