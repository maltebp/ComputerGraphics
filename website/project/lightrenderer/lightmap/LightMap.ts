
namespace Project {


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


        drawTo(drawCallback: () => void) {
            this.framebuffer.drawTo(drawCallback);
        }
        

        draw() {
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.DST_COLOR, this.gl.ZERO);
            
            this.shader.bind();
            
            this.framebuffer.getTexture().bind(0);
            this.shader.setInteger("u_LightMap", 0);
            
            this.vertexBuffer.bind();
            
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());

        }


        bindTexture(slot: number) {
            return this.framebuffer.getTexture().bind(slot);
        }


    }



}