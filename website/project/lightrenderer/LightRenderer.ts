

namespace Project {

    export class LightRenderer {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        // private shader: Util.ShaderProgram;
        private gaussianShader: Util.ShaderProgram;
        private lightShader: Util.ShaderProgram;

        private occlusionMap: OcclusionMap;
        private occlusionCamera: Camera2D;

        private lightMap: LightMap;

        private rayMap: RayMap;

        private shadowMap: ShadowMap;

        
        private currentFramebuffer: Framebuffer;

        // For debugging the framebuffers
        private imageRenderer: Util.ImageRenderer;


        constructor(gl: WebGLRenderingContext) {
            this.gl = gl;
            // this.lightSize = lightSize;

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

            // Occlusion map
            this.occlusionMap = new OcclusionMap(gl, 2160);
            this.occlusionCamera = new Camera2D([this.occlusionMap.getSize(), this.occlusionMap.getSize()], [0,0]);

            // Ray map (calculates distances to occluders)
            this.rayMap = new RayMap(gl, 250, 250);

            // Light shader
            this.lightShader = new Util.ShaderProgram(gl, "/project/lightrenderer/lightshader/vertex.glsl", "/project/lightrenderer/lightshader/fragment.glsl");


            this.lightMap = new LightMap(gl, [1280, 720]);

            this.shadowMap = new ShadowMap(gl, 1080);

            this.imageRenderer = new Util.ImageRenderer(gl);
        }


        setNumRays(rays: number) {
            this.rayMap.setNumRays(rays);
        }

        setNumRaySamples(samples: number) {
            this.rayMap.setNumSamples(samples);
        }

        setShadowMapSize(size: number){
            this.shadowMap = new ShadowMap(gl, size);
        }


        setAmbient(color: Util.Color) {
            this.lightMap.setAmbient(color);
        }
        

        draw(camera: Camera2D, occluders: Quad[], lights: Light[]) {

            // Clear maps
            this.lightMap.clear();
        
            // - - - - - - - - - - - - - - - - - - - - - - - - - - -
            // Draw occluders

            // Update occlusion camera
            this.occlusionCamera.setZoom(camera.getZoom());
            this.occlusionCamera.setPosition(camera.getPosition());
            this.occlusionMap.drawOccluders(this.occlusionCamera, ...occluders);

            // Matrix to move from world space to occlusion map's texture space
            // @ts-ignore 
            let occlusionMatrix = mult(
                // NDC to texture matrix
                // @ts-ignore
                mat3(
                    0.5,   0, 0.5,
                      0, 0.5, 0.5,
                      0,   0,   1
                ),
                this.occlusionCamera.getMatrix()               
            );

            lights.forEach(light => {
                this.occlusionMap.bindTexture(0);

                this.rayMap.draw(light, 0, occlusionMatrix);
                this.rayMap.bindTexture(1);
                
                this.shadowMap.draw(1);

                // Shadow map unbinds the occlusion map
                this.occlusionMap.bindTexture(0);
                this.shadowMap.bindTexture(1);

                this.lightShader.bind();
                this.lightShader.setInteger("u_DiffuseMap", 0); // Diffuse map = occlusion map
                this.lightShader.setInteger("u_ShadowMap", 1);
                this.lightShader.setFloatVector3("u_Color", light.getColor().asList(false) );
                this.lightShader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
                this.lightShader.setFloatVector2("u_LightPosition", light.getPosition());
                this.lightShader.setFloat("u_LightRadius", light.getRadius());
                this.lightShader.setFloatMatrix3("u_DiffuseMapMatrix", occlusionMatrix);

                this.vertexBuffer.bind();

                this.gl.enable(gl.BLEND);
                this.gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

                this.lightMap.drawTo(() => {
                    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
                });  
                
                // Primitive way of unbinding occlusion map from slot 0
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            });

            this.lightMap.draw();
        }


        // private drawLight(camera: Camera2D, light: Light, occlusionMatrix: number[]) {
        //     this.gl.clearColor(0,0,0,0);


        //     this.framebuffer2.drawTo(() => {
        //         this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        //     })
        //     this.currentFramebuffer.drawTo(() => {
        //         this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //         this.shader.bind();
        //         this.shader.setFloat("u_Radius", radius);
        //         // this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
        //         this.shader.setInteger("u_RayMap", 0);
    
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


        // Flushes the light map, causing it render the lights on top
        // of the currently drawn screen
        flush() {
            // TODO: Render lights here
        }


        bindTexture(textureSlot: number) {
            this.currentFramebuffer.getTexture().bind(textureSlot);
        }


        // Just a debugging function
        drawOcclusionMap(screenSize: number[]) {
            this.occlusionMap.bindTexture(0);
            this.imageRenderer.draw(0, screenSize[0], screenSize[1], screenSize[1]*0.9, screenSize[1]*0.9 );
        }

        
        // Just for debugging
        // Draws the last ray map calculated
        drawRayMap(screenSize: number[]){
            this.rayMap.bindTexture(0);
            this.imageRenderer.draw(0, screenSize[0], screenSize[1], screenSize[1]*0.9, screenSize[1]*0.02 );
        }


        // Just for debugging
        // Draws the last shadow map calculated
        drawShadowMap(screenSize: number[]) {
            this.shadowMap.bindTexture(0);
            this.imageRenderer.draw(0, screenSize[0], screenSize[1], screenSize[1]*0.9, screenSize[1]*0.9 );
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

      
        // // Have to create two identical textures, so why not put
        // // it in a function?
        // private createTexture() {
        //     var texture = null;
        //     Util.Texture.createFromData(gl, null, 1337, 1337) // TODO: Fix this
        //         .setChannels(4)
        //         .setFilter(gl.NEAREST, gl.NEAREST)

        //         // Note: We can't use REPEAT if we use texture 
        //         // which is not a power of 2
        //         .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
        //         .build((createdTexture) => {
        //             texture = createdTexture;
        //     });
        //     return texture;
        // }

        

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