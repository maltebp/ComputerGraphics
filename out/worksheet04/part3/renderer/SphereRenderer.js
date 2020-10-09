var Sheet4;
(function (Sheet4) {
    var Part3;
    (function (Part3) {
        class SphereRenderer {
            constructor(gl) {
                this.directionalLight = null;
                if (gl == null)
                    throw "GL context cannot be null";
                this.gl = gl;
                this.vertexBuffer = new VertexBuffer(gl, 256);
                this.vertexBuffer.addAttribute("a_Position", 3);
                this.vertexBuffer.addAttribute("a_Color", 4);
                // @ts-ignore
                this.program = initShaders(gl, "renderer/vertex.shader", "renderer/fragment.shader");
            }
            setDirectionalLight(x, y, z) {
                this.directionalLight = [x, y, z];
            }
            draw(sphere, camera) {
                this.gl.useProgram(this.program);
                var uViewProjection = this.gl.getUniformLocation(this.program, "u_ViewProjection");
                // @ts-ignore
                this.gl.uniformMatrix4fv(uViewProjection, false, flatten(camera.getViewProjectionMatrix()));
                var uModel = this.gl.getUniformLocation(this.program, "u_Model");
                // @ts-ignore
                this.gl.uniformMatrix4fv(uModel, false, flatten(sphere.getModelMatrix()));
                if (this.directionalLight != null) {
                    var uLight = this.gl.getUniformLocation(this.program, "u_DirectionalLight");
                    // @ts-ignore
                    this.gl.uniform3fv(uLight, flatten(this.directionalLight));
                }
                let vertices = sphere.getVertices();
                this.vertexBuffer.clear();
                this.vertexBuffer.push(vertices);
                this.vertexBuffer.bind(this.program);
                this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length / 7);
            }
        }
        Part3.SphereRenderer = SphereRenderer;
    })(Part3 = Sheet4.Part3 || (Sheet4.Part3 = {}));
})(Sheet4 || (Sheet4 = {}));
