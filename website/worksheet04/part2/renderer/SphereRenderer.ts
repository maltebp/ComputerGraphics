

namespace Sheet4.Part2 {

    export class SphereRenderer {

        private gl;
        private vertexBuffer: Util.VertexBuffer;
        private shader: Util.ShaderProgram;

        private sphere: Sphere = null;
        
        constructor(gl){
            if( gl == null )
                throw "GL context cannot be null";
    
            this.gl = gl;
    
            this.vertexBuffer = new Util.VertexBuffer(gl, 50000);
            this.vertexBuffer.addAttribute("a_Position", 3);
            this.vertexBuffer.addAttribute("a_Color", 4);
        
            this.shader = new Util.ShaderProgram(gl, "renderer/vertex.glsl", "renderer/fragment.glsl");
        }


        setSphere(sphere: Sphere){
            this.sphere = sphere;
            this.vertexBuffer.clear();
            this.vertexBuffer.push(sphere.getVertices());
        }
        
    
        draw(camera: LookAtCamera){
            this.shader.bind();

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_Model", this.sphere.getModelMatrix());

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }
}
