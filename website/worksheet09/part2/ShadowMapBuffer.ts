
namespace Sheet9.Part2 {

    export class ShadowMapBuffer {

        private gl: WebGLRenderingContext;

        private framebuffer: WebGLFramebuffer;
        private renderbuffer: WebGLRenderbuffer;
        private texture: WebGLTexture;

        private width: number;
        private height: number;

        private unbindWidth: number;
        private unbindHeight: number;

        private bound: boolean = false;

        constructor(gl: WebGLRenderingContext, width: number, height: number) {
            this.gl = gl;
            this.width = width;
            this.height = height;

            // Check that size is power of 2 (required for texture).
            // This detail caused be A LOT of headaches
            if( Math.log2(this.width) % 1 !== 0 )
                throw "ShadwMap: Width must be a power of 2";
            if( Math.log2(this.height) % 1 !== 0 )
                throw "ShadwMap: Height must be a power of 2";

            // Constructs framebuffer
            this.framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            
            // Create and attach render buffer for depth component
            this.renderbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

            {
                var data = Array<number>();
    
                for( var y=0; y<width; y++ ) {
                    for( var x=0; x<height; x++ ) {
                        // var black = (Math.floor(x/16) + Math.floor(y/16)) % 2 == 0;
                        // var color = black ? [0, 0, 0, 1] : [255, 255, 255, 1];
                        var color = [100, 255, 175, 1];
                        color.forEach((e) => data.push(e));
                    } 
                } 

                var dataFlattened = new Uint8Array(data);

                // Create shadowmap buffer
                this.texture = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, dataFlattened);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            }
            
            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                throw "Framebuffer creation failed: " + status.toString();
            }

            // Rebind default buffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        }


        bind(textureSlot: number) {
            if( this.bound ) return;
            this.bindTexture(textureSlot);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer);

            var currentViewport = this.gl.getParameter(this.gl.VIEWPORT);
            this.unbindWidth = currentViewport[2];
            this.unbindHeight = currentViewport[3];
            this.gl.viewport(0, 0, this.width, this.height);
            this.bound = true;
        }

        
        /**
         *  Unbinds this framebuffer (and render buffer), and rebinds the default
         */
        unbind() {

            if( !this.bound ) return;
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            this.gl.viewport(0, 0, this.unbindWidth, this.unbindHeight);
            this.bound = false;
        }

        bindTexture(textureSlot: number) {
            this.gl.activeTexture(this.gl.TEXTURE0+textureSlot);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        }


        getWidth() : number {
            return this.width;
        }

        getHeight() : number {
            return this.height;
        }
        
    

    }

}