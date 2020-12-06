
namespace Project {

    export class Framebuffer {

        private buffer: WebGLFramebuffer;
        private gl: WebGLRenderingContext;
        private texture: Util.Texture;

        constructor(gl: WebGLRenderingContext, texture: Util.Texture){
            this.gl = gl;
            this.texture = texture;
            this.buffer = gl.createFramebuffer();

            let originalFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);

            // Attach texture
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.getGLTexture(), 0);

            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                throw "Framebuffer creation failed: " + status.toString();
            }           

            gl.bindFramebuffer(gl.FRAMEBUFFER, originalFramebuffer);
        } 


        drawTo(drawFunction: () => void) {
            let originalFramebuffer = <WebGLFramebuffer> this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);
            let originalViewport = this.gl.getParameter(this.gl.VIEWPORT);

            this.gl.viewport(0, 0, this.texture.getWidth(), this.texture.getHeight());
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer);
            
            drawFunction();

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, originalFramebuffer);
            this.gl.viewport(originalViewport[0], originalViewport[1], originalViewport[2], originalViewport[3]);
        }
    }

}