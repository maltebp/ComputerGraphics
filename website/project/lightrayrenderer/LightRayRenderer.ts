/*
    Set viewport to (0,0,numRays,1)

    Draw quad to entire screen

    We should only be getting fragments with frag coords in the 1-numRays interval

*/


namespace Project {

    export class LightRayRenderer {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        private shader: Util.ShaderProgram;
        private framebuffer: WebGLFramebuffer;
        private texture: Util.Texture;

        private numRays: number;

        constructor(gl: WebGLRenderingContext, numRays: number) {
            this.gl = gl;
            this.numRays = numRays;

            // Setup vertex buffer            
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer .push(
                -1, -1,
                -1,  1,
                 1, -1,

                -1,  1,
                 1,  1,
                 1, -1
            );

            // Shader
            this.shader = new Util.ShaderProgram(gl, "/project/lightrayrenderer/vertex.glsl", "/project/lightrayrenderer/fragment.glsl");    

            // Constructs framebuffer
            this.framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
                
            let _this = this;
            Util.Texture.createFromData(gl, null, numRays, 1)
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

        

        draw() {

            // Adjust viewport
            let originalViewport = this.gl.getParameter(this.gl.VIEWPORT);
            this.gl.viewport(0, 0, this.numRays, 1);

            // Bind framebuffer
            this.texture.bind(0);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
            this.gl.clearColor(1, 1, 1, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            this.shader.bind();

            this.vertexBuffer.bind();

            // TODO: Can we draw line instead?
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );

            // Unbind the framebuffer
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

            // Rebind original viewport 
            this.gl.viewport(originalViewport[0], originalViewport[1], originalViewport[2], originalViewport[3]);

        }

        
        bindTexture(textureSlot: number) {
            this.texture.bind(textureSlot); 
        }
    
    }

}