
namespace Project {

    export class BackgroundRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        
        private tileSize = 64;

        private texture: Util.Texture = null;


        constructor(gl: WebGLRenderingContext) {
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

            Util.Texture.createFromImage(gl, "/project/tile.png")
                .setChannels(4)
                .setFilter(gl.LINEAR, gl.LINEAR)
                .setWrap(gl.REPEAT, gl.REPEAT)
                .build((texture) => this.texture = texture) 
                ;

            this.shader = new Util.ShaderProgram(gl, "/project/background/vertex.glsl", "/project/background/fragment.glsl");          
        }
        

        drawBackground( camera: Camera2D ) {
            if( this.texture === null ) return;

            // @ts-ignore
            let inverseCamera = inverse(camera.getMatrix());

            
            // @ts-ignore 
            let worldToTexture = mult(
                // Translation matrix
                // @ts-ignore
                mat3(
                    1, 0, 0.5,
                    0, 1, 0.5,
                    0, 0,   1
                ),
                // Scaling matrix
                // @ts-ignore
                mat3(
                    1/this.tileSize,                0, 0,
                                  0,  1/this.tileSize, 0,
                                  0,                0, 1
                )
            );

            // Combine to total matrix, which transforms the NDC coordinates
            // to correct texture coordinates
            // @ts-ignore 
            let textureMatrix = mult(worldToTexture, inverseCamera);

    
            this.shader.bind();
            this.shader.setInteger("u_Texture", 0);
            this.shader.setFloatMatrix3("u_TextureMatrix", textureMatrix);

            this.vertexBuffer.bind();

            this.texture.bind(0);

            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }


    }



}