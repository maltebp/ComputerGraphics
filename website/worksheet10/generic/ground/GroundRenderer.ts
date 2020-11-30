
namespace Sheet10 {

    export class GroundRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;
        private texture: Util.Texture;
        private loaded = false;

        constructor(gl: WebGLRenderingContext, texturePath: string, groundWidth: number, groundLength: number){
            if( gl == null )
                throw "GL context cannot be null";

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

            this.shader = new Util.ShaderProgram(gl, "/worksheet10/generic/ground/vertex.glsl", "/worksheet10/generic/ground/fragment.glsl");

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

    
        draw(camera: Util.Camera, lightCamera: Util.Camera, pointLight: Util.PointLight, ambientColor: Util.Color, shadowMapSlot: number, textureSlot: number){
            if( !this.loaded ) return;
            
            this.shader.bind();

            this.gl.disable(this.gl.BLEND); 

            this.texture.bind(textureSlot);

            // Set texture samplers
            this.shader.setInteger("u_ShadowMap", shadowMapSlot);
            this.shader.setInteger("u_TextureSampler", textureSlot);

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_LightViewProjection", lightCamera.getViewProjectionMatrix());
            
            this.shader.setFloatVector3("u_AmbientEmission", ambientColor.asList(false));
            this.shader.setFloatVector3("u_LightEmission", pointLight.getColor().asList(false));
            this.shader.setFloatVector3("u_LightPosition", lightCamera.getPosition());
            this.shader.setFloatVector3("u_CameraPosition", camera.getPosition());

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }


}