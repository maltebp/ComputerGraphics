
namespace Sheet2 {


    export class PointRenderer {
        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private camera: Camera2D;

        constructor(gl: WebGLRenderingContext, camera){    
            this.gl = gl;
            this.camera = camera;
    
            this.vertexBuffer = new Util.VertexBuffer(gl, 256);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_ZIndex", 1);
            this.vertexBuffer.addAttribute("a_Size", 1);
            this.vertexBuffer.addAttribute("a_Color", 4);
    
            this.shader = new Util.ShaderProgram(gl, "../generic/pointrenderer/vertex.shader", "../generic/generic_fragment.shader");
        }
    
    
    
        drawPoint(pos: number[], depthIndex: number, size: number, color: Util.Color){
            this.vertexBuffer.push(
                pos,  // x, y
                depthIndex,    // Single value
                size, // single value
                color.asList() // rgba
            );
        }
    
    
        flush() {
            if( this.vertexBuffer.getNumVertices() == 0 ) return;

            this.shader.bind();
            this.shader.setFloatMatrix4("u_Transform", this.camera.getTransform());
    
            this.vertexBuffer.bind();
    
            this.gl.drawArrays(gl.POINTS, 0, this.vertexBuffer.getNumVertices());
    
            this.vertexBuffer.clear();
        }
    }

}
