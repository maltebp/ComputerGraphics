var Sheet4;
(function (Sheet4) {
    var Part1;
    (function (Part1) {
        class SphereRenderer {
            constructor(gl) {
                if (gl == null)
                    throw "GL context cannot be null";
                this.gl = gl;
                this.vertexBuffer = new VertexBuffer(gl, 256);
                this.vertexBuffer.addAttribute("a_Position", 3);
                this.vertexBuffer.addAttribute("a_Color", 4);
                // @ts-ignore
                this.program = initShaders(gl, "renderer/vertex.shader", "renderer/fragment.shader");
            }
            draw(sphere, camera) {
                this.gl.useProgram(this.program);
                var uViewProjection = this.gl.getUniformLocation(this.program, "u_ViewProjection");
                // @ts-ignore
                this.gl.uniformMatrix4fv(uViewProjection, false, flatten(camera.getViewProjectionMatrix()));
                var uModel = this.gl.getUniformLocation(this.program, "u_Model");
                // @ts-ignore
                this.gl.uniformMatrix4fv(uModel, false, flatten(sphere.getModelMatrix()));
                let vertices = sphere.getVertices();
                this.vertexBuffer.clear();
                this.vertexBuffer.push(vertices);
                this.vertexBuffer.bind(this.program);
                this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length / 7);
            }
        }
        Part1.SphereRenderer = SphereRenderer;
    })(Part1 = Sheet4.Part1 || (Sheet4.Part1 = {}));
})(Sheet4 || (Sheet4 = {}));
