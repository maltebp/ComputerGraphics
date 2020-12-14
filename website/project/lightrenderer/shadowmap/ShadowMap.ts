namespace Project {

    /**
     * Renders the shadowmap for a light from a given ray map
     */
    export class ShadowMap {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;

        private shadowShader: Util.ShaderProgram;
        private gaussianShader: Util.ShaderProgram;
        
        // Two buffers for two-pass gaussian blur
        private framebuffer1: Framebuffer;
        private framebuffer2: Framebuffer;
    
        private textureSize: number;
    

        constructor(gl: WebGLRenderingContext, textureSize: number) {
            this.gl = gl;
            this.textureSize = textureSize;

            // Vertex buffer: Two triangles filling entire screen           
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

            // Shadow shader
            this.shadowShader = new Util.ShaderProgram(gl, "lightrenderer/shadowmap/vertex.glsl", "lightrenderer/shadowmap/fragment.glsl"); 
            
            // Gaussian blur shader
            this.gaussianShader = new Util.ShaderProgram(gl, "lightrenderer/shadowmap/gaussian/vertex.glsl", "lightrenderer/shadowmap/gaussian/fragment.glsl");

            // Double framebuffers for Gaussian blur 
            this.framebuffer1 = new Framebuffer(gl, this.createTexture());
            this.framebuffer2 = new Framebuffer(gl, this.createTexture());
        }


        /**
         * Renders the light's shadows to a framebuffer by using the 
         * calculated ray distances (from ray map)
         * 
         * @param rayMapSlot    The slot which the ray map for this light is bound to
         */
        draw(rayMapSlot: number, blurFactor: number) {

            this.shadowShader.bind();
            this.shadowShader.setInteger("u_RayMap", rayMapSlot);

            this.vertexBuffer.bind();

            this.gl.clearColor(0, 0, 0, 0);
            this.framebuffer1.drawTo(() => {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );    
            });

            // Perform gaussian blur
            this.gaussianBlur(blurFactor);
        }


        /**
         * Binds the shadowmap's output texture to the given slot
         */
        bindTexture(textureSlot: number) {
            this.framebuffer1.getTexture().bind(textureSlot);
        }


        // Perform the two pass gaussian blur on the current shadow map
        private gaussianBlur(blurFactor: number) {
            if( blurFactor <= 0 ) return;

            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            
            this.gaussianShader.bind();
            this.gaussianShader.setInteger("u_SourceTexture", 0);
            this.gaussianShader.setInteger("u_TextureSize", this.textureSize);
            this.gaussianShader.setFloat("u_BlurFactor", blurFactor);
            
            // We can reuse the same vertexbuffer
            this.vertexBuffer.bind();
            
            let blurCount = 1;
            for(let i=0; i<blurCount; i++){

                // Vertical blur (from framebuffer 1 to framebuffer 2)
                this.framebuffer1.getTexture().bind(0);
                this.gaussianShader.setInteger("u_Horizontal", 0);
                this.framebuffer2.drawTo(() => {
                    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
                });
    
                // Horizontal blur (from framebuffer 2 to framebuffer 1)
                this.framebuffer2.getTexture().bind(0);
                this.gaussianShader.setInteger("u_Horizontal", 1);
                this.framebuffer1.drawTo(() => {
                    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
                });
            }            
        }

      
        // Have to create two identical textures, so why not put
        // it in a function like this?
        private createTexture() {
            var texture = null;
            Util.Texture.createFromData(gl, null, this.textureSize, this.textureSize)
                .setChannels(4) // This can be one channel (just alpha)
                .setFilter(gl.LINEAR, gl.LINEAR)

                // Note: We can't use REPEAT if we use texture 
                // which is not a power of 2
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
                .build((createdTexture) => {
                    texture = createdTexture;
            });
            return texture;
        }
    }

}