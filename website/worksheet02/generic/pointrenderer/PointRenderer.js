class PointRenderer {
    
    constructor(gl, camera){
        if( gl == null )
            throw "GL context cannot be null";
        if( camera == null )
            throw "Camera cannot be null";

        this._gl = gl;

        this._camera = camera;

        this._vertexBuffer = new VertexBuffer(gl, 256);
        this._vertexBuffer.addAttribute("a_Position", 2);
        this._vertexBuffer.addAttribute("a_ZIndex", 1);
        this._vertexBuffer.addAttribute("a_Size", 1);
        this._vertexBuffer.addAttribute("a_Color", 4);

        this._program = initShaders(gl, "/worksheet02/generic/pointrenderer/vertex.shader", "/worksheet02/generic/generic_fragment.shader");
    
        this._points = 0;
    }



    drawPoint(pos, depthIndex, size, color){
        this._vertexBuffer.push(
            pos,  // x, y
            depthIndex,    // Single value
            size, // single value
            color // rgba
        );
        this._points++;
    }


    flush() {
        if( this._points == 0 ) return;
        this._gl.useProgram(this._program);

        var uTransform = gl.getUniformLocation(this._program, "u_Transform");
        gl.uniformMatrix4fv(uTransform, false, this._camera.getTransform());

        this._vertexBuffer.bind(this._program);

        this._gl.drawArrays(gl.POINTS, 0, this._points);

        this._points = 0;
        this._vertexBuffer.clear();
    }
}