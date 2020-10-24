var Sheet6;
(function (Sheet6) {
    var Part3;
    (function (Part3) {
        class SphereRenderer {
            constructor(gl) {
                this.lightDirection = null;
                this.lightColor = null;
                this.ambientColor = [0.20, 0.20, 0.20];
                this.sphere = null;
                if (gl == null)
                    throw "GL context cannot be null";
                this.gl = gl;
                this.vertexBuffer = new Util.VertexBuffer(gl, 50000);
                this.vertexBuffer.addAttribute("a_Position", 3);
                this.vertexBuffer.addAttribute("a_Color", 4);
                this.shader = new Util.ShaderProgram(gl, "renderer/vertex.glsl", "renderer/fragment.glsl");
            }
            setDirectionalLight(direction, color) {
                this.lightDirection = direction;
                this.lightColor = color;
            }
            setAmbientColor(color) {
                this.ambientColor = color;
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
                if (this.lightDirection != null) {
                    this.shader.setFloatVector3("u_LightDirection", this.lightDirection);
                    this.shader.setFloatVector3("u_LightEmission", this.lightColor);
                }
                this.shader.setFloatVector3("u_AmbientEmission", this.ambientColor);
                this.shader.setInteger("u_TextureSampler", 0);
                this.vertexBuffer.bind();
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
            }
        }
        Part3.SphereRenderer = SphereRenderer;
    })(Part3 = Sheet6.Part3 || (Sheet6.Part3 = {}));
})(Sheet6 || (Sheet6 = {}));
