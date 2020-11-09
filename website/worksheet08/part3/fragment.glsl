precision mediump float;

uniform sampler2D u_TextureSampler0;
uniform sampler2D u_TextureSampler1;
uniform int u_Shadows;

varying vec2 o_TextureCoordinates;
varying float o_TextureIndex;

void main(){

    if( u_Shadows == 1 ){
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    } 

    // Convert texture varying texture index to integer value
    int adjustedTextureIndex = int(o_TextureIndex+0.5);

    if( adjustedTextureIndex == 0 ) {
        gl_FragColor = texture2D(u_TextureSampler0, o_TextureCoordinates);
    }
    else if ( adjustedTextureIndex == 1 ) {
        gl_FragColor = texture2D(u_TextureSampler1, o_TextureCoordinates);
    }
}