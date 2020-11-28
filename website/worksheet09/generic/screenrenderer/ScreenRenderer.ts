
namespace Sheet9 {

    /**
     * Simple renderer to render a texture to the screen middle of the screen
     */
    export class ScreenRenderer {

        private gl: WebGLRenderingContext;
        private vertices: Util.VertexBuffer;
        private shader: Util.ShaderProgram;


        constructor(gl: WebGLRenderingContext, ) {
            this.gl = gl;

            this.vertices = new Util.VertexBuffer(gl);
            this.vertices.addAttribute("a_Position", 2);
            this.vertices.addAttribute("a_TextureCoordinates", 2);

            this.vertices.push(
                -1, -1,  0, 0,
                -1,  1,  0, 1,
                 1, -1,  1, 0,

                -1,  1,  0, 1,
                 1,  1,  1, 1,
                 1, -1,  1, 0
            );

            this.shader = new Util.ShaderProgram(gl, "../generic/screenrenderer/vertex.glsl", "../generic/screenrenderer/fragment.glsl");            
        }


        draw(screenWidth: number, screenHeight: number, textureWidth: number, textureHeight: number) {

            this.shader.bind();
            this.shader.setInteger("u_TextureSampler", 0);
            this.shader.setFloat("u_WidthScaling", textureWidth / screenWidth);
            this.shader.setFloat("u_HeightScaling", textureHeight / screenHeight);

            this.vertices.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.getNumVertices());
        }
    }
    
}