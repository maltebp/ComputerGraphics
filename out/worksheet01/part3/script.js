

function draw(){

    // Compile and use shader
    var program = initShaders(gl, "vert.shader", "frag.shader");
    gl.useProgram(program);

    // // Creating 4 points
    // // var data2 = [
    // //     vec2(0.5, 0.5), vec3(1.0, 0.0, 0.0),
    // //     vec2(0.5, 0.5), vec3(1.0, 0.0, 0.0),
    // //     vec2(0.5, 0.5), vec3(1.0, 0.0, 0.0),
    // //     vec2(-0.5, -0.5), ve½c3(1.0, 0.0, 0.0),
    // //     vec2(0.5, -0.5), vec3(1.0, 0.0, 0.0)
    // // ];

    var vertices = new Float32Array([
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, 0.5,   1.0, 0.0, 0.0,
        0.5, -0.5,  0.0, 0.0, 1.0,
    ]);




    // Setup buffer
    // console.log(data2);
    // console.log(flatten(data2));
    var vBuffer = gl.createBuffer();
    var colorBuffer = gl.createBuffer();


    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 4*5, 0);
    gl.enableVertexAttribArray(vPosition);

    var vColor = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 4*5, 2*4);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}


var gl = appendGLCanvas("container", 512, 512);

gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);

draw();



