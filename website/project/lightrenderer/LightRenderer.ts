

namespace Project {

    export class LightRenderer {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        private lightShader: Util.ShaderProgram;

        // Transforms world positions to the occlusion map's texture coordinates
        private occlusionCamera: Camera2D;
        private occlusionMap: OcclusionMap;

        private rayMap: RayMap;

        private shadowMap: ShadowMap;

        // Map which each light's final color is rendered to.
        // When all lights are rendered, this is drawn on top of current scene
        private lightMap: LightMap;


        // For drawing various framebuffers
        private imageRenderer: Util.ImageRenderer;

        constructor(gl: WebGLRenderingContext, screenSize: number[]) {
            this.gl = gl;

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

            // Shadow map (holds information about the shadows of a light)
            this.shadowMap = new ShadowMap(gl, 1080);

            // Light shader (renders lights to lightmap)
            this.lightShader = new Util.ShaderProgram(gl, "/project/lightrenderer/lightshader/vertex.glsl", "/project/lightrenderer/lightshader/fragment.glsl");
            this.lightMap = new LightMap(gl, screenSize);

            this.imageRenderer = new Util.ImageRenderer(gl);
        }
      

        /**
         * Root function of the light rendering pipeline.
         * Renders the given lights, which may cast shadow due to given occluders,
         * to the screen.
         */
        draw(camera: Camera2D, occluders: Sprite[], lights: Light[]) {

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

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            // Draw lights
            lights.forEach(light => {

                // Calculate ray distances
                this.occlusionMap.bindTexture(0);
                this.rayMap.draw(light, 0, occlusionMatrix);
                this.rayMap.bindTexture(1);
                
                // Draw the shadow map
                this.shadowMap.draw(1, light.getBlurFactor());

                // Render the light to the light map
                this.occlusionMap.bindTexture(0); // Shadow map unbinds the occlusion map 
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
                this.gl.blendFunc(gl.ONE, gl.ONE);

                this.lightMap.drawTo(() => {
                    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
                });  
                
                // Primitive way of unbinding occlusion map from slot 0
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            });

            // Draw the light map on top of the currently drawn screen
            this.lightMap.draw();
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


        // Draw the occlusion map to the screen
        drawOcclusionMap(screenSize: number[]) {
            this.occlusionMap.bindTexture(0);
            this.imageRenderer.draw(0, screenSize[0], screenSize[1], screenSize[1]*0.9, screenSize[1]*0.9 );
        }

        
        // Draws the ray map for the light rendered last
        drawRayMap(screenSize: number[]){
            this.rayMap.bindTexture(0);
            this.imageRenderer.draw(0, screenSize[0], screenSize[1], screenSize[1]*0.9, screenSize[1]*0.02 );
        }

        // Draws the shadow map for the light rendered last
        drawShadowMap(screenSize: number[]) {
            this.shadowMap.bindTexture(0);
            this.imageRenderer.draw(0, screenSize[0], screenSize[1], screenSize[1]*0.9, screenSize[1]*0.9 );
        }
    }

}