
namespace Project {


    /**
     * Basic renderer to draw textured quads (Sprites in this project)
     * to the screen.
     * 
     * The renderer uses multi-texturing to batch together multiple sprites
     * in one draw call.
     */
    export class SpriteRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private indexBuffer: Util.IndexBuffer;
        private textureSlots: number = 16; // Just go with 16

        constructor(gl: WebGLRenderingContext) {
            this.gl = gl;
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_Color", 3);
            this.vertexBuffer.addAttribute("a_TextureSlot", 1);
            this.vertexBuffer.addAttribute("a_TextureCoordinates", 2);
            this.indexBuffer = new Util.IndexBuffer(gl);
            this.shader = new Util.ShaderProgram(gl, "spriterenderer/vertex.glsl", "spriterenderer/fragment.glsl");                  
        }
        

        /**
         * Draws the given sprites to the screen
         */
        drawQuads( camera: Camera2D, ...sprites: Sprite[] ) {
            
            // Function to flush the drawing buffers,
            // effectively drawing everything
            let flush = () => {
                this.vertexBuffer.bind();
                this.indexBuffer.bind();

                this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.length(), this.gl.UNSIGNED_SHORT, 0);

                this.vertexBuffer.clear();
                this.indexBuffer.clear();
            }

            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.shader.bind();
            this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
            let slots = [];
            for( let i=0; i<this.textureSlots; i++ ) slots.push(i);
            this.shader.setIntegerArray("u_Textures", slots);

            // Cleanup buffers
            let textures = new Map<Util.Texture, number>();

            // Draw each Sprite
            let numQuads = 0; // Number of sprites added to buffer
            for( let i=0; i<sprites.length; i++ ){
                let sprite = sprites[i];

                // Check if is already bound, otherwise add it if space
                // If all slots are in use, we flush the buffer
                // Note: first texture slot is reserved to signal that
                // the sprite has no texture
                let texture = sprite.getTexture();
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
                let spriteColor = sprite.getColor().asList(false);
                let spritePoints = sprite.getPoints();
                this.vertexBuffer.push(
                    // Note: texture coordinates flip the sprite
                    spritePoints[0], spriteColor, textureSlot, 0, 1,
                    spritePoints[1], spriteColor, textureSlot, 1, 1,
                    spritePoints[2], spriteColor, textureSlot, 1, 0,
                    spritePoints[3], spriteColor, textureSlot, 0, 0,
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

    }



}