namespace Util {

    /**
     *  Class wrapping an WebGL texture, and providing a simpler method for creating
     *  such textures using a builder pattern.
     */
    export class Texture {
        private gl: WebGLRenderingContext;
        private texture: WebGLTexture;

        private constructor(gl: WebGLRenderingContext, texture: WebGLTexture) {
            this.gl = gl;
            this.texture = texture;
        }


        getGLTexture() {
            return this.texture;
        }


        bind(slot: number) {
            let currentSlot = this.gl.getParameter(this.gl.ACTIVE_TEXTURE);
            this.gl.activeTexture(this.gl.TEXTURE0 + slot);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);     
            // this.gl.activeTexture(currentSlot);   
        }


        static createFromImage(gl: WebGLRenderingContext, imagePath: string) {
            return new Texture.Builder(gl, imagePath, null, 0, 0);
        }


        static createFromData(gl: WebGLRenderingContext, data: Uint8Array, width: number, height: number) {
            return new Texture.Builder(gl, null, data, width, height);
        }


        /**
         * Builder pattern for a texture
         */
        private static Builder = class {
            private gl: WebGLRenderingContext;
            private minificationFilter: number;
            private magnificationFilter: number;
            private wrapS: number;
            private wrapT: number;
            private imagePath: string;
            private imageData: Uint8Array = null;
            private numChannels = 4;
            private width: number;
            private height: number;

    
            constructor(gl: WebGLRenderingContext, imagePath: string, data: Uint8Array, width: number, height: number) {
                this.gl = gl;
                this.minificationFilter = gl.LINEAR;
                this.magnificationFilter = gl.LINEAR;
                this.wrapS = gl.REPEAT;
                this.wrapT = gl.REPEAT;
                this.imagePath = imagePath;
                this.imageData = data;
                this.width = width;
                this.height = height;
            }
            
            setFilter(minification: number, magnification: number) {
                this.minificationFilter = minification;
                this.magnificationFilter = magnification;
                return this;
            }


            setWrap(wrapS: number, wrapT: number) {
                this.wrapS = wrapS;
                this.wrapT = wrapT;
                return this;
            }


            setChannels(numChannels: number) {
                if( numChannels < 1 || numChannels > 4) throw "Number of channels must be between 1 and 4"
                this.numChannels = numChannels;
                return this;
            }
    
    
            build(onLoad: (texture: Texture) => void){
                let builder = this;

                if( this.imagePath !== null ) {
                // Build from image source
                    let image = <HTMLImageElement> document.createElement('img');
                    image.crossOrigin = 'anonymous';
                    image.onload = function () {
                        onLoad(new Texture(builder.gl, builder.buildTexture(image)));
                    };
                    image.src = this.imagePath;

                }else{
                // Build from raw data
                    onLoad(new Texture(builder.gl, builder.buildTexture()));
                }  
            }


            private buildTexture(image: HTMLImageElement = null) {
                let gl = this.gl;

                let currentTexture = <WebGLTexture> gl.getParameter(gl.TEXTURE_BINDING_2D);

                // Adding texture
                let texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture); 

                if( image !== null )
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                else
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minificationFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magnificationFilter);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);

                // Generate mipmaps
                if( this.minificationFilter === gl.LINEAR_MIPMAP_LINEAR ||
                    this.minificationFilter === gl.LINEAR_MIPMAP_NEAREST ||
                    this.minificationFilter === gl.NEAREST_MIPMAP_LINEAR ||
                    this.minificationFilter === gl.NEAREST_MIPMAP_NEAREST
                )
                    gl.generateMipmap(gl.TEXTURE_2D);   

                // Rebind old texture
                gl.bindTexture(gl.TEXTURE_2D, currentTexture);
                
                return texture;
            }
        

        
        }       
    }


    // groundRenderer = null;
    // {
    //     let image = <HTMLImageElement> document.createElement('img');
    //     image.crossOrigin = 'anonymous';
    //     image.onload = function () {
    //         // Adding texture
    //         let texture = gl.createTexture();
    //         gl.activeTexture(gl.TEXTURE0);
    //         gl.bindTexture(gl.TEXTURE_2D, texture); 
    
    //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    //         gl.generateMipmap(gl.TEXTURE_2D);

    //     groundRenderer = new GroundRenderer(gl, texture, 300, 300);
            
    //     };
    //     image.src = '../generic/xamp23.png';
    

}