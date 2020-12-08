
precision mediump float;

// Light map texture (from framebuffer)
uniform sampler2D u_LightMap;

// Texture to draw combine with light map
uniform sampler2D u_Texture;

varying vec2 o_TextureCoordinates; 

void main() {
    
    // Note: not sure what alpha value we get from sampling, when
    // the buffer has not alpha channel. So to ensure I get fully opaque
    // I do go for this solution
    vec4 light = vec4(texture2D(u_LightMap, o_TextureCoordinates).rgb, 1.0);

    // Blend light into the base multiplying
    gl_FragColor = light;
}