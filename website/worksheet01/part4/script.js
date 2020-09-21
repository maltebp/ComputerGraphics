



var program;
var gl;
var vertices;
var rotation = 0;


function setup(){
    gl = appendGLCanvas("container", 512, 512);
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 

    // Compile and use shader
    program = initShaders(gl, "vert.shader", "frag.shader");
    gl.useProgram(program);
    
    vBuffer = gl.createBuffer();

    vertices = new Float32Array([
        -0.5,   0.5,   1.0, 0.0, 0.0,
         0.5, 0.5,    0.0, 1.0, 0.0,
        -0.5,  -0.5,   0.0, 0.0, 1.0,
        -0.5, -0.5,  0.0, 0.0, 1.0,
        0.5, 0.5,  0.0, 1.0, 0.0,
        0.5, -0.5,  1.0, 0.0, 0.0
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}


function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log("Animating");

    // Perform transform
    rotation += 0.01; //Math.PI/2.0;
    var transform = new Float32Array([
        Math.cos(rotation), Math.sin(rotation),
        -Math.sin(rotation), Math.cos(rotation)
    ]);

    var uTransform = gl.getUniformLocation(program, "u_Transform");
    gl.uniformMatrix2fv(uTransform, false, transform);


    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 4*5, 0);
    gl.enableVertexAttribArray(vPosition);

    var vColor = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 4*5, 2*4);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLES, 0, 6);


    requestAnimationFrame(animate);
}


setup();
animate();



