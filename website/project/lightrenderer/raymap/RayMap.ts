namespace Project {

    /**
     * Casts a number of rays from a given light, and calculate their distance
     * by using the occlusion map.
     * The result is stored in this maps output texture, which is a texture
     * of size numRays*1 (height of 1).
     */
    export class RayMap {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        private shader: Util.ShaderProgram;
        private framebuffer: Framebuffer;
        private texture: Util.Texture;

        private numRays: number;
        private numSamples: number;

        constructor(gl: WebGLRenderingContext, numRays: number, numSamples: number) {
            this.gl = gl;
            this.numRays = numRays;
            this.numSamples = numSamples; // Determines ray step size

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
            this.shader = new Util.ShaderProgram(gl, "lightrenderer/raymap/vertex.glsl", "lightrenderer/raymap/fragment.glsl");  

            // Frame buffer
            this.createTexture();
        }

        
        setNumRays(rays: number) {
            this.numRays = rays;
            // Recreate texture
            this.createTexture();
        }


        setNumSamples(samples: number){
            this.numSamples = samples;
        }
        

        /**
         * "Draw" the distance for each ray to the nearest occluder for the given light.
         * Occlusion map must already be bound to the given slot.
         * 
         * @param light Light to check distances for
         * @param occlusionMapSlot Which slot the occlusion map is bound to
         * @param occlusionMapMatrix Matrix to transform world coordinate to occlusion map texture space
         */
        draw(light: Light, occlusionMapSlot: number, occlusionMapMatrix: number[] ) {
            
            this.gl.disable(gl.BLEND);

            // Calculate light center and radius in occlusion map texture space
            // @ts-ignore
            let lightCenter = vec2(mult(occlusionMapMatrix, vec3(light.getPosition(), 1)));
            // @ts-ignore
            let outerPoint = vec2(mult(occlusionMapMatrix, vec3(add(light.getPosition(), vec2(light.getRadius(),0)), 1)));
            // @ts-ignore
            let lightRadius = length(subtract(lightCenter, outerPoint));
            // Note: Above relies on the occlusion map being square (same width and height)

            this.shader.bind();
            this.shader.setInteger("u_NumRays", this.numRays);
            this.shader.setInteger("u_SamplesPerRay", this.numSamples);
            this.shader.setInteger("u_OcclusionMap", occlusionMapSlot);
            this.shader.setFloatVector2("u_LightPosition", lightCenter);
            this.shader.setFloat("u_LightRadius", lightRadius);

            this.vertexBuffer.bind();

            this.framebuffer.drawTo(() => {
                this.gl.clearColor(1, 1, 1, 1);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);                
                // Can probably just draw a line instead, but better safe than sorry
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
            });
        }

        
        /**
         * Binds the output texture of this ray map to the texture slot
         */
        bindTexture(textureSlot: number) {
            this.texture.bind(textureSlot); 
        }


        private createTexture() {
            Util.Texture.createFromData(gl, null, this.numRays, 1)
                .setChannels(3) // TODO: This could be changed to a smaller texture
                .setFilter(gl.NEAREST, gl.NEAREST)

                // Note: We can't use REPEAT if we use texture 
                // which is not a power of 2
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
                .build((texture) => {
                    this.texture = texture;
                });

            // Haven't checked if recreating the framebuffer so often
            // is a problem
            this.framebuffer = new Framebuffer(gl, this.texture);
        }
    
    }

}