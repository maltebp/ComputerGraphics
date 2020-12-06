namespace Util {

    /**
     *  Class wrapping an WebGL texture, and providing a simpler method for creating
     *  such textures using a builder pattern.
     */
    export class Texture {
        private gl: WebGLRenderingContext;
        private texture: WebGLTexture;
        private width: number;
        private height: number;

        private constructor(gl: WebGLRenderingContext, texture: WebGLTexture, width: number, height: number) {
            this.gl = gl;
            this.texture = texture;
            this.width = width;
            this.height = height;
        }


        getWidth() {
            return this.width;
        }

        getHeight() {
            return this.height;
        }


        getGLTexture() {
            return this.texture;
        }


        bind(slot: number) {
            let currentSlot = this.gl.getParameter(this.gl.ACTIVE_TEXTURE);
            this.gl.activeTexture(this.gl.TEXTURE0 + slot);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);     
            this.gl.activeTexture(currentSlot);   
        }

    
        setWrap(wrapS: number, wrapT: number) {
            let gl = this.gl;
            this.update(() => {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
            });
        }


        setFilter(minification: number, magnification: number) {
            this.setMinificationFilter(minification);
            this.setMagnificationFilter(magnification);
        }

        setMinificationFilter(filter: number) {
            let gl = this.gl;
            this.update(() => {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
            });
        }

        setMagnificationFilter(filter: number) {
            let gl = this.gl;
            this.update(() => {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            });
        }


        // Utility method, which binds the texture, runs the update callback
        // and rebinds the previous texture
        private update(callback: () => void) {
            let currentTexture = <WebGLTexture> gl.getParameter(gl.TEXTURE_BINDING_2D);
            gl.bindTexture(gl.TEXTURE_2D, this.texture); 
            callback();
            gl.bindTexture(gl.TEXTURE_2D, currentTexture);        
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
            private generateMipmaps = false;

    
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

            loadMipmaps() {
                this.generateMipmaps = true;
                return this;
            }
    
    
            build(onLoad: (texture: Texture) => void){
                let builder = this;

                if( this.imagePath !== null ) {
                // Build from image source
                    let _this = this;
                    let image = <HTMLImageElement> document.createElement('img');
                    image.crossOrigin = 'anonymous';
                    image.onload = function () {
                        onLoad(new Texture(builder.gl, builder.buildTexture(image), _this.width, _this.height));
                    };
                    image.src = this.imagePath;

                }else{
                // Build from raw data
                    onLoad(new Texture(builder.gl, builder.buildTexture(), this.width, this.height));
                }  
            }


            private buildTexture(image: HTMLImageElement = null) {
                let gl = this.gl;

                let currentTexture = <WebGLTexture> gl.getParameter(gl.TEXTURE_BINDING_2D);

                // Adding texture
                let texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture); 

                let format;
                if( this.numChannels == 3 ) format = gl.RGB;
                else if( this.numChannels == 4 ) format = gl.RGBA;
                else throw "Texture channel format is not support: " + this.numChannels;

                if( image !== null )
                    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, image);
                else
                    gl.texImage2D(gl.TEXTURE_2D, 0, format, this.width, this.height, 0, format, gl.UNSIGNED_BYTE, this.imageData);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minificationFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magnificationFilter);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);

                // Generate mipmaps
                if( this.generateMipmaps ||
                    this.minificationFilter === gl.LINEAR_MIPMAP_LINEAR ||
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

}