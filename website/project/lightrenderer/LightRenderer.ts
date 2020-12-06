

namespace Project {

    export class LightRenderer {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        private shader: Util.ShaderProgram;
        
        private framebuffer1: Framebuffer;
        private framebuffer2: Framebuffer;

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
            
            // Create framebuffers 
            this.framebuffer1 = new Framebuffer(gl, this.createTexture());
            this.framebuffer2 = new Framebuffer(gl, this.createTexture());
        }


        draw(camera: Camera2D, position: number[], radius: number) {

            this.framebuffer1.drawTo(() => {
                this.gl.clearColor(0,0,0,0);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);

                this.shader.bind();
                // this.shader.setFloat("u_Radius", radius);
                // this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
                this.shader.setInteger("u_RayMap", 0);
    
                this.vertexBuffer.bind();
    
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
            });
        }

        bindTexture(textureSlot: number) {
            this.framebuffer1.getTexture().bind(textureSlot);
        }


        private createTexture() {
            var texture = null;
            Util.Texture.createFromData(gl, null, this.lightSize, this.lightSize)
                .setChannels(4)
                .setFilter(gl.NEAREST, gl.NEAREST)

                // Note: We can't use REPEAT if we use texture 
                // which is not a power of 2
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
                .build((createdTexture) => {
                    texture = createdTexture;
            });
            return texture;
        }

        

        // private createFramebuffer() {

        //     // Constructs framebuffer
        //     let framebuffer = gl.createFramebuffer();
        //     gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                
        //     let _this = this;
        //     Util.Texture.createFromData(gl, null, width, height)
        //         .setChannels(3) // TODO: This could be changed to a smaller texture
        //         .setFilter(gl.NEAREST, gl.NEAREST)

        //         // Note: We can't use REPEAT if we use texture 
        //         // which is not a power of 2
        //         .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE) // TODO: Probably should be clamp to border
        //         .build((texture) => {
        //             _this.texture = texture;
        //         });

        //     // I know the texture build is synchronous, so I know I can build use it here already
        //     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.getGLTexture(), 0);
      
        //     var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        //     if (status !== gl.FRAMEBUFFER_COMPLETE) {
        //         throw "Framebuffer creation failed: " + status.toString();
        //     }

        //     // Rebind default buffer
        //     gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        //     return returnObject;

        // }
    }

}