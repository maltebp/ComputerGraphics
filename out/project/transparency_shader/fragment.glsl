#version 300 es

precision mediump float;

in vec4 o_Color;
in float o_Z;

layout(location = 0) out vec4 Accumulated;
layout(location = 1) out vec4 Revealage;




void main() {
    // Inspired by: http://casual-effects.blogspot.com/2014/03/weighted-blended-order-independent.html
    vec4 color = o_Color;

    float weight = 
      max(min(1.0, max(max(color.r, color.g), color.b) * color.a), color.a) *  clamp(0.03 / (0.00001 + pow(o_Z / 200.0, 4.0)), 0.01, 3000.0);

    Accumulated = vec4(color.rgb * weight, color.a);
    Revealage.r = color.a * weight;

}
