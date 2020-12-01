
namespace Sheet9.Part1 {

    export class GroundRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private texture: Util.Texture;
        private loaded = false;

        constructor(gl: WebGLRenderingContext, texturePath: string, groundWidth: number, groundLength: number){
            this.gl = gl;
    
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_TextureCoordinates", 2);    

            { // Construct vertices
                let halfWidth = groundWidth/2.0;
                let halfHeight = groundLength/2.0;

                this.vertexBuffer.push(
                    -halfWidth, -halfHeight, 0, 0,
                    -halfWidth, halfHeight, 0, 1,
                    halfWidth, -halfHeight, 1, 0,

                    -halfWidth, halfHeight, 0, 1,
                    halfWidth, halfHeight, 1, 1,
                    halfWidth, -halfHeight, 1, 0
                );
            }

            this.shader = new Util.ShaderProgram(gl, "ground/vertex.glsl", "ground/fragment.glsl");

            // Load texture
            let _this = this;
            Util.Texture.createFromImage(gl, texturePath)
                .setChannels(4)
                .setFilter(gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR)
                .build((texture) => {
                    _this.texture = texture;
                    _this.loaded = true;
                });
        }

    
        draw(camera: Util.Camera, pointLight: Util.PointLight, ambientColor: Util.Color){
            if( !this.loaded ) return;
            
            this.shader.bind();

            this.gl.disable(this.gl.BLEND); 

            this.texture.bind(0);

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatVector3("u_AmbientEmission", ambientColor.asList(false));
            this.shader.setFloatVector3("u_LightEmission", pointLight.getColor().asList(false));
            this.shader.setFloatVector3("u_LightPosition", pointLight.getPosition());
            this.shader.setFloatVector3("u_CameraPosition", camera.getPosition());

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }


}