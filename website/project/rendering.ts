
namespace Project.Rendering {

    declare var gl;

    declare var transparencyFrameBuffer;
    declare var transparencyColorTexture;
    declare var transparencyAlphaTexture;
    declare var transparencyShader;

    
    declare var depthBuffer;

    declare var opaqueVertices: VertexBuffer;
    declare var opaqueShader;

    declare var transparentVertices: VertexBuffer;
    declare var viewProjectionMatrix: Float32Array;

    declare var compositionShader;

    declare var numOpaqueSquares: number;
    declare var numTransparentSquares: number;

    // Framebuffer with a texture as draw buffer
    declare var screenFrameBuffer;
    declare var screenColorTexture;
    declare var screenShader;

    // Just a vertexbuffer which contains vertices for
    // 2 triangles in NDC coordinates, which fill the 
    // entire screen
    declare var quadVertices: VertexBuffer;



    export function initialize(glContext){
        gl = glContext;

        numOpaqueSquares = 0;
        numTransparentSquares = 0;


        // We blend in both texture and screen rendering
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);


        //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Setup Frame Buffer for Screen rendering

        // Setup shared depth buffer (as a RenderBuffer)
        depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 720, 480);

        // depthBuffer = gl.createTexture();
        // gl.bindTexture(gl.TEXTURE_2D, depthBuffer);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 720, 480, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null );
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.TexParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.TexParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 

        // gl.genTextures(1, &ssaoDepthTextureID);
        // glBindTexture(GL_TEXTURE_2D, ssaoDepthTextureID);

        // glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT, 1024, 768, 0, GL_DEPTH_COMPONENT, GL_FLOAT, 0);

        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST); 
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_COMPARE_FUNC, GL_LEQUAL);
        // glTexParameteri (GL_TEXTURE_2D, GL_TEXTURE_COMPARE_MODE, GL_NONE);


        // Create 
        screenColorTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, screenColorTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 720, 480, 0, gl.RGB, gl.UNSIGNED_BYTE, null );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 

        // Create and bind new frame buffer
        screenFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, screenFrameBuffer);
        gl.bindTexture(gl.TEXTURE_2D, screenColorTexture);
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenColorTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
        

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Setup Frame buffer for transparency pass

        // Create frame texture
        transparencyColorTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, transparencyColorTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 720, 480, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 

        // Create frame texture
        transparencyAlphaTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, transparencyAlphaTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 720, 480, 0, gl.RED, gl.UNSIGNED_BYTE, null );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 

        // Create and bind new frame buffer
        transparencyFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, transparencyFrameBuffer);

        gl.bindTexture(gl.TEXTURE_2D, transparencyColorTexture);
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, transparencyColorTexture, 0);

        gl.bindTexture(gl.TEXTURE_2D, transparencyAlphaTexture);
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, transparencyAlphaTexture, 0);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
        
        
        // Rebind to default framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        transparentVertices = new VertexBuffer(gl, 1000);
        transparentVertices.addAttribute("a_Position", 3);
        transparentVertices.addAttribute("a_Color", 4);


        opaqueVertices = new VertexBuffer(gl, 1000);
        opaqueVertices.addAttribute("a_Position", 3);
        opaqueVertices.addAttribute("a_Color", 4);

        quadVertices = new VertexBuffer(gl, 100);
        quadVertices.addAttribute("a_Position", 2);
        quadVertices.addAttribute("a_TexCoords", 2);
        quadVertices.push(
            -1, 1,  0, 1,
            -1, -1, 0, 0,
             1, -1, 1, 0,
            
            -1,  1, 0, 1,
             1, -1, 1, 0,
             1,  1, 1, 1
        );


        
        // @ts-ignore
        opaqueShader = initShaders(gl, "opaque_shader/vertex.glsl", "opaque_shader/fragment.glsl");


        // @ts-ignore
        transparencyShader = initShaders(gl, "transparency_shader/vertex.glsl", "transparency_shader/fragment.glsl");
        
        // @ts-ignore
        compositionShader = initShaders(gl, "composition_shader/vertex.glsl", "composition_shader/fragment.glsl");

        // @ts-ignore
        screenShader = initShaders(gl, "screen_shader/vertex.glsl", "screen_shader/fragment.glsl");

            


        // @ts-ignore
        viewProjectionMatrix = flatten( mult(ortho(360, -360, -240, 240, 0, 5000), lookAt(vec3(0,0,0), vec3(0,0,1), vec3(0, 1, 0))));
        // Setting left to positive, and right to negative, will flip the x-axis and change it
        // from a right-handed to a left-handed system
    }


    

    function renderOpaque(){

    }


    function renderTransparent(){

    }


    export function flush(){


        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Opaque Rendering

        // Setup drawing
        gl.bindFramebuffer(gl.FRAMEBUFFER, screenFrameBuffer);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true); // TODO: Can't use this, and can't figure out why
        gl.clearColor( 1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.disable(gl.BLEND);

        
        
        if( numOpaqueSquares != 0){
            gl.useProgram(opaqueShader);
            var uViewProjection = gl.getUniformLocation(opaqueShader, "u_ViewProjection");
            gl.uniformMatrix4fv(uViewProjection, false, viewProjectionMatrix);
            opaqueVertices.bind(opaqueShader);
            gl.drawArrays(gl.TRIANGLES, 0, numOpaqueSquares * 6);
        }
        
        numOpaqueSquares = 0;
        opaqueVertices.clear();


        if( numTransparentSquares != 0){
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            // Object rendering
            // We render to a texture

            // Setup drawing
            gl.bindFramebuffer(gl.FRAMEBUFFER, transparencyFrameBuffer);

            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);

            gl.enable(gl.BLEND);

            gl.depthMask(false); // TODO: Can't use this, and can't figure out why
            
            gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);

            gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
            gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 1])
            gl.clearBufferfv(gl.COLOR, 1, [1, 1, 1, 1])
            
            if( numTransparentSquares != 0){
                gl.useProgram(transparencyShader);
                var uViewProjection = gl.getUniformLocation(transparencyShader, "u_ViewProjection");
                gl.uniformMatrix4fv(uViewProjection, false, viewProjectionMatrix);
                transparentVertices.bind(transparencyShader);
                gl.drawArrays(gl.TRIANGLES, 0, numTransparentSquares * 6);
            }
            
            numTransparentSquares = 0;
            transparentVertices.clear();


            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            // Composite Rendering

            gl.bindFramebuffer(gl.FRAMEBUFFER, screenFrameBuffer); // Using null instead of 0, to bind default

            // No reason to do depth test here
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);

            gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA);

            gl.useProgram(compositionShader);

            // lookup the sampler locations.
            var u_image0Location = gl.getUniformLocation(compositionShader, "u_ColorTexture");
            var u_image1Location = gl.getUniformLocation(compositionShader, "u_AlphaTexture");
            
            // set which texture units to render with.
            gl.uniform1i(u_image0Location, 0);  // texture unit 0
            gl.uniform1i(u_image1Location, 1);  // texture unit 1

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, transparencyColorTexture); 

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, transparencyAlphaTexture); 

            quadVertices.bind(compositionShader);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }



        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Draw the screen texture to the BACK buffer

        gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Using null instead of 0, to bind default

        // No reason to do depth test here
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);

        gl.useProgram(screenShader);

        // lookup the sampler locations.
        var u_image0Location = gl.getUniformLocation(screenShader, "u_ColorTexture");
        
        // set which texture units to render with.
        gl.uniform1i(u_image0Location, 0); // Texture unit 0

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, screenColorTexture); 

        quadVertices.bind(screenShader);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }


    export function drawSquare(square: Square){

        if( square.isTransparent() ){
            numTransparentSquares++;
            transparentVertices.push(square.getVertices());
        }else {
            numOpaqueSquares++;
            opaqueVertices.push(square.getVertices());

        }

    }
    

}