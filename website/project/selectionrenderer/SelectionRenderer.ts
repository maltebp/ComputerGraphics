
namespace Project {


    /**
     * Renders selection borders
     */
    export class SelectionRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private vertexBuffer: Util.VertexBuffer;

        constructor(gl: WebGLRenderingContext) {
            this.gl = gl;
            this.vertexBuffer = new Util.VertexBuffer(gl);
            this.vertexBuffer.addAttribute("a_Position", 2);
            this.shader = new Util.ShaderProgram(gl, "/project/selectionrenderer/vertex.glsl", "/project/selectionrenderer/fragment.glsl");          
        }
        

        /**
         * Renders a selection border for the given points in world coordinates,
         * and with the given color
         */
        draw( camera: Camera2D, points: number[][], color: Util.Color ) {
            this.vertexBuffer.clear();

            this.vertexBuffer.push(
                points[0],
                points[1],
                points[2],
                points[3]
            );

            this.shader.bind();
            this.shader.setFloatMatrix3("u_CameraMatrix", camera.getMatrix());
            this.shader.setFloatVector4("u_Color", color.asList(true));

            this.vertexBuffer.bind();

            this.gl.enable(gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

            this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.vertexBuffer.getNumVertices());

        }


    }



}