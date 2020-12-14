
namespace Util {
    
    /**
     *  Simple renderer to render flat 2D images onto the screen
     */
    export class ImageRenderer {

        private gl: WebGLRenderingContext;
        private vertices: VertexBuffer;
        private shader: ShaderProgram;

        constructor(gl: WebGLRenderingContext, utilityPath: string) {
            this.gl = gl;

            this.vertices = new VertexBuffer(gl);
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

            this.shader = new Util.ShaderProgram(gl, utilityPath + "utility/imagerenderer/vertex.glsl", utilityPath + "utility/imagerenderer/fragment.glsl");            
        }


        draw(textureSlot: number, screenWidth: number, screenHeight: number, textureWidth: number, textureHeight: number) {
            this.shader.bind();
            this.shader.setInteger("u_TextureSampler", textureSlot);
            this.shader.setFloat("u_WidthScaling", textureWidth / screenWidth);
            this.shader.setFloat("u_HeightScaling", textureHeight / screenHeight);

            this.vertices.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.getNumVertices());
        }
    }
    
}