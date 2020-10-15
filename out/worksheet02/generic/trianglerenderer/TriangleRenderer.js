

class TriangleRenderer {
    
    constructor(gl, camera){
        if( gl == null )
            throw "GL context cannot be null";
        if( camera == null )
            throw "Camera cannot be null";

        this._gl = gl;
        this._camera = camera;

        this._vertexBuffer = new Util.VertexBuffer(gl, 256);
        this._vertexBuffer.addAttribute("a_Position", 2);
        this._vertexBuffer.addAttribute("a_ZIndex", 1);
        this._vertexBuffer.addAttribute("a_Color", 4);

        this._program = initShaders(gl, "/worksheet02/generic/trianglerenderer/vertex.shader", "/worksheet02/generic/generic_fragment.shader");
    
        this._triangles = 0;
    }



    drawTriangle(depthIndex, points){
        points.forEach(point => {
            this._vertexBuffer.push(
                point._pos,
                depthIndex,
                point._color
            )
        });
        this._triangles++;
    }


    flush() {
        if( this._triangles == 0 ) return;
        this._gl.useProgram(this._program);

        var uTransform = gl.getUniformLocation(this._program, "u_Transform");
        gl.uniformMatrix4fv(uTransform, false, this._camera.getTransform());

        this._vertexBuffer.bind(this._program);

        this._gl.drawArrays(gl.TRIANGLES, 0, this._triangles*3);

        this._triangles = 0;
        this._vertexBuffer.clear();
    }
}