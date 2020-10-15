var Sheet4;
(function (Sheet4) {
    var Part2;
    (function (Part2) {
        class SphereRenderer {
            constructor(gl) {
                this.sphere = null;
                if (gl == null)
                    throw "GL context cannot be null";
                this.gl = gl;
                this.vertexBuffer = new Util.VertexBuffer(gl, 50000);
                this.vertexBuffer.addAttribute("a_Position", 3);
                this.vertexBuffer.addAttribute("a_Color", 4);
                this.shader = new Util.ShaderProgram(gl, "renderer/vertex.glsl", "renderer/fragment.glsl");
            }
            setSphere(sphere) {
                this.sphere = sphere;
                this.vertexBuffer.clear();
                this.vertexBuffer.push(sphere.getVertices());
            }
            draw(camera) {
                this.shader.bind();
                this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
                this.shader.setFloatMatrix4("u_Model", this.sphere.getModelMatrix());
                this.vertexBuffer.bind();
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
            }
        }
        Part2.SphereRenderer = SphereRenderer;
    })(Part2 = Sheet4.Part2 || (Sheet4.Part2 = {}));
})(Sheet4 || (Sheet4 = {}));
