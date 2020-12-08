
precision mediump float;

#define PI2 6.28318530718

#define BLUR_SAMPLES 4

uniform sampler2D u_RayMap;

varying vec2 o_Position;


//sample from the 1D distance map
// Returns 0 if samples distance is less than radius and 1 otherwise
float sample(vec2 coord, float radius) {
	return step(radius, texture2D(u_RayMap, coord).r);
}


void main() {
    
    // Radius in interval of [0, 1.0]
    float radius = length(o_Position) + 0.001; // TODO: Why this error correction?
    float angle = atan(o_Position.y, o_Position.x);
    if( angle < 0.0 ) angle += PI2; 

    vec2 tc = vec2(angle / PI2, 0.0);

    //the center tex coord, which gives us hard shadows
	float center = sample(tc, radius);        
	
	//we multiply the blur amount by our distance from center
	//this leads to more blurriness as the shadow "fades away"
	// float blur = (1./200.0)  * smoothstep(0., 1., radius); 
	
	//now we use a simple gaussian blur
    // float sum = 0.0;
    // sum = center;

    // float alphaFactor = 1.0;

 	gl_FragColor = vec4(vec3(1,1,1)*center, 1);
}