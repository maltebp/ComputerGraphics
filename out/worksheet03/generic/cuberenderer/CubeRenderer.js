var Sheet3;
(function (Sheet3) {
    class CubeRenderer {
        constructor(gl) {
            if (gl == null)
                throw "GL context cannot be null";
            this.gl = gl;
            this.vertexBuffer = new VertexBuffer(gl, 256);
            this.vertexBuffer.addAttribute("a_Position", 3);
            this.vertexBuffer.addAttribute("a_Color", 4);
            this.indexBuffer = new IndexBuffer(gl);
            // @ts-ignore
            this.program = initShaders(gl, "/worksheet03/generic/cuberenderer/vertex.shader", "/worksheet03/generic/cuberenderer/fragment.shader");
        }
        drawWireFrame(cube, camera) {
            this.gl.useProgram(this.program);
            var uViewProjection = this.gl.getUniformLocation(this.program, "u_ViewProjection");
            // @ts-ignore
            this.gl.uniformMatrix4fv(uViewProjection, false, flatten(camera.getViewProjectionMatrix()));
            var uModel = this.gl.getUniformLocation(this.program, "u_Model");
            // @ts-ignore
            this.gl.uniformMatrix4fv(uModel, false, flatten(cube.getModelMatrix()));
            this.vertexBuffer.clear();
            this.vertexBuffer.push(cube.getVertices());
            this.indexBuffer.clear();
            this.indexBuffer.push(cube.getWireframeIndices());
            this.vertexBuffer.bind();
            this.indexBuffer.bind();
            this.gl.drawElements(this.gl.LINES, this.indexBuffer.length(), this.gl.UNSIGNED_SHORT, 0);
        }
    }
    Sheet3.CubeRenderer = CubeRenderer;
})(Sheet3 || (Sheet3 = {}));
