
namespace Project.Rendering {

    declare var gl;
    declare var shader;
    
    declare var frameBuffer;
    declare var frameTexture;
    declare var renderBuffer;

    declare var vertexBuffer: VertexBuffer;
    declare var viewProjectionMatrix: Float32Array;


    declare var flushVertices: VertexBuffer;
    declare var flushShader;

    declare var numSquares: number;

    export function initialize(glContext){
        gl = glContext;

        numSquares = 0;

        // Create frame texture
        frameTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, frameTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 720, 480, 0, gl.RGB, gl.UNSIGNED_BYTE, null );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 

        // Setup render buffer (for depth buffer storage)
        renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 720, 480); // TODO: Try to replace depth and stencil, with just depth
        gl.bindRenderbuffer(gl.RENDERBUFFER, null); // Not sure if this is necessary

        // Create and bind new frame buffer
        frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
        
        

        // Rebind to default framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        vertexBuffer = new VertexBuffer(gl, 1000);
        vertexBuffer.addAttribute("a_Position", 3);
        vertexBuffer.addAttribute("a_Color", 4);




        flushVertices = new VertexBuffer(gl, 100);
        flushVertices.addAttribute("a_Position", 2);
        flushVertices.addAttribute("a_TexCoords", 2);
        flushVertices.push(
            -1, 1,  0, 1,
            -1, -1, 0, 0,
             1, -1, 1, 0,
            
            -1,  1, 0, 1,
             1, -1, 1, 0,
             1,  1, 1, 1
        );

        /*
            -1,  1          1,  1



            -1, -1          1, -1



        */

      


        // @ts-ignore
        shader = initShaders(gl, "vertex.shader", "fragment.shader");
        
        // @ts-ignore
        flushShader = initShaders(gl, "flush_shader/vertex.shader", "flush_shader/fragment.shader");

        // @ts-ignore
        viewProjectionMatrix = flatten( mult(ortho(-360, 360, -240, 240, 0,  5000), lookAt(vec3(0,0,0), vec3(0,0,1), vec3(0, 1, 0))));

    }


    

    function renderOpaque(){

    }


    function renderTransparent(){

    }


    export function flush(){
         // Setup drawing
         gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
         gl.clearColor( 1.0, 1.0, 1.0, 1.0);
         gl.enable(gl.DEPTH_TEST);
         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if( numSquares != 0){
            gl.useProgram(shader);
            var uViewProjection = gl.getUniformLocation(shader, "u_ViewProjection");
            gl.uniformMatrix4fv(uViewProjection, false, viewProjectionMatrix);
            vertexBuffer.bind(shader);
            gl.drawArrays(gl.TRIANGLES, 0, numSquares * 6);
        }
            

        gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Using null instead of 0, to bind default
        gl.clearColor( 1.0, 0.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(flushShader);

        gl.disable(gl.DEPTH_TEST);
        gl.bindTexture(gl.TEXTURE_2D, frameTexture);

        flushVertices.bind(flushShader);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    
        numSquares = 0;
        vertexBuffer.clear();
    }


    export function drawSquare(square: Square){
        numSquares++;
        vertexBuffer.push(square.getVertices());
    }
    

}