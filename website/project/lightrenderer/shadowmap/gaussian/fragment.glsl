
precision mediump float;
  
uniform sampler2D u_SourceTexture;
uniform sampler2D u_OcclusionMap;
uniform int u_Horizontal;
uniform int u_TextureSize;

varying vec2 o_TextureCoordinates;

void main() {  

    // Kernel size: 17
    // Sigma: 4
    // Source: http://dev.theomader.com/gaussian-kernel-calculator/
    float WEIGHTS[9];
    
    WEIGHTS[0] = 0.102934;
    WEIGHTS[1] = 0.099783;
    WEIGHTS[2] = 0.090898;
    WEIGHTS[3] = 0.077812;
    WEIGHTS[4] = 0.062595;
    WEIGHTS[5] = 0.047318;
    WEIGHTS[6] = 0.033613;
    WEIGHTS[7] = 0.022439;
    WEIGHTS[8] = 0.014076;      

    // Distance between texels we sample (in texture coordinates)
    // This increases blur
    float tex_offset = 8.0 / float(u_TextureSize);
    
    // Distance from light (Further away pixels are blurred less)
    float dist = length(o_TextureCoordinates * 2.0 - 1.0);
    float distFactor = dist*dist;

    vec3 result = texture2D(u_SourceTexture, o_TextureCoordinates).rgb; 

    // Weighting of existing color
    result *= WEIGHTS[0];  

    if(u_Horizontal == 1)  
        // Horizontal samples     
        for(int i = 1; i < 9; i++ ) {
            result += texture2D(u_SourceTexture, o_TextureCoordinates + vec2(tex_offset * float(i) * distFactor, 0.0)).rgb * WEIGHTS[i];
            result += texture2D(u_SourceTexture, o_TextureCoordinates - vec2(tex_offset * float(i) * distFactor, 0.0)).rgb * WEIGHTS[i];
        }
    else
        // Vertical samples
        for(int i = 1; i < 9; i++ ) {
            result += texture2D(u_SourceTexture, o_TextureCoordinates + vec2(0.0, tex_offset * float(i) * distFactor)).rgb * WEIGHTS[i];
            result += texture2D(u_SourceTexture, o_TextureCoordinates - vec2(0.0, tex_offset * float(i) * distFactor)).rgb * WEIGHTS[i];
        }
   
    gl_FragColor = vec4(result, 1.0);
}