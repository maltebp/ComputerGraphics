var Sheet5;
(function (Sheet5) {
    var Part3;
    (function (Part3) {
        class ModelRenderer {
            constructor(gl) {
                if (gl == null)
                    throw "GL context cannot be null";
                this.gl = gl;
                this.shader = new Util.ShaderProgram(gl, "vertex.glsl", "fragment.glsl");
            }
            draw(camera, model) {
                this.shader.bind();
                this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
                this.shader.setFloatMatrix4("u_Model", model.getModelMatrix());
                model.getVertexBuffer().bind();
                model.getIndexBuffer().bind();
                this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().length(), this.gl.UNSIGNED_SHORT, 0);
            }
        }
        Part3.ModelRenderer = ModelRenderer;
    })(Part3 = Sheet5.Part3 || (Sheet5.Part3 = {}));
})(Sheet5 || (Sheet5 = {}));
