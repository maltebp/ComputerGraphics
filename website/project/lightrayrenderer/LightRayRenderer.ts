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
        private framebuffer: Framebuffer;
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

            this.framebuffer = new Framebuffer(gl, this.texture);
        }
0
        

        draw() {
            this.framebuffer.drawTo(() => {
                // Bind framebuffer
                this.gl.clearColor(1, 1, 1, 1);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);

                this.shader.bind();
                this.shader.setInteger("u_NumRays", this.numRays);
                this.shader.setInteger("u_SamplesPerRay", 1000);
                this.shader.setInteger("u_OcclusionMap", 1);

                this.vertexBuffer.bind();

                // TODO: Can we draw line instead?
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices() );
            });
        }

        
        bindTexture(textureSlot: number) {
            this.texture.bind(textureSlot); 
        }
    
    }

}