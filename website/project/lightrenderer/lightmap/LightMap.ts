
namespace Project {

    /**
     * Contains the sum of all lights rendered, and can be rendered
     * on top of existing screen.
     */
    export class LightMap {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private framebuffer: Framebuffer;
        private ambient: Util.Color;

        
        constructor(gl: WebGLRenderingContext, size: number[]) {
            this.gl = gl;
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

            this.ambient = new Util.Color(0.15, 0.15, 0.15);

            // Create light map (texture + framebuffer)
            Util.Texture.createFromData(gl, null, size[0], size[1])
                .setChannels(3)
                .setFilter(gl.LINEAR, gl.LINEAR)
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
                .build((texture) => this.framebuffer =  new Framebuffer(gl, texture));

            this.shader = new Util.ShaderProgram(gl, "/project/lightrenderer/lightmap/vertex.glsl", "/project/lightrenderer/lightmap/fragment.glsl");          
        }


        // Binds the light map frame buffer, call the given function
        // and unbinds the buffer again
        drawTo(drawCallback: () => void) {
            this.framebuffer.drawTo(drawCallback);
        }
        

        /**
         * Draws the lightmap to the screen (on top of sprites)
         */
        draw() {
            this.gl.enable(this.gl.BLEND);
            // Multiply source color with destination color 
            this.gl.blendFunc(this.gl.DST_COLOR, this.gl.ZERO);
            
            this.shader.bind();
            
            this.framebuffer.getTexture().bind(0);
            this.shader.setInteger("u_LightMap", 0);
            
            this.vertexBuffer.bind();
            
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }

        
        setAmbient(color: Util.Color){
            this.ambient = color.copy();
        }


        clear() {
            // Clears the lightmap with the ambient color
            let ambientList = this.ambient.asList();
            gl.clearColor(ambientList[0], ambientList[1], ambientList[2], 1.0);
            this.framebuffer.drawTo(() => { 
                gl.clear(gl.COLOR_BUFFER_BIT);
            });
        }

    }
}