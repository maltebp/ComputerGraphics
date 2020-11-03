precision mediump float;


uniform samplerCube u_TextureSampler;
varying vec3 o_TextureCoordinates;

void main(){
    gl_FragColor = textureCube(u_TextureSampler, o_TextureCoordinates);
}