
namespace Util {

    /**
     * Represents a point light with a position and a color, and exposes
     * some methods to manipulate this light easily
     */
    export class PointLight {

        private position: number[];
        private color: Util.Color;


        constructor(position: number[], color: Color) {
            this.position = [position[0], position[1], position[2]];
            this.color = color.copy();
        }


        setY(y: number) {
            this.position[1] = y;
        }


        setColor(color: Util.Color) {
            this.color = color.copy(); 
        }


        /**
         * Rotates light's position around the Y-axis with given coordinate as origin
         *
         * @param origin    Origin of rotation
         * @param rotation  Degrees to rotate
         */
        rotateY(origin: number[], rotation: number) {
            // @ts-ignore
            let translated = subtract(this.position, origin);
            
            // @ts-ignore
            let rotated = vec3(mult(rotateY(rotation), vec4(translated, 1.0)));

            // @ts-ignore
            this.position = add(rotated, origin);
        }


        getPosition() {
            return [this.position[0], this.position[1], this.position[2]];
        }


        getColor() {
            return this.color.copy();
        }

    }



    /**
     * Renderer, which renders a PointLight object by drawing a white light texture
     * as a billboard, colored with the color of the light.
     */
    export class PointLightRenderer {

        private gl;
        private vertexBuffer: Util.VertexBuffer;
        private shader: Util.ShaderProgram;
        private texture: WebGLTexture = null;
        
        constructor(gl: WebGLRenderingContext, utilityPath: string){    
            this.gl = gl;
    
            // Quad vertices
            this.vertexBuffer = new Util.VertexBuffer(gl, 50);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.vertexBuffer.addAttribute("a_TextureCoordinates", 2);
            this.vertexBuffer.push(
                -0.5, -0.5,     0.0, 0.0,
                 0.5,  0.5,     1.0, 1.0,
                -0.5,  0.5,     0.0, 1.0,
                -0.5, -0.5,     0.0, 0.0,
                 0.5, -0.5,     1.0, 0.0,
                 0.5,  0.5,     1.0, 1.0
            );
        
            this.shader = new Util.ShaderProgram(gl, utilityPath+"utility/pointlight/vertex.glsl", utilityPath+"utility/pointlight/fragment.glsl");

            
            // Loading light texture
            {
                let _this = this;
                let image = <HTMLImageElement> document.createElement('img');
                image.crossOrigin = 'anonymous';
                image.onload = function () {
                    // Adding texture
                    _this.texture = gl.createTexture();
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, _this.texture); 
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        
                };
                image.src = utilityPath+"utility/pointlight/light.png";
            }    
        }
    
        draw(camera: Util.Camera, light: PointLight, size: number){
            if( this.texture === null ) return;

            this.shader.bind();

            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

            // Bind texutre
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.shader.setInteger("u_Texture", 0);

            this.shader.setFloatMatrix4("u_View", camera.getViewMatrix());
            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatVector3("u_Color", light.getColor().asList(false) );
            this.shader.setFloatVector3("u_Position", light.getPosition());
            this.shader.setFloat("u_Size", size);

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }    

}