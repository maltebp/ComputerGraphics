#version 300 es

precision highp float;

in vec2 o_TexCoords;

uniform sampler2D u_ColorTexture;
uniform sampler2D u_AlphaTexture;

out vec4 FragColor;

void main() {




    vec4 accum = texture(u_ColorTexture, o_TexCoords);
    float reveal = accum.a;


    accum.a = texture(u_AlphaTexture, o_TexCoords).r;

    //  if(reveal == 1.0) discard;

    // Blend Func: GL_ONE_MINUS_SRC_ALPHA, GL_SRC_ALPHA
    FragColor = vec4(accum.rgb / max(accum.a, 0.00001), reveal);
}