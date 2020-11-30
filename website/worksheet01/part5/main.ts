
namespace Sheet1.Part5 {
    
    const TRIANGLES = 50;
    const RADIUS = 0.15;
    const BALL_BOOST = 4;

    declare var gl: WebGLRenderingContext;
    declare var shader: Util.ShaderProgram;
    declare var vertexBuffer: Util.VertexBuffer;
    declare var frameTimer: Util.FrameTimer;

    declare var gravity;
    declare var ballVelocityY;
    declare var ballY;

    function setup() {
        ballVelocityY = 0;
        gravity = -5.0;
        ballY = 0;       

        gl = Util.appendGLCanvas("container", 512, 512);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT);

        frameTimer = new Util.FrameTimer("fps");

        shader = new Util.ShaderProgram(gl, "vert.shader", "frag.shader");
        shader.bind();        
            
        vertexBuffer = new Util.VertexBuffer(gl);
        vertexBuffer.addAttribute("a_Position", 2);
        vertexBuffer.addAttribute("a_Color", 3);


        let rotationPerTriangle = (Math.PI * 2) / TRIANGLES;

        // Triangle fan outer points
        let points = [];
        for( var i=0; i < TRIANGLES; i++ ){
            points.push([
                RADIUS*Math.cos(rotationPerTriangle*i),
                RADIUS*Math.sin(rotationPerTriangle*i)
            ]);
        }

        // Per triangle: 3 vertices consisting of position (2 floats) and color (3 floats)
        for( var i=0; i<TRIANGLES; i++ ){
            var point1 = points[i];
            var point2 = points[(i+1)%points.length];

            vertexBuffer.push(
                point1, // x, y
                0.5, 0, 0
            );

            vertexBuffer.push(
                point2, // x, y
                0.5, 0, 0
            );

            // Center
            vertexBuffer.push(
                0, 0, // x, y
                0.9, 0, 0
            );
        }

        vertexBuffer.bind();

        // Setup space press event
        document.onkeypress = (e) => {
            console.log("boost");
            if( e.code === 'Space' ) {
                ballVelocityY += BALL_BOOST;
                e.preventDefault();
            }
        };
    }


    function physics(timeStep){

        
    }

    function update() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Physics
        var timeStep = frameTimer.registerFrame()/1000.0;
    
        ballVelocityY += gravity*timeStep;
        
        var newY = ballY + ballVelocityY*timeStep;
        if( newY+RADIUS > 1.0 ) {
            ballY = 1.0-RADIUS;
            ballVelocityY *= -0.85;
        }
        else if( newY-RADIUS < -1.0 ) {
            ballY = -1.0+RADIUS;
            ballVelocityY *= -0.85; // Giving it a small boost
        }else{
            ballY = newY;
        }

        // Set ball position
        shader.setFloatVector2("u_BallPosition", [0, ballY]);
        
        gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.getNumVertices());
    
        requestAnimationFrame(update);
    }


    
    export function start(){
        setup();
        update();
    }

}

Sheet1.Part5.start();

// var program;
// var gl;
// var vertices;
// var rotation = 0;

// var frameCount = 0;
// var fpsCooldown = 0;

// var previousTime = Date.now();

// var gravity = -5.0;
// var ballVelocityY = 0.0;
// var ballY = 0;


// function setup(){
//     gl = Util.appendGLCanvas("container", 512, 512);
//     gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 

//     // Compile and use shader
//     program = initShaders(gl, "vert.shader", "frag.shader");
//     gl.useProgram(program);
    


//     var vertexBuffer = new Util.VertexBuffer(gl);


//     var rotationPerTriangle = (Math.PI * 2) / TRIANGLES;

//     var points = [];

//     // Triangle fan points
//     for( var i=0; i < TRIANGLES; i++ ){
//         points.push(vec2(
//             RADIUS*Math.cos(rotationPerTriangle*i),
//             RADIUS*Math.sin(rotationPerTriangle*i)
//         ));
//     }


//     // Per triangle: 3 vertices consisting of position (2 floats) and color (3 floats)
//     for( var i=0; i<TRIANGLES; i++ ){
//         var point1 = points[i];
//         var point2 = points[(i+1)%points.length];

//         vertexBuffer.push(
//             point1, // x, y
//             0.5, 0, 0
//         );

//         vertexBuffer.push(
//             point2, // x, y
//             0.5, 0, 0
//         );

//         // Center
//         vertexBuffer.push(
//             0, 0, // x, y
//             0.9, 0, 0
//         );
//     }

//     vertexBuffer.compress();
//     vertexBuffer.bind(program);


//     // Setup space press event
//     document.onkeypress = (e) => {
//         console.log("boost");
//         if( e.which == 32 || e.keyCode ) {
//             ballVelocityY += BALL_BOOST;
//             e.preventDefault();
//         }
//     };
// }   





// function render() {
//     gl.clear(gl.COLOR_BUFFER_BIT);
    
//     // Perform rotation
//     rotation += 0.01; //Math.PI/2.0;
//     var transform = new Float32Array([
//         Math.cos(rotation), Math.sin(rotation), // First column
//         -Math.sin(rotation), Math.cos(rotation) // Second column
//     ]);

//     var uTransform = gl.getUniformLocation(program, "u_Transform");
//     gl.uniformMatrix2fv(uTransform, false, transform);

//     // Set ball position
//     var uBallPos = gl.getUniformLocation(program, "u_BallPosition");
//     gl.uniform2fv(uBallPos, new Float32Array([0, ballY]));
   
//     var vPosition = gl.getAttribLocation(program, "a_Position");
//     gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 4*5, 0);
//     gl.enableVertexAttribArray(vPosition);

//     var vColor = gl.getAttribLocation(program, "a_Color");
//     gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 4*5, 2*4);
//     gl.enableVertexAttribArray(vColor);

//     gl.drawArrays(gl.TRIANGLES, 0, TRIANGLES*3);
// }


// function update(){
//     var currentTime = Date.now();
//     var timeStep = currentTime - previousTime;
//     previousTime = currentTime;

//     physics(timeStep);
//     render(timeStep);

//     // Update fps:
//     frameCount++;
//     fpsCooldown -= timeStep;

//     if( fpsCooldown < 0 ) {
//         document.getElementById("fps").innerHTML = "FPS: " + (frameCount/FPS_FREQ);
//         fpsCooldown = FPS_FREQ*1000 - fpsCooldown;
//         frameCount = 0;
//     }

//     requestAnimationFrame(update);
// }


// setup();
// update();



