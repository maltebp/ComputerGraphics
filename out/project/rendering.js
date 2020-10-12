var Project;
(function (Project) {
    var Rendering;
    (function (Rendering) {
        function initialize(glContext) {
            gl = glContext;
            numSquares = 0;
            // We blend in both texture and screen rendering
            gl.enable(gl.BLEND);
            // Create frame texture
            frameColor = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, frameColor);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 720, 480, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            // Create frame texture
            frameDepth = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, frameDepth);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 720, 480, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
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
            gl.bindTexture(gl.TEXTURE_2D, frameColor);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameColor, 0);
            gl.bindTexture(gl.TEXTURE_2D, frameDepth);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, frameDepth, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
            // Rebind to default framebuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            vertexBuffer = new VertexBuffer(gl, 1000);
            vertexBuffer.addAttribute("a_Position", 3);
            vertexBuffer.addAttribute("a_Color", 4);
            flushVertices = new VertexBuffer(gl, 100);
            flushVertices.addAttribute("a_Position", 2);
            flushVertices.addAttribute("a_TexCoords", 2);
            flushVertices.push(-1, 1, 0, 1, -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1);
            // @ts-ignore
            shader = initShaders(gl, "transparency_shader/vertex.glsl", "transparency_shader/fragment.glsl");
            // @ts-ignore
            flushShader = initShaders(gl, "flush_shader/vertex.glsl", "flush_shader/fragment.glsl");
            // @ts-ignore
            viewProjectionMatrix = flatten(mult(ortho(360, -360, -240, 240, 0, 5000), lookAt(vec3(0, 0, 0), vec3(0, 0, 1), vec3(0, 1, 0))));
            // Setting left to positive, and right to negative, will flip the x-axis and change it
            // from a right-handed to a left-handed system
        }
        Rendering.initialize = initialize;
        function renderOpaque() {
        }
        function renderTransparent() {
        }
        function flush() {
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            // Object rendering
            // We render to a texture
            // Setup drawing
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            // The 3rd argument only has an effect, if the background it draws to is not opaque
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
            if (numSquares != 0) {
                gl.useProgram(shader);
                var uViewProjection = gl.getUniformLocation(shader, "u_ViewProjection");
                gl.uniformMatrix4fv(uViewProjection, false, viewProjectionMatrix);
                vertexBuffer.bind(shader);
                gl.drawArrays(gl.TRIANGLES, 0, numSquares * 6);
            }
            numSquares = 0;
            vertexBuffer.clear();
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            // Screen Render
            gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Using null instead of 0, to bind default
            gl.clearColor(0.0, 0.0, 1.0, 1.0); // Only doing this to see if the other clear fails
            gl.clear(gl.COLOR_BUFFER_BIT);
            // No reason to do depth test here
            gl.disable(gl.DEPTH_TEST);
            gl.useProgram(flushShader);
            // lookup the sampler locations.
            var u_image0Location = gl.getUniformLocation(flushShader, "u_ColorTexture");
            var u_image1Location = gl.getUniformLocation(flushShader, "u_AlphaTexture");
            // set which texture units to render with.
            gl.uniform1i(u_image0Location, 0); // texture unit 0
            gl.uniform1i(u_image1Location, 1); // texture unit 1
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, frameColor);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, frameDepth);
            flushVertices.bind(flushShader);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        Rendering.flush = flush;
        function drawSquare(square) {
            numSquares++;
            vertexBuffer.push(square.getVertices());
        }
        Rendering.drawSquare = drawSquare;
    })(Rendering = Project.Rendering || (Project.Rendering = {}));
})(Project || (Project = {}));
