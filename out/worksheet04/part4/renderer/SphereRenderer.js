var Sheet4;
(function (Sheet4) {
    var Part4;
    (function (Part4) {
        class SphereRenderer {
            constructor(gl) {
                this.lightDirection = null;
                this.lightColor = null;
                this.ambientColor = [0.20, 0.20, 0.20];
                this.sphere = null;
                this.materialDiffuse = 0.5;
                this.materialSpecular = 0.5;
                this.materialAmbient = 0.5;
                this.materialShine = 100;
                if (gl == null)
                    throw "GL context cannot be null";
                this.gl = gl;
                this.vertexBuffer = new VertexBuffer(gl, 256);
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
            setMaterial(ambient, diffuse, specular, shine) {
                this.materialAmbient = ambient;
                this.materialDiffuse = diffuse;
                this.materialSpecular = specular;
                this.materialShine = shine;
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
                this.shader.setFloatVector3("u_CameraPos", camera.getPosition());
                this.shader.setFloat("u_MaterialDiffuse", this.materialDiffuse);
                this.shader.setFloat("u_MaterialAmbient", this.materialAmbient);
                this.shader.setFloat("u_MaterialSpecular", this.materialSpecular);
                this.shader.setFloat("u_MaterialPhongExponent", this.materialShine);
                this.vertexBuffer.bind();
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
            }
        }
        Part4.SphereRenderer = SphereRenderer;
    })(Part4 = Sheet4.Part4 || (Sheet4.Part4 = {}));
})(Sheet4 || (Sheet4 = {}));
