
precision mediump float;

uniform sampler2D   u_ShadowMap;
uniform sampler2D   u_DiffuseMap;
uniform vec3        u_Color;

varying vec2    o_TextureCoordinates;
varying vec2    o_DiffuseMapCoordinates;

void main() {
    float dist = length(o_TextureCoordinates*2.0 - 1.0);

    float lightAlpha = 1.0 - smoothstep(0.0, 1.0, dist);
    float shadowAlpha = texture2D(u_ShadowMap, o_TextureCoordinates).r;
    float diffuseAlpha = texture2D(u_DiffuseMap, o_DiffuseMapCoordinates).g;

    float finalAlpha;
    if( diffuseAlpha > 0.01 )
        finalAlpha = lightAlpha * diffuseAlpha;
    else
        // If there is no diffuse color, we let the shadow map
        // control the alpha
        finalAlpha = lightAlpha * shadowAlpha;

    gl_FragColor = vec4(u_Color*finalAlpha, 1.0);

}