
precision mediump float;

varying vec4 o_Color;

void main() {

    gl_FragColor = o_Color;
    gl_FragColor = vec4(1,1,1,1);
}