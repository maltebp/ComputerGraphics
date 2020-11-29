
namespace Sheet9.Part2 {

    export class GroundRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;

        constructor(gl: WebGLRenderingContext, groundWidth: number, groundLength: number){
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

            this.shader = new Util.ShaderProgram(gl, "ground/vertex.glsl", "ground/fragment.glsl");
        }

    
        draw(camera: Util.Camera, lightCamera: Util.Camera, lightColor: number[], ambientColor: number[], shadowMapSlot: number, textureSlot: number){
            this.shader.bind();

            this.gl.disable(this.gl.BLEND); 

            // Set texture samplers
            this.shader.setInteger("u_ShadowMap", shadowMapSlot);
            this.shader.setInteger("u_TextureSampler", textureSlot);

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_LightViewProjection", lightCamera.getViewProjectionMatrix());
            
            this.shader.setFloatVector3("u_AmbientEmission", ambientColor);
            this.shader.setFloatVector3("u_LightEmission", lightColor);
            this.shader.setFloatVector3("u_LightPosition", lightCamera.getPosition());
            this.shader.setFloatVector3("u_CameraPosition", camera.getPosition());

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }


}