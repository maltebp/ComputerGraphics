
precision mediump float;

#define PI2 6.28318530718

#define BLUR_SAMPLES 4

uniform sampler2D u_RayMap;

varying vec2 o_Position;


void main() {
    // In each fragment we check if any light reaches it,
    // by checking if a ray passes through the fragment

    // Distance from light center [0, 1.0]
    float fragmentDistance = length(o_Position);

    // Angle of ray passing through the fragment
    float angle = atan(o_Position.y, o_Position.x);
    if( angle < 0.0 ) angle += PI2; 

    // Convert angle to [0,1] interval
    float angleFactor = angle / PI2;

    // Sample distance of ray passing trough fragment
    float rayDistance = texture2D(u_RayMap, vec2(angleFactor, 0)).r;

    // Render white is ray passes through fragment,
    // otherwise black
    if( rayDistance < fragmentDistance )
        gl_FragColor = vec4(0,0,0,1);
    else
        gl_FragColor = vec4(1,1,1,1);
}