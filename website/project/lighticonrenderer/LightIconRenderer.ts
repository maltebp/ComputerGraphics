
namespace Project {


    /**
     * Renders simple light icons at lights' position
     */
    export class LightIconRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private texture: Util.Texture = null;

        constructor(gl: WebGLRenderingContext) {
            this.gl = gl;
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_TextureCoordinates", 2);

            Util.Texture.createFromImage(gl, "/project/sprites/lighticon.png")
                .setChannels(4)
                .setFilter(gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR)
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
                .build((texture) => this.texture = texture);

            this.shader = new Util.ShaderProgram(gl, "/project/lighticonrenderer/vertex.glsl", "/project/lighticonrenderer/fragment.glsl");          
        }
        

        draw( camera: Camera2D, ...lights: Light[] ) {
            if( this.texture === null ) return;

            this.vertexBuffer.clear();

            lights.forEach(light => {
                // We just use the collision points for placement
                let points = light.getCollisionPoints();
                this.vertexBuffer.push(
                    points[0], [0, 0],
                    points[1], [1, 0],
                    points[2], [1, 1],
                    points[0], [0, 0],
                    points[2], [1, 1],
                    points[3], [0, 1]
                );
            })
            
            this.texture.bind(0);

            this.shader.bind();
            this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
            this.shader.setInteger("u_Texture", 0);

            this.vertexBuffer.bind();

            this.gl.enable(gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());

        }


    }



}