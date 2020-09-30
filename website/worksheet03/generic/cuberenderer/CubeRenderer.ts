

class CubeRenderer {

    private gl;
    private camera: Camera;
    private vertexBuffer: VertexBuffer;
    private indexBuffer: IndexBuffer; 
    private program;
    
    constructor(gl, camera: Camera){
        if( gl == null )
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
    

    drawWireFrame(cube: Cube, camera: Camera){
        gl.useProgram(this.program);

        var uViewProjection = gl.getUniformLocation(this.program, "u_ViewProjection");
        // @ts-ignore
        gl.uniformMatrix4fv(uViewProjection, false, flatten(camera.getViewProjectionMatrix()));

        var uModel = gl.getUniformLocation(this.program, "u_Model");
        // @ts-ignore
        gl.uniformMatrix4fv(uModel, false, flatten(cube.getModelMatrix()));

        this.vertexBuffer.clear();
        this.vertexBuffer.push(cube.getVertices());
        
        this.indexBuffer.clear();
        this.indexBuffer.push(cube.getWireframeIndices());

        this.vertexBuffer.bind(this.program);
        this.indexBuffer.bind();

        this.gl.drawElements(this.gl.LINES, this.indexBuffer.length(), this.gl.UNSIGNED_SHORT, 0);
    }
}