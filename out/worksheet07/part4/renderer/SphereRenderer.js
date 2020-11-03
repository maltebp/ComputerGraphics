var Sheet7;
(function (Sheet7) {
    var Part4;
    (function (Part4) {
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
                this.shader.setInteger("u_NormalMap", 1);
                this.drawBackground(camera);
                this.shader.setInteger("u_Reflection", 1);
                this.shader.setFloatVector3("u_ViewPosition", camera.getPosition());
                this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
                this.shader.setFloatMatrix4("u_Model", this.sphere.getModelMatrix());
                // @ts-ignore
                this.shader.setFloatMatrix4("u_TextureMatrix", flatten(mat4()));
                this.vertexBuffer.bind();
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
            }
            drawBackground(camera) {
                this.gl.depthMask(false);
                this.shader.setInteger("u_Reflection", 0);
                // @ts-ignore
                this.shader.setFloatMatrix4("u_ViewProjection", flatten(mat4()));
                // @ts-ignore
                this.shader.setFloatMatrix4("u_Model", flatten(mat4()));
                // @ts-ignore
                let reversedViewMatrix = inverse4(camera.getViewMatrix());
                // @ts-ignore
                reversedViewMatrix = mat4(reversedViewMatrix[0][0], reversedViewMatrix[0][1], reversedViewMatrix[0][2], 0, reversedViewMatrix[1][0], reversedViewMatrix[1][1], reversedViewMatrix[1][2], 0, reversedViewMatrix[2][0], reversedViewMatrix[2][1], reversedViewMatrix[2][2], 0, 0, 0, 0, 0);
                // @ts-ignore
                let textureMatrix = mult(reversedViewMatrix, 
                // @ts-ignore
                inverse4(camera.getProjectionMatrix()));
                // @ts-ignore
                this.shader.setFloatMatrix4("u_TextureMatrix", flatten(textureMatrix));
                this.backgroundVertices.bind();
                this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
                this.gl.depthMask(true);
            }
        }
        Part4.SphereRenderer = SphereRenderer;
    })(Part4 = Sheet7.Part4 || (Sheet7.Part4 = {}));
})(Sheet7 || (Sheet7 = {}));
