precision mediump float;

uniform sampler2D u_Texture;

varying vec3 o_Color;
varying vec2 o_TextureCoordinates;


void main(){


    gl_FragColor = texture2D(u_Texture, o_TextureCoordinates) * vec4(o_Color, 1.0);
    // gl_FragColor = vec4( o_TextureCoordinates, 0.0, 1.0);
}