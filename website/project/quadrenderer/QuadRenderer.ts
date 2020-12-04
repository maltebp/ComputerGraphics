
namespace Project {

    export class QuadRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private indexBuffer: Util.IndexBuffer;

        constructor(gl: WebGLRenderingContext) {
            this.gl = gl;
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_Depth", 1);
            this.vertexBuffer.addAttribute("a_Color", 4);
            this.indexBuffer = new Util.IndexBuffer(gl);
            this.shader = new Util.ShaderProgram(gl, "/project/quadrenderer/vertex.glsl", "/project/quadrenderer/fragment.glsl");          
        }
        

        drawQuads( ...quads: Quad[] ) {
            this.vertexBuffer.clear();
            this.indexBuffer.clear();

            this.vertexBuffer.reserve(quads.length * 7 * 6);

            for( let i=0; i<quads.length; i++ ){
                let quad = quads[i];
            
                let x = quad.position[0];
                let y = quad.position[1];
                let halfWidth = quad.width/2.0;
                let halfHeight = quad.height/2.0;

                let points: number[][] = [
                    [ x-halfWidth, y-halfHeight], // Bottom left
                    [ x+halfWidth, y-halfHeight], // Bottom right
                    [ x+halfWidth, y+halfHeight], // Top right
                    [ x-halfWidth, y+halfHeight] // Top left
                ];

                let radianRotation = quad.rotation * Math.PI/180;
                let sin = Math.sin(radianRotation);
                let cos = Math.cos(radianRotation); 
                
                // @ts-ignore
                let rotationMatrix = mat2(
                    [cos, -sin],
                    [sin, cos]

                );

                // @ts-ignore
                points.map( (point) => mult(rotationMatrix, point) );

                let vertexBuffer = this.vertexBuffer;
                points.forEach(point => {
                    vertexBuffer.push(point, 0, quad.color.asList(true));
                });
                let offset = i * 4;
                this.indexBuffer.push(
                    offset + 0, offset + 1, offset + 2,
                    offset + 0, offset + 2, offset + 3
                );
            }

            this.shader.bind();
            this.vertexBuffer.bind();
            this.indexBuffer.bind();

            this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.length(), this.gl.UNSIGNED_SHORT, 0);
        }


    }



}