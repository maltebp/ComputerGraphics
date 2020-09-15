class PointRenderer {
    
    constructor(gl){
        if( gl == null )
            throw "GL context cannot be null";

        this._gl = gl;
        this._vertexBuffer = new VertexBuffer(gl, 256);
        this._vertexBuffer.addAttribute("a_Position", 2);
        this._vertexBuffer.addAttribute("a_ZIndex", 1);
        this._vertexBuffer.addAttribute("a_Size", 1);
        this._vertexBuffer.addAttribute("a_Color", 4);

        this._program = initShaders(gl, "pointrenderer/vertex.shader", "generic_fragment.shader");
    
        this._vertexSize = 8; // Floats
        this._points = 0;
    }



    drawPoint(pos, zIndex, size, color){
        this._vertexBuffer.push(
            pos,  // x, y
            0.5,    // Single value
            size, // single value
            color // rgba
        );
        this._points++;
    }


    flush() {
        console.log(this._vertexBuffer._data);
        this._gl.useProgram(this._program);

        this._vertexBuffer.bind(this._program);

        this._gl.drawArrays(gl.POINTS, 0, this._points);

        this._points = 0;
        this._vertexBuffer.clear();
    }
}