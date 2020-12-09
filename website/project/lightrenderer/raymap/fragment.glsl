
precision mediump float;

#define PI 3.1415926538
#define PI2 6.28318530718

// For loop needs a limit
#define MAX_SAMPLES 5000

uniform int u_NumRays;
uniform int u_SamplesPerRay;

// The light's position and radius in the
// occlusion map's texture space
uniform vec2 u_LightPosition;
uniform float u_LightRadius;

uniform sampler2D u_OcclusionMap;

void main() {
    // Each fragment is a ray

    float finalRadius = 1.0;

    float rayAngle = gl_FragCoord.x / float(u_NumRays) * PI2;
    vec2 rayDirection = vec2( cos(rayAngle), sin(rayAngle) );

    for( int i=0; i < MAX_SAMPLES; i++ ) {
        // Loop range can't be determined by uniform,
        // so this a "hack" to bypass this
        if( i >= u_SamplesPerRay) break;

        // How far we've travelled along the ray in percentage [0,1]
        float distanceFactor = float(i+1) /  float(u_SamplesPerRay);
        float dist = distanceFactor * u_LightRadius;

        // Point on ray within the occlusion map
        vec2 samplePoint = rayDirection * dist + u_LightPosition;
        
        vec4 occlusion = texture2D(u_OcclusionMap, samplePoint);

        // Red color channel determines if the pixels occludes
        // the light
        if( occlusion.r > 0.02 ){
            finalRadius = distanceFactor ;
            break;
        }
    }

    gl_FragColor = vec4(finalRadius, 0, 0, 1);
}