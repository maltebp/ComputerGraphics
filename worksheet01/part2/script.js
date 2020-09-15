
var gl = appendGLCanvas(parent="container", width=512, height=512);

gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);


// Compile and use shader
var program = initShaders(gl, "vert.shader", "frag.shader");
gl.useProgram(program);

// Creating 4 points
var data = [
    vec2(0.5, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5),
    vec2(-0.5, 0.5),
];

// Setup buffer
var vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW);



var vPosition = gl.getAttribLocation(program, "a_Position");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

gl.drawArrays(gl.POINTS, 0, 4);




