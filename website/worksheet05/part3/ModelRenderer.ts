

namespace Sheet5.Part3 {

    export class ModelRenderer {
        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;

        constructor(gl: WebGLRenderingContext){
            this.gl = gl;
            this.shader = new Util.ShaderProgram(gl, "vertex.glsl", "fragment.glsl");
        }
        
    
        draw(camera: Util.Camera, model: Model){
            this.shader.bind();

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_Model", model.getModelMatrix());

            model.getVertexBuffer().bind();
            model.getIndexBuffer().bind();

            this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().length(), this.gl.UNSIGNED_SHORT, 0);
        }
    }
}
