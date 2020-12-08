
precision mediump float;

#define PI 3.1415926538
#define PI2 6.28318530718

#define MAX_SAMPLES 1000

uniform int u_NumRays;
uniform int u_SamplesPerRay;

// The light's position and radius in the
// occlusion map's texture space
uniform vec2 u_LightPosition;
uniform float u_LightRadius;

uniform sampler2D u_OcclusionMap;


void main() {

    float finalRadius = 1.0;

    float rayAngle = gl_FragCoord.x / float(u_NumRays) * PI2;
    vec2 rayDirection = vec2( cos(rayAngle), sin(rayAngle) );

    for( int i=0; i < MAX_SAMPLES; i++ ) {
        if( i >= u_SamplesPerRay){
            break;
        }

        // Goes from 0 to 1
        float distanceFactor = float(i+1) /  float(u_SamplesPerRay);
        float dist = distanceFactor * u_LightRadius;

        vec2 samplePoint = rayDirection * dist + u_LightPosition;
        
        vec4 occlusion = texture2D(u_OcclusionMap, samplePoint);

        if( occlusion.r < 0.98 ){
            finalRadius = distanceFactor ;
            break;
        }

    }

    gl_FragColor = vec4(finalRadius, 0, 0, 1);
    // gl_FragColor = vec4(1.0, 0, 0, 1);
}



 // Ray to coordinates
        // vec2 coord = vec2(-rayRadius * sin(theta), -r * cos(theta))/2.0 + 0.5;


        // float normalizedY = gl_FragCoord.y
        
        // vec2 occlusionCoordinates = 2 * vec2(x, y) / 256.0 - 1.0;

        // float rayAngle = PI * 1.5 + occlusionCoordinates.x * PI;
        // float rayRadius = (1.0 + norm.y) * 0.5;


        // vec2 coord = vec2(-rayRadius * sin(theta), -r * cos(theta)) / 2.0 + 0.5; 