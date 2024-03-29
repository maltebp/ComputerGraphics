

namespace Sheet6.Part2 {

    export class Renderer {
        private gl;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;

        constructor(gl){
            if( gl == null )
                throw "GL context cannot be null";
    
            this.gl = gl;
            
            this.shader = new Util.ShaderProgram(gl, "vertex.glsl", "fragment.glsl");

            this.vertexBuffer = new Util.VertexBuffer(gl, 100);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_TextureCoordinates", 2);
            this.vertexBuffer.push([
                // Pos         // Texture Coordinate
                -0.5, -0.5,     -2,  -10,        
                 0.5, -0.5,      2,  -10,
                -0.5,  0.5,     -2,   10,
                -0.5,  0.5,     -2,   10,
                 0.5, -0.5,      2,  -10,
                 0.5,  0.5,      2,   10
            ]); 
        }


    
        drawQuad(camera: Util.OrbitalCamera, position: number[], width: number, height: number, rotation: number[]){

            // Not optimal for performance to create modelmatrix each draw
            let modelMatrix = Util.createModelMatrix(
                position,
                [width, height, 1.0],
                rotation
            );

            this.shader.bind();

            this.shader.setInteger("u_TextureSampler", 0);
            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_Model", modelMatrix);

            this.vertexBuffer.bind();

            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }
}
