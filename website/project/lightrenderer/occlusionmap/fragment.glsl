// TODO: Remove this
// precision mediump float;

// varying float o_Diffuse;

// void main() {
//     gl_FragColor = vec4(1.0, o_Diffuse, 1.0, 1.0);
// }

precision mediump float;

uniform sampler2D u_Textures[16];

varying vec3 o_Color;
varying float o_Diffuse;
varying float o_TextureSlot;
varying vec2 o_TextureCoordinates;

void main() {

    // If texture slot is passed as 0 it's just a white texture
    int textureSlot = int(o_TextureSlot)-1;
    vec4 textureColor = vec4(1,1,1,1);
    if( textureSlot >= 0 )
        // Since we cant index an array using a non-constant value, we can do
        // this little trick. Might slow down the shader a bit due to branching
        for( int i=0; i<16; i++)
            if( textureSlot == i )
                textureColor = texture2D(u_Textures[i], o_TextureCoordinates);


    // Make sure we don't have partially transparent sprites
    textureColor.a = float(int(textureColor.a));

    gl_FragColor = vec4(textureColor.a, textureColor.a, textureColor.a, 1.0) * vec4(1.0, o_Diffuse, 1.0, 1.0);
}