
precision mediump float;

#define PI2 6.28318530718

#define BLUR_SAMPLES 4
  

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
    
    // WEIGHTS[0] = 1.0;
    WEIGHTS[0] = 0.102934;
    WEIGHTS[1] = 0.099783;
    WEIGHTS[2] = 0.090898;
    WEIGHTS[3] = 0.077812;
    WEIGHTS[4] = 0.062595;
    WEIGHTS[5] = 0.047318;
    WEIGHTS[6] = 0.033613;
    WEIGHTS[7] = 0.022439;
    WEIGHTS[8] = 0.014076;      

    float dist = length(o_TextureCoordinates * 2.0 - 1.0);

    float tex_offset = 12.0 / float(u_TextureSize); //textureSize(u_SourceTexture, 0); // gets size of single texel // TODO: Calculate this as uniform
    vec3 result = texture2D(u_SourceTexture, o_TextureCoordinates).rgb; 
    
    float factorPositive = 0.0;
    float factorNegative = 0.0;
    
    float distFactor = dist*dist;
    float weightFactor = 1.8;

    // vec3 result = vec3(0,0,0);
    if( result.r < 0.99) {
        result *= WEIGHTS[0];  
        if(u_Horizontal == 1)
                {
                    
            for(int i = 1; i < 9; ++i)
            {
                result += texture2D(u_SourceTexture, o_TextureCoordinates + vec2(tex_offset * float(i) * distFactor, 0.0)).rgb * WEIGHTS[i] * weightFactor;
                result += texture2D(u_SourceTexture, o_TextureCoordinates - vec2(tex_offset * float(i) * distFactor, 0.0)).rgb * WEIGHTS[i] * weightFactor;
            }
        }
        else
        {
            for(int i = 1; i < 9; ++i)
            {
                result += texture2D(u_SourceTexture, o_TextureCoordinates + vec2(0.0, tex_offset * float(i) * distFactor)).rgb * WEIGHTS[i] * weightFactor;
                result += texture2D(u_SourceTexture, o_TextureCoordinates - vec2(0.0, tex_offset * float(i) * distFactor)).rgb * WEIGHTS[i] * weightFactor;
            }
        }
    }
   

    

    gl_FragColor = vec4(result, 1.0);
}




// uniform sampler2D u_TargetBuffer;

// varying vec2 o_Position;


// //sample from the 1D distance map
// // Returns 0 if samples distance is less than radius and 1 otherwise
// float sample(vec2 coord, float radius) {
// 	return step(radius, texture2D(u_RayMap, coord).r);
// }


// void main() {
    
//     // Radius in interval of [0, 1.0]
//     float radius = length(o_Position*2.0) + 0.001;
//     float angle = atan(o_Position.y, o_Position.x);
//     if( angle < 0.0 ) angle += PI2; 

//     vec2 tc = vec2(angle / PI2, 0.0);

//     //the center tex coord, which gives us hard shadows
// 	float center = sample(tc, radius);        
	
// 	//we multiply the blur amount by our distance from center
// 	//this leads to more blurriness as the shadow "fades away"
// 	float blur = (1./100.0)  * smoothstep(0., 1., radius); 
	
// 	//now we use a simple gaussian blur
// 	float sum = 0.0;


//     if( center > 0.95 ){
//         sum = center;
//     } else {
//         float sum1 = 0.0;
//         sum1 += sample(vec2(tc.x - 6.0*blur, 0), radius) * 0.005;
//         sum1 += sample(vec2(tc.x - 5.5*blur, 0), radius) * 0.010;
//         sum1 += sample(vec2(tc.x - 5.0*blur, 0), radius) * 0.015;
//         sum1 += sample(vec2(tc.x - 4.5*blur, 0), radius) * 0.020;
//         sum1 += sample(vec2(tc.x - 4.0*blur, 0), radius) * 0.025;
//         sum1 += sample(vec2(tc.x - 3.5*blur, 0), radius) * 0.030;
//         sum1 += sample(vec2(tc.x - 3.0*blur, 0), radius) * 0.035;
//         sum1 += sample(vec2(tc.x - 2.5*blur, 0), radius) * 0.040;
//         sum1 += sample(vec2(tc.x - 2.0*blur, 0), radius) * 0.045;
//         sum1 += sample(vec2(tc.x - 1.5*blur, 0), radius) * 0.050;
//         sum1 += sample(vec2(tc.x - 1.0*blur, 0), radius) * 0.055;


//         float sum2 = 0.0;
//         sum2 += sample(vec2(tc.x + 1.0*blur, 0), radius) * 0.055;
//         sum2 += sample(vec2(tc.x + 1.5*blur, 0), radius) * 0.050;
//         sum2 += sample(vec2(tc.x + 2.0*blur, 0), radius) * 0.045;
//         sum2 += sample(vec2(tc.x + 2.5*blur, 0), radius) * 0.040;
//         sum2 += sample(vec2(tc.x + 3.0*blur, 0), radius) * 0.035;
//         sum2 += sample(vec2(tc.x + 3.5*blur, 0), radius) * 0.030;
//         sum2 += sample(vec2(tc.x + 4.0*blur, 0), radius) * 0.025;
//         sum2 += sample(vec2(tc.x + 4.5*blur, 0), radius) * 0.020;
//         sum2 += sample(vec2(tc.x + 5.0*blur, 0), radius) * 0.015;
//         sum2 += sample(vec2(tc.x + 5.5*blur, 0), radius) * 0.010;
//         sum2 += sample(vec2(tc.x + 6.0*blur, 0), radius) * 0.005;

//         sum1 *= 4.0;
//         sum2 *= 4.0;
//         sum = sum1 + sum2;
//     }
	
	
	
// 	//sum of 1.0 -> in light, 0.0 -> in shadow
 	
//  	//multiply the summed amount by our distance, which gives us a radial falloff
//  	//then multiply by vertex (light) color

//     // float alphaFactor = 1.0 - smoothstep(0.0, 1.0, radius);
//     // float alphaFactor = 1.0-radius;// - smoothstep(0.0, 1.0, radius);
//     float alphaFactor = 1.0;

//  	gl_FragColor = vec4(1,0,0,1) * vec4(1, 1, 1, sum * alphaFactor );

//     // //the center tex coord, which gives us hard shadows
// 	// float center = sample(tc, radius);   

//     // float rayDist = texture2D(u_RayMap, ).r;
    
//     // if( rayDist < radius )
//     //     discard;

//     // gl_FragColor = vec4(1, 0, 0, 1.0-sqrt(radius));
//     // // gl_FragColor = vec4(1, 0, 0, 1.0/(1.0+0.1*radius+100.0*radius*radius));
// }