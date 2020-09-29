class CubeRenderer {
    constructor(gl, camera) {
        if (gl == null)
            throw "GL context cannot be null";
        this.gl = gl;
        this.camera = camera;
        this.vertexBuffer = new VertexBuffer(gl, 256);
        this.vertexBuffer.addAttribute("a_Position", 3);
        this.vertexBuffer.addAttribute("a_Color", 4);
        this.indexBuffer = new IndexBuffer(gl);
        // @ts-ignore
        this.program = initShaders(gl, "/worksheet03/generic/cuberenderer/vertex.shader", "/worksheet03/generic/cuberenderer/fragment.shader");
    }
    drawModel() {
        // TODO: Implement in part 2
    }
    drawWireFrame(cube, camera) {
        gl.useProgram(this.program);
        var uTransform = gl.getUniformLocation(this.program, "u_Camera");
        // @ts-ignore
        gl.uniformMatrix4fv(uTransform, false, camera.getViewMatrix());
        this.vertexBuffer.clear();
        this.vertexBuffer.push(cube.getVertices());
        this.indexBuffer.clear();
        this.indexBuffer.push(cube.getWireframeIndices());
        this.vertexBuffer.bind(this.program);
        this.indexBuffer.bind();
        this.gl.drawElements(this.gl.LINES, this.indexBuffer.length(), this.gl.UNSIGNED_SHORT, 0);
    }
}
