

namespace Project {

    export class GaussianRenderer {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        private shader: Util.ShaderProgram;

        private lightSize: number;
        
        constructor(gl: WebGLRenderingContext, lightSize: number) {
            this.gl = gl;
            this.lightSize = lightSize;

            // Setup vertex buffer            
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer .push(
                -1.0, -1.0,
                -1.0,  1.0,
                 1.0, -1.0,

                -1.0,  1.0,
                 1.0,  1.0,
                 1.0, -1.0
            );

            // Shader
            this.shader = new Util.ShaderProgram(gl, "/project/lightrenderer/vertex.glsl", "/project/lightrenderer/fragment.glsl");  
        }


        draw(camera: Camera2D, position: number[], radius: number) {

            this.shader.bind();
            this.shader.setFloat("u_Radius", radius);
            this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
            this.shader.setInteger("u_RayMap", 0);

            this.vertexBuffer.bind();

            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
        }

        
    }

}