precision mediump float;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

attribute vec2 a_Position;
attribute vec2 a_TextureCoordinates;

varying vec2 o_TextureCoordinates;


void main(){    
    o_TextureCoordinates = a_TextureCoordinates;
     gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 0.0, 1.0);
}