precision mediump float;

uniform mat4 u_LightViewProjection;

// Textures
uniform sampler2D u_ShadowMap;
uniform sampler2D u_TextureSampler;

// Light uniforms
uniform vec3 u_AmbientEmission;
uniform vec3 u_LightEmission;

// Fragment outputs
varying vec2 o_TextureCoordinates;
varying vec3 o_Position;
varying vec3 o_DirectionToObserver;
varying vec3 o_DirectionToLight;


float unpackDepth(const in vec4 rgbaDepth) {
    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
    return dot(rgbaDepth, bitShift);
}


void main(){

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Light

    // Material settings
    const float MAT_AMBIENT = 0.5;
    const float MAT_DIFFUSE = 0.5;
    const float MAT_SPECULAR = 0.5;
    const float MAT_PHONG_EXPONENT = 1000.0;

    vec3 baseColor = texture2D(u_TextureSampler, o_TextureCoordinates).xyz;

    // Renormalizing direction vectors
    vec3 surfaceNormal = vec3(0, 1, 0);
    vec3 directionToObserver = normalize(o_DirectionToObserver);
    vec3 directionToLight = normalize(o_DirectionToLight);

    // Specular
    vec3 perfectReflection = normalize(2.0 * dot(directionToLight, surfaceNormal) * surfaceNormal - directionToLight);
    vec3 specular = MAT_SPECULAR * u_LightEmission * pow(max(dot(perfectReflection, directionToObserver), 0.0), MAT_PHONG_EXPONENT);

    // Diffuse
    vec3 diffuse =  MAT_DIFFUSE * u_LightEmission * max(dot(surfaceNormal, directionToLight), 0.0);

    // Ambience
    vec3 ambience = MAT_AMBIENT * u_AmbientEmission;

    // Final Color
    vec3 color = (specular + diffuse + ambience) * baseColor;    


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Shadow
    vec4 positionInLightSpace = u_LightViewProjection * vec4(o_Position, 1.0);

    vec4 shadowCoordinates = 0.5 * positionInLightSpace / positionInLightSpace.w + 0.5;

    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoordinates.xy);
    float shadowDepth = unpackDepth(rgbaDepth);

    float visibility = 1.0;
    if(shadowCoordinates.z > shadowDepth + 0.005)
        visibility = 0.5;  

    // Final color
    gl_FragColor = vec4(color * visibility, 1.0);
}