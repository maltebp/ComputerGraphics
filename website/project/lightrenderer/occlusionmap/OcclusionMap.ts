
namespace Project {


    /**
     * Renders Sprites (occluders) to a texture, which signals whether or not light
     * can pass through a given pixel (red). The map also holds values for each sprite's
     * diffuse factors.
     */
    export class OcclusionMap {

        private gl: WebGLRenderingContext;

        private vertexBuffer: Util.VertexBuffer;
        private indexBuffer: Util.IndexBuffer;
        private shader: Util.ShaderProgram;
        private framebuffer: Framebuffer;
        private texture: Util.Texture;

        private textureSlots: number = 16; // Just go with 16

        private size: number;


        constructor(gl: WebGLRenderingContext, size: number) {
            this.gl = gl;
            this.size = size;

            // Setup vertex buffer            
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_Color", 3);
            this.vertexBuffer.addAttribute("a_Diffuse", 1);
            this.vertexBuffer.addAttribute("a_TextureSlot", 1);
            this.vertexBuffer.addAttribute("a_TextureCoordinates", 2);
            this.indexBuffer = new Util.IndexBuffer(gl);
            this.shader = new Util.ShaderProgram(gl, "lightrenderer/occlusionmap/vertex.glsl", "lightrenderer/occlusionmap/fragment.glsl");    

            Util.Texture.createFromData(gl, null, size, size)
                .setChannels(3) // This could be changed to a smaller texture
                .setFilter(gl.NEAREST, gl.NEAREST)
                // Note: We can't use REPEAT if we use texture 
                // which is not a power of 2
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
                .build((texture) => {
                    this.texture = texture;
                });

            this.framebuffer = new Framebuffer(gl, this.texture);
        }
        

        /**
         * Draws the given occluders to this Occlusion Map.
         */
        drawOccluders( camera: Camera2D, ...occluders: Sprite[] ) {
            
            // Utility function to flush the drawing buffers,
            // effectively drawing everything
            let flush = () => {
                this.vertexBuffer.bind();
                this.indexBuffer.bind();

                this.framebuffer.drawTo(() => {
                    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                    this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.length(), this.gl.UNSIGNED_SHORT, 0);                
                });

                this.vertexBuffer.clear();
                this.indexBuffer.clear();
            }

            this.gl.enable(gl.BLEND);

            // Clear the target texture
            this.framebuffer.drawTo(() => {
                this.gl.clearColor(0, 0, 0, 1);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            });

            // Setup shader
            this.shader.bind();
            this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
            let slots = [];
            for( let i=0; i<this.textureSlots; i++ ) slots.push(i);
            this.shader.setIntegerArray("u_Textures", slots);

            // Cleanup buffers
            let textures = new Map<Util.Texture, number>();

            // Push quads' data
            let numQuads = 0; // Number of quads added to buffer
            for( let i=0; i<occluders.length; i++ ){
                let occluder = occluders[i];
                if( !occluder.isOccluder() ) continue;

                // Check if is already bound, otherwise add it if space
                // If all slots are in use, we flush the buffer
                // Note: first texture slot is reserved to signal that
                // the quad has no texture
                let texture = occluder.getTexture();
                let textureSlot = 0;
                if( texture !== null ) {
                    if( textures.has(texture) ){
                        textureSlot = textures.get(texture);
                    }else {
                        if( textures.size == (this.textureSlots-1) ){
                            // Texture slots are filled -> we flush!
                            this.shader.setInteger
                            flush();
                            textures.clear();
                            numQuads = 0;
                        }
                        textureSlot = textures.size+1;
                        textures.set(texture, textureSlot);
                        texture.bind(textureSlot-1);
                    }
                }

                // Vertices
                let spriteColor = occluder.getColor().asList(false);
                let spritePoints = occluder.getPoints();
                let spriteDiffuseFactor = occluder.getDiffuseFactor();
                this.vertexBuffer.push(
                    // Note: texture coordinates flip the sprite
                    spritePoints[0], spriteColor, spriteDiffuseFactor, textureSlot, 0, 1,
                    spritePoints[1], spriteColor, spriteDiffuseFactor, textureSlot, 1, 1,
                    spritePoints[2], spriteColor, spriteDiffuseFactor, textureSlot, 1, 0,
                    spritePoints[3], spriteColor, spriteDiffuseFactor, textureSlot, 0, 0,
                );

                // Indices
                let offset = numQuads * 4;
                this.indexBuffer.push(
                    offset + 0, offset + 1, offset + 2,
                    offset + 0, offset + 2, offset + 3
                );
                numQuads++;
            }

            flush();

        }

        
        bindTexture(textureSlot: number) {
            this.texture.bind(textureSlot); 
        }


        getSize() {
            return this.size;
        }


    }

}