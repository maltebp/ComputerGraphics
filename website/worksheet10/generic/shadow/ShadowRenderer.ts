

namespace Sheet10 {


    export class ShadowRenderer {

        private gl: WebGLRenderingContext;

        private groundVertices: Util.VertexBuffer;
        private groundModelMatrix: Float32Array;

        private shader: Util.ShaderProgram;
        private framebuffer: ShadowMapBuffer;

        private drawing: boolean = false;

        constructor(gl: WebGLRenderingContext, groundWidth: number, groundLength: number) {    
            this.gl = gl;

            if( gl == null )
                throw "GL context cannot be null";

            { // Construct vertices
                this.groundVertices = new Util.VertexBuffer(gl);
                this.groundVertices.addAttribute("a_Position", 3);
                this.groundVertices.addAttribute("a_Normal", 3);
                this.groundVertices.addAttribute("a_Color", 4);

                let halfWidth = groundWidth/2.0;
                let halfHeight = groundLength/2.0;

                // Construct ground vertices
                this.groundVertices.push(
                    -halfWidth, 0, -halfHeight,      0, 1, 0,    1.0, 1.0, 1.0, 1.0,
                    -halfWidth, 0,  halfHeight,      0, 1, 0,    1.0, 1.0, 1.0, 1.0,
                     halfWidth, 0, -halfHeight,      0, 1, 0,    1.0, 1.0, 1.0, 1.0,

                    -halfWidth, 0,  halfHeight,      0, 1, 0,    1.0, 1.0, 1.0, 1.0,
                     halfWidth, 0,  halfHeight,      0, 1, 0,    1.0, 1.0, 1.0, 1.0,
                     halfWidth, 0, -halfHeight,      0, 1, 0,    1.0, 1.0, 1.0, 1.0,
                );

                // @ts-ignore
                this.groundModelMatrix = Util.toFloatArray(mat4());
            }

            this.framebuffer = new ShadowMapBuffer(gl, 1024, 1024);
            this.shader = new Util.ShaderProgram(gl, "/worksheet10/generic/shadow/vertex.glsl", "/worksheet10/generic/shadow/fragment.glsl");
        }
        

        startDraw(lightCamera: Util.Camera, textureSlot: number) {
            if( this.drawing ) throw "ShadowRenderer is already set to draw";
            this.drawing = true;
            
            this.framebuffer.bind(textureSlot);

            // Clear color must be all white (max value), as this means
            // the depth is 1.0 which furthest away
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0); 
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.disable(this.gl.BLEND);

            this.shader.bind();

            this.shader.setFloatMatrix4("u_ViewProjection", lightCamera.getViewProjectionMatrix());
        }

    
        drawModel(model: Model){
            if( !this.drawing ) throw "ShadowRenderer is not drawing";
            
            this.shader.setFloatMatrix4("u_Model", model.getModelMatrix());

            model.getVertexBuffer().bind();
            model.getIndexBuffer().bind();

            this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().length(), this.gl.UNSIGNED_SHORT, 0);
        }


        endDraw() {
            this.framebuffer.unbind();
            this.drawing = false;
        }


        bindShadowMap(textureSlot: number) {
            this.framebuffer.bindTexture(textureSlot);
        }


    }

}