
namespace Sheet2 {

    
    export class TriangleRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private camera: Camera2D;

        constructor(gl: WebGLRenderingContext, camera: Camera2D){
            this.gl = gl;
            this.camera = camera;

            this.vertexBuffer = new Util.VertexBuffer(gl, 256);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_ZIndex", 1);
            this.vertexBuffer.addAttribute("a_Color", 4);

            this.shader = new Util.ShaderProgram(gl, "../generic/trianglerenderer/vertex.shader", "../generic/generic_fragment.shader");        
        }


        drawTriangle(depthIndex: number, points: Triangle.Point[]){
            points.forEach(point => {
                this.vertexBuffer.push(
                    point.getPos(),
                    depthIndex,
                    point.getColor().asList()
                )
            });
        }


        flush() {
            if( this.vertexBuffer.getNumVertices() == 0 ) return;
            
            this.shader.bind();
            this.shader.setFloatMatrix4("u_Transform", this.camera.getTransform());

            this.vertexBuffer.bind();

            this.gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());

            this.vertexBuffer.clear();
        }
    }
    
}
