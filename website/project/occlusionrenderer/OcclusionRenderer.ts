
namespace Project {

    export class OcclusionRenderer {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        private indexBuffer: Util.IndexBuffer;
        private shader: Util.ShaderProgram;
        private framebuffer: WebGLFramebuffer;
        private texture: Util.Texture;
        private width: number; 
        private height: number;


        constructor(gl: WebGLRenderingContext, width: number, height: number) {
            this.gl = gl;
            this.width = width;
            this.height = height;

            // Setup vertex buffer            
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.indexBuffer = new Util.IndexBuffer(gl);
            this.shader = new Util.ShaderProgram(gl, "/project/occlusionrenderer/vertex.glsl", "/project/occlusionrenderer/fragment.glsl");    


            // Constructs framebuffer
            this.framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
                
            let _this = this;
            Util.Texture.createFromData(gl, null, width, height)
                .setChannels(3) // TODO: This could be changed to a smaller texture
                .setFilter(gl.NEAREST, gl.NEAREST)

                // Note: We can't use REPEAT if we use texture 
                // which is not a power of 2
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE) // TODO: Probably should be clamp to border
                .build((texture) => {
                    _this.texture = texture;
                });

            // I know the texture build is synchronous, so I know I can build use it here already
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.getGLTexture(), 0);
      
            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                throw "Framebuffer creation failed: " + status.toString();
            }

            // Rebind default buffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        

        drawQuads( origin: number[], ...quads: Quad[] ) {
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
                    vertexBuffer.push(point);
                });
                let offset = i * 4;
                this.indexBuffer.push(
                    offset + 0, offset + 1, offset + 2,
                    offset + 0, offset + 2, offset + 3
                );
            }


            // Adjust viewport
            let originalViewport = this.gl.getParameter(this.gl.VIEWPORT);
            this.gl.viewport(0, 0, this.width, this.height);

            // Bind framebuffer
            this.texture.bind(0);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
            this.gl.clearColor(1, 1, 1, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            let camera = new Camera2D([this.width, this.height], [0, 0]);
            this.shader.bind();
            this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());


            this.vertexBuffer.bind();
            this.indexBuffer.bind();

            this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.length(), this.gl.UNSIGNED_SHORT, 0);

            // Unbind the framebuffer
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

            // Rebind original viewport 
            this.gl.viewport(0, 0, originalViewport[2], originalViewport[3]);

        }

        
        bindTexture(textureSlot: number) {
            this.texture.bind(textureSlot); 
        }


        getWidth() : number {
            return this.width;
        }

        getHeight() : number {
            return this.height;
        }
    
    }

}