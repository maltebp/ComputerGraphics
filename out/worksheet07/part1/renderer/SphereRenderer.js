var Sheet7;
(function (Sheet7) {
    var Part1;
    (function (Part1) {
        class SphereRenderer {
            constructor(gl) {
                this.sphere = null;
                if (gl == null)
                    throw "GL context cannot be null";
                this.gl = gl;
                this.vertexBuffer = new Util.VertexBuffer(gl, 50000);
                this.vertexBuffer.addAttribute("a_Position", 3);
                this.backgroundVertices = new Util.VertexBuffer(gl);
                this.backgroundVertices.addAttribute("a_Position", 3);
                this.backgroundVertices.push(-1, 1, -0.999, -1, -1, -0.999, 1, -1, -0.999, -1, 1, -0.999, 1, -1, -0.999, 1, 1, -0.999);
                this.shader = new Util.ShaderProgram(gl, "renderer/vertex.glsl", "renderer/fragment.glsl");
            }
            setSphere(sphere) {
                this.sphere = sphere;
                this.vertexBuffer.clear();
                this.vertexBuffer.push(sphere.getVertices());
            }
            draw(camera) {
                this.shader.bind();
                this.shader.setInteger("u_TextureSampler", 0);
                this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
                this.shader.setFloatMatrix4("u_Model", this.sphere.getModelMatrix());
                this.vertexBuffer.bind();
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
            }
        }
        Part1.SphereRenderer = SphereRenderer;
    })(Part1 = Sheet7.Part1 || (Sheet7.Part1 = {}));
})(Sheet7 || (Sheet7 = {}));
