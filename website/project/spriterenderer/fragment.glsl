
precision mediump float;

uniform sampler2D u_Textures[16];

varying vec3 o_Color;
varying float o_TextureSlot;
varying vec2 o_TextureCoordinates;

void main() {

    // If texture slot is passed as 0 it's just a white texture
    int textureSlot = int(o_TextureSlot-1.0);
    vec4 textureColor = vec4(1,1,1,1);
    if( textureSlot >= 0 )
        // Since we cant index an array using a non-constant value, we can do
        // this little trick. Might slow down the shader a bit due to branching
        for( int i=0; i<16; i++)
            if( textureSlot == i )
                textureColor = texture2D(u_Textures[i], o_TextureCoordinates);


    // Make sure we don't have partially transparent sprites
    textureColor.a = float(int(textureColor.a));

    gl_FragColor = textureColor * vec4(o_Color, 1.0);
}