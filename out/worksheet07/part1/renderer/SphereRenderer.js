var Sheet7;
(function (Sheet7) {
    var Part1;
    (function (Part1) {
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
                this.backgroundVertices = new Util.VertexBuffer(gl);
                this.backgroundVertices.addAttribute("a_Position", 3);
                this.backgroundVertices.addAttribute("a_Color", 4); // TODO: REMOVE THIS
                this.backgroundVertices.push(-1, 1, 0.999, 0, 0, 0, 0, -1, -1, 0.999, 0, 0, 0, 0, 1, -1, 0.999, 0, 0, 0, 0, -1, 1, 0.999, 0, 0, 0, 0, 1, -1, 0.999, 0, 0, 0, 0, 1, 1, 0.999, 0, 0, 0, 0);
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
                this.drawBackground(camera);
                // this.shader.bind();
                // this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
                // this.shader.setFloatMatrix4("u_Model", this.sphere.getModelMatrix());
                // if( this.lightDirection != null ){
                //     this.shader.setFloatVector3("u_LightDirection", this.lightDirection);
                //     this.shader.setFloatVector3("u_LightEmission", this.lightColor);
                // }
                // this.shader.setFloatVector3("u_AmbientEmission", this.ambientColor);
                // this.shader.setInteger("u_TextureSampler", 0);
                // this.vertexBuffer.bind();
                // this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
            }
            drawBackground(camera) {
                this.shader.bind();
                // @ts-ignore
                this.shader.setFloatMatrix4("u_ViewProjection", flatten(mat4()));
                // @ts-ignore
                this.shader.setFloatMatrix4("u_Model", flatten(mat4()));
                if (this.lightDirection != null) {
                    this.shader.setFloatVector3("u_LightDirection", this.lightDirection);
                    // @ts-ignore
                    this.shader.setFloatVector3("u_LightEmission", flatten(vec3(0, 0, 0)));
                    // Remove light emission oon background        
                }
                // @ts-ignore
                this.shader.setFloatVector3("u_AmbientEmission", flatten(vec3(0, 0, 0)));
                // @ts-ignore
                let reversedViewMatrix = inverse4(camera.getViewMatrix);
                // @ts-ignore
                reversedViewMatrix = mat4(reversedViewMatrix[0][0], reversedViewMatrix[0][1], reversedViewMatrix[0][2], 0, reversedViewMatrix[1][0], reversedViewMatrix[1][1], reversedViewMatrix[1][2], 0, reversedViewMatrix[2][0], reversedViewMatrix[2][1], reversedViewMatrix[2][2], 0, 0, 0, 0, 0);
                // @ts-ignore
                let textureMatrix = mult(reversedViewMatrix, 
                // @ts-ignore
                inverse4(camera.getProjectionMatrix));
                // @ts-ignore
                this.shader.setFloatMatrix4("u_TextureMatrix", flatten(textureMatrix));
                this.shader.setInteger("u_TextureSampler", 0);
                this.vertexBuffer.bind();
                this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
            }
        }
        Part1.SphereRenderer = SphereRenderer;
    })(Part1 = Sheet7.Part1 || (Sheet7.Part1 = {}));
})(Sheet7 || (Sheet7 = {}));
