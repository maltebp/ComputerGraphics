#version 300 es


precision mediump float;



in vec4 o_Color;


layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec4 FragDepth;

void main() {
    // FragColor = o_Color;
    FragDepth = o_Color;
}