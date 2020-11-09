

namespace Sheet8.Part1 {

    export class QuadRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;

        constructor(gl: WebGLRenderingContext){
            if( gl == null )
                throw "GL context cannot be null";
    
            this.gl = gl;
    
            this.vertexBuffer = new Util.VertexBuffer(gl, 1000);
            this.vertexBuffer.addAttribute("a_Position", 3);
            this.vertexBuffer.addAttribute("a_TextureCoordinates", 2);
            this.vertexBuffer.addAttribute("a_TextureIndex", 1);            

            this.shader = new Util.ShaderProgram(gl, "vertex.glsl", "fragment.glsl");
        }


        addQuad(quad: Quad){
            this.vertexBuffer.push(quad.getVertices());
        }    
    
        draw(camera: Util.Camera){
            this.shader.bind();
            
            // Set texture samplers
            this.shader.setInteger("u_TextureSampler0", 0);
            this.shader.setInteger("u_TextureSampler1", 1);

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }
}
