precision mediump float;

uniform sampler2D u_Texture;

varying vec3 o_Color;
varying vec2 o_TextureCoordinates;


void main(){
    vec4 textureColor = texture2D(u_Texture, o_TextureCoordinates);
    gl_FragColor = textureColor + textureColor * vec4(o_Color, 1.0);//vec4(textureColor.rgb*0.5 + o_Color, 0.25);
}