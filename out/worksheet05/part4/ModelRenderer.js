var Sheet5;
(function (Sheet5) {
    var Part4;
    (function (Part4) {
        class ModelRenderer {
            constructor(gl) {
                this.lightDirection = null;
                this.lightColor = null;
                this.ambientColor = [0.20, 0.20, 0.20];
                this.materialDiffuse = 0.5;
                this.materialSpecular = 0.5;
                this.materialAmbient = 0.5;
                this.materialShine = 100;
                if (gl == null)
                    throw "GL context cannot be null";
                this.gl = gl;
                this.shader = new Util.ShaderProgram(gl, "vertex.glsl", "fragment.glsl");
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
            draw(camera, model) {
                this.shader.bind();
                this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
                this.shader.setFloatMatrix4("u_Model", model.getModelMatrix());
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
                model.getVertexBuffer().bind();
                model.getIndexBuffer().bind();
                this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().length(), this.gl.UNSIGNED_SHORT, 0);
            }
        }
        Part4.ModelRenderer = ModelRenderer;
    })(Part4 = Sheet5.Part4 || (Sheet5.Part4 = {}));
})(Sheet5 || (Sheet5 = {}));
