

class CircleRenderer {
    
    constructor(gl, camera){
        if( gl == null )
            throw "GL context cannot be null";
        if( camera == null )
            throw "Camera cannot be null";

        this._gl = gl;
        this._camera = camera;
        
        this._numTriangles = 100; // Number of triangles to use with fan
        this._rotationPerTriangle = (Math.PI*2)/this._numTriangles;

        this._vertexBuffer = new VertexBuffer(gl, 1000);
        this._vertexBuffer.addAttribute("a_Position", 2);
        this._vertexBuffer.addAttribute("a_ZIndex", 1);
        this._vertexBuffer.addAttribute("a_Color", 4);

        this._program = initShaders(gl, "/worksheet02/generic/circlerenderer/vertex.shader", "/worksheet02/generic/generic_fragment.shader");
    
        this._circles = 0;
    }


    /**
     * 
     * @param {*} depthIndex The depth (z) index to draw on
     * @param {*} center Center position of the circle
     * @param {*} radius The radius of the circle
     * @param {*} colors Array where [0] is the center color and [1] is the border color. The final color will be interpolated from the center color to the border.
     */
    drawCircle(depthIndex, center, radius, colors){
        // Fan points
        var points = [];
        for( var i=0; i < this._numTriangles; i++ ){
            points.push(vec2(
                center[0] + radius * Math.cos(this._rotationPerTriangle*i),
                center[1] + radius * Math.sin(this._rotationPerTriangle*i)
            ));
        }       
        
        // console.log(points);

        // Per triangle: 3 vertices consisting of position (2 floats) and color (3 floats)
        for( var i=0; i<this._numTriangles; i++ ){
            var point1 = points[i];
            var point2 = points[(i+1)%points.length];

            this._vertexBuffer.push(
                point1, // x, y
                depthIndex,
                colors[1]
            );

            this._vertexBuffer.push(
                point2, // x, y
                depthIndex,
                colors[1]
            );

            // Center
            this._vertexBuffer.push(
                center,
                depthIndex,
                colors[0]
            );
        }

        // console.log(this._vertexBuffer);

        this._circles++;
    }

    flush() {
        if( this._circles == 0 ) return;
        this._gl.useProgram(this._program);

        var uTransform = gl.getUniformLocation(this._program, "u_Transform");
        gl.uniformMatrix4fv(uTransform, false, this._camera.getTransform());

        this._vertexBuffer.bind(this._program);

        this._gl.drawArrays(gl.TRIANGLES, 0, this._circles*this._numTriangles*3);

        this._circles = 0;
        this._vertexBuffer.clear();
    }
}