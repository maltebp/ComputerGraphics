
precision mediump float;

#define PI2 6.28318530718

#define BLUR_SAMPLES 4
#define BLUE_

uniform sampler2D u_RayMap;


varying vec2 o_Position;


//sample from the 1D distance map
// Returns 0 if samples distance is less than radius and 1 otherwise
float sample(vec2 coord, float radius) {
	return step(radius, texture2D(u_RayMap, coord).r);
}


void main() {
    
    // Radius in interval of [0, 1.0]
    float radius = length(o_Position*2.0) + 0.001;
    float angle = atan(o_Position.y, o_Position.x);
    if( angle < 0.0 ) angle += PI2; 

    vec2 tc = vec2(angle / PI2, 0.0);

    //the center tex coord, which gives us hard shadows
	float center = sample(tc, radius);        
	
	//we multiply the blur amount by our distance from center
	//this leads to more blurriness as the shadow "fades away"
	float blur = (1./200.0)  * smoothstep(0., 1., radius); 
	
	//now we use a simple gaussian blur
    float sum = 0.0;
    sum = center;

    // if( center > 0.95 ){

    // } else {

    //     sum += sample(vec2(tc.x - 4.0*blur, tc.y), radius) * 0.05;
    //     sum += sample(vec2(tc.x - 3.0*blur, tc.y), radius) * 0.09;
    //     sum += sample(vec2(tc.x - 2.0*blur, tc.y), radius) * 0.12;
    //     sum += sample(vec2(tc.x - 1.0*blur, tc.y), radius) * 0.15;

    //     // sum += center * 0.16;

    //     sum += sample(vec2(tc.x + 1.0*blur, tc.y), radius) * 0.15;
    //     sum += sample(vec2(tc.x + 2.0*blur, tc.y), radius) * 0.12;
    //     sum += sample(vec2(tc.x + 3.0*blur, tc.y), radius) * 0.09;
    //     sum += sample(vec2(tc.x + 4.0*blur, tc.y), radius) * 0.05;

    //     sum *= 2.0;
    // }

    // if( center > 0.95 ){
    //     sum = center;
    // } else {
    //     float sum1 = 0.0;
    //     sum1 += sample(vec2(tc.x - 6.0*blur, 0), radius) * 0.005;
    //     sum1 += sample(vec2(tc.x - 5.5*blur, 0), radius) * 0.010;
    //     sum1 += sample(vec2(tc.x - 5.0*blur, 0), radius) * 0.015;
    //     sum1 += sample(vec2(tc.x - 4.5*blur, 0), radius) * 0.020;
    //     sum1 += sample(vec2(tc.x - 4.0*blur, 0), radius) * 0.025;
    //     sum1 += sample(vec2(tc.x - 3.5*blur, 0), radius) * 0.030;
    //     sum1 += sample(vec2(tc.x - 3.0*blur, 0), radius) * 0.035;
    //     sum1 += sample(vec2(tc.x - 2.5*blur, 0), radius) * 0.040;
    //     sum1 += sample(vec2(tc.x - 2.0*blur, 0), radius) * 0.045;
    //     sum1 += sample(vec2(tc.x - 1.5*blur, 0), radius) * 0.050;
    //     sum1 += sample(vec2(tc.x - 1.0*blur, 0), radius) * 0.055;


    //     float sum2 = 0.0;
    //     sum2 += sample(vec2(tc.x + 1.0*blur, 0), radius) * 0.055;
    //     sum2 += sample(vec2(tc.x + 1.5*blur, 0), radius) * 0.050;
    //     sum2 += sample(vec2(tc.x + 2.0*blur, 0), radius) * 0.045;
    //     sum2 += sample(vec2(tc.x + 2.5*blur, 0), radius) * 0.040;
    //     sum2 += sample(vec2(tc.x + 3.0*blur, 0), radius) * 0.035;
    //     sum2 += sample(vec2(tc.x + 3.5*blur, 0), radius) * 0.030;
    //     sum2 += sample(vec2(tc.x + 4.0*blur, 0), radius) * 0.025;
    //     sum2 += sample(vec2(tc.x + 4.5*blur, 0), radius) * 0.020;
    //     sum2 += sample(vec2(tc.x + 5.0*blur, 0), radius) * 0.015;
    //     sum2 += sample(vec2(tc.x + 5.5*blur, 0), radius) * 0.010;
    //     sum2 += sample(vec2(tc.x + 6.0*blur, 0), radius) * 0.005;

    //     sum1 *= 4.0;
    //     sum2 *= 4.0;
    //     sum = sum1 + sum2;
    // }
	
	
	
	//sum of 1.0 -> in light, 0.0 -> in shadow
 	
 	//multiply the summed amount by our distance, which gives us a radial falloff
 	//then multiply by vertex (light) color

    // float alphaFactor = 1.0 - smoothstep(0.0, 1.0, radius);
    // float alphaFactor = 1.0-radius;// - smoothstep(0.0, 1.0, radius);
    float alphaFactor = 1.0;

 	gl_FragColor = vec4(1,0,0,1) * vec4(1, 1, 1, sum * alphaFactor );

    // //the center tex coord, which gives us hard shadows
	// float center = sample(tc, radius);   

    // float rayDist = texture2D(u_RayMap, ).r;
    
    // if( rayDist < radius )
    //     discard;

    // gl_FragColor = vec4(1, 0, 0, 1.0-sqrt(radius));
    // // gl_FragColor = vec4(1, 0, 0, 1.0/(1.0+0.1*radius+100.0*radius*radius));
}