
namespace Project {

    export class OcclusionMap {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        private indexBuffer: Util.IndexBuffer;
        private shader: Util.ShaderProgram;
        private framebuffer: Framebuffer;
        private texture: Util.Texture;

        private size: number;


        constructor(gl: WebGLRenderingContext, size: number) {
            this.gl = gl;
            this.size = size;

            // Setup vertex buffer            
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.indexBuffer = new Util.IndexBuffer(gl);
            this.shader = new Util.ShaderProgram(gl, "/project/lightrenderer/occlusionmap/vertex.glsl", "/project/lightrenderer/occlusionmap/fragment.glsl");    

            let _this = this;
            Util.Texture.createFromData(gl, null, size, size)
                .setChannels(3) // TODO: This could be changed to a smaller texture
                .setFilter(gl.LINEAR, gl.LINEAR)

                // Note: We can't use REPEAT if we use texture 
                // which is not a power of 2
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE) // TODO: Probably should be clamp to border
                .build((texture) => {
                    _this.texture = texture;
                });

            this.framebuffer = new Framebuffer(gl, this.texture);
        }

        

        drawOccluders( camera: Camera2D, ...occluders: Quad[] ) {            
            
            this.vertexBuffer.clear();
            this.indexBuffer.clear();

            this.vertexBuffer.reserve(occluders.length * 7 * 6);

            for( let i=0; i<occluders.length; i++ ){
                let quad = occluders[i];
            
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
                    vertexBuffer.push(point);
                });
                let offset = i * 4;
                this.indexBuffer.push(
                    offset + 0, offset + 1, offset + 2,
                    offset + 0, offset + 2, offset + 3
                );
            }


            this.gl.disable(gl.BLEND);
            this.gl.clearColor(1, 1, 1, 1);

            this.shader.bind();
            this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());

            this.vertexBuffer.bind();
            this.indexBuffer.bind();
            
            this.framebuffer.drawTo(() => {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.length(), this.gl.UNSIGNED_SHORT, 0);                
            });
        }


        
        bindTexture(textureSlot: number) {
            this.texture.bind(textureSlot); 
        }


        getSize() {
            return this.size;
        }

    }

}