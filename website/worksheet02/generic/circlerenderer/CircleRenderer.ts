
namespace Sheet2 {
    

    export class CircleRenderer {
        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private camera: Camera2D;

        private numTriangles = 100;
        private rotationPerTriangle =  (Math.PI*2)/this.numTriangles;
        

        constructor(gl: WebGLRenderingContext, camera){
            this.gl = gl;
            this.camera = camera;

            this.vertexBuffer = new Util.VertexBuffer(gl, 1000);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_ZIndex", 1);
            this.vertexBuffer.addAttribute("a_Color", 4);
    
            this.shader = new Util.ShaderProgram(gl, "../generic/circlerenderer/vertex.shader", "../generic/generic_fragment.shader");
        }
    
    
        /**
         * 
         * @param {*} depthIndex The depth (z) index to draw on
         * @param {*} center Center position of the circle
         * @param {*} radius The radius of the circle
         * @param {*} colors Array where [0] is the center color and [1] is the border color. The final color will be interpolated from the center color to the border.
         */
        drawCircle(depthIndex: number, center: number[], radius: number, colors: Util.Color[]){
            // Fan points
            var points = [];
            for( var i=0; i < this.numTriangles; i++ ){
                points.push([
                    center[0] + radius * Math.cos(this.rotationPerTriangle*i),
                    center[1] + radius * Math.sin(this.rotationPerTriangle*i)
                ]);
            }       
                
            // Per triangle: 3 vertices consisting of position (2 floats) and color (3 floats)
            for( var i=0; i<this.numTriangles; i++ ){
                var point1 = points[i];
                var point2 = points[(i+1)%points.length];
    
                this.vertexBuffer.push(
                    point1, // x, y
                    depthIndex,
                    colors[1].asList()
                );
    
                this.vertexBuffer.push(
                    point2, // x, y
                    depthIndex,
                    colors[1].asList()
                );
    
                // Center
                this.vertexBuffer.push(
                    center,
                    depthIndex,
                    colors[0].asList()
                );
            }
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
