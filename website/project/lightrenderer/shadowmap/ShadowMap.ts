

namespace Project {


    export class ShadowMap {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;

        private shadowShader: Util.ShaderProgram;
        private gaussianShader: Util.ShaderProgram;
        
        private framebuffer1: Framebuffer;
        private framebuffer2: Framebuffer;
    
        private textureSize: number;
    

        constructor(gl: WebGLRenderingContext, textureSize: number) {
            this.gl = gl;
            this.textureSize = textureSize;

            // Vertex buffer: Two triangles filling entire screen           
            // TODO: Create global vertex buffer for this
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
            this.shadowShader = new Util.ShaderProgram(gl, "/project/lightrenderer/shadowmap/vertex.glsl", "/project/lightrenderer/shadowmap/fragment.glsl"); 
            
            // Gaussian blur shader
            this.gaussianShader = new Util.ShaderProgram(gl, "/project/lightrenderer/shadowmap/gaussian/vertex.glsl", "/project/lightrenderer/shadowmap/gaussian/fragment.glsl");

            // Double framebuffers for Gaussian blur 
            this.framebuffer1 = new Framebuffer(gl, this.createTexture());
            this.framebuffer2 = new Framebuffer(gl, this.createTexture());
        }


        /**
         * Renders the light's shadows to a framebuffer, and apply gaussian blur to it
         * 
         * @param rayMapSlot    The slot which the ray map for this light is bound to
         */
        draw(rayMapSlot: number) {

            this.shadowShader.bind();
            this.shadowShader.setInteger("u_RayMap", rayMapSlot);

            this.vertexBuffer.bind();

            this.gl.clearColor(0, 0, 0, 0);
            this.framebuffer1.drawTo(() => {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );    
            });

        }


        // private drawLight(camera: Camera2D, light: Light, occlusionMatrix: number[]) {
        //     this.gl.clearColor(0,0,0,0);


        //     this.framebuffer2.drawTo(() => {
        //         this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        //     })
        //     this.currentFramebuffer.drawTo(() => {
        //         this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //         this.shadowShader.bind();
        //         this.shadowShader.setFloat("u_Radius", radius);
        //         // this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
        //         this.shadowShader.setInteger("u_RayMap", 0);
    
        //         this.vertexBuffer.bind();
    
        //         this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
        //     });

        //     this.gaussianBlur();

        //     // this.gl.enable(gl.BLEND);

        //     this.framebuffer1.getTexture().bind(0);


            
        //     this.lightShader.bind();
        //     this.lightShader.setInteger("u_ShadowTexture", 0);
        //     this.lightShader.setFloatVector3("u_Color", [0,1,0]); 

        //     // this.lightShader.setFloat("u_LightSize", this.lightSize);
        //     // this.lightShader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());

        //     this.vertexBuffer.bind();
        //     this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );

        //     // this.gl.disable(gl.BLEND);

        // }


        bindTexture(textureSlot: number) {
            this.framebuffer1.getTexture().bind(textureSlot);
        }

        // private gaussianBlur() {
            
        //     this.gaussianShader.bind();
        //     this.gaussianShader.setInteger("u_SourceTexture", 0);
        //     // this.gaussianShader.setInteger("u_TextureSize", this.lightSize);
            
        //     // We can reuse the same vertexbuffer
        //     this.vertexBuffer.bind();
            
        //     for(let i=0; i<1; i++){
        //         this.framebuffer1.getTexture().bind(0);
        //         this.gaussianShader.setInteger("u_Horizontal", 0);
        //         this.framebuffer2.drawTo(() => {
        //             this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
        //         });
    
        //         this.framebuffer2.getTexture().bind(0);
        //         this.gaussianShader.setInteger("u_Horizontal", 1);
        //         this.framebuffer1.drawTo(() => {
        //             this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        //         });
        //     }
            
            
        // }

      
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