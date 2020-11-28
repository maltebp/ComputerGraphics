precision mediump float;

uniform mat4 u_LightViewProjection;

uniform sampler2D u_ShadowMap;
uniform sampler2D u_TextureSampler;

varying vec2 o_TextureCoordinates;
varying vec3 o_Position;


float unpackDepth(const in vec4 rgbaDepth) {
    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
    return dot(rgbaDepth, bitShift);
}


void main(){

    vec4 positionInLightSpace = u_LightViewProjection * vec4(o_Position, 1.0);

    vec4 shadowCoordinates = 0.5 * positionInLightSpace / positionInLightSpace.w + 0.5;

    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoordinates.xy);
    float shadowDepth = unpackDepth(rgbaDepth);

    float visibility = 1.0;
    if(shadowCoordinates.z > shadowDepth + 0.005)
        visibility = 0.5;  

    // gl_FragColor = texture2D(u_TextureSampler, o_TextureCoordinates);
    //gl_FragColor = texture2D(u_ShadowMap, o_TextureCoordinates);//vec4(shadowDepth, shadowDepth, shadowDepth, 1.0); 
    gl_FragColor = texture2D(u_TextureSampler, o_TextureCoordinates) * visibility;
}