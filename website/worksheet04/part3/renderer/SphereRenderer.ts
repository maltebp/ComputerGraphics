

namespace Sheet4.Part3 {

    export class SphereRenderer {

        private gl;
        private vertexBuffer: Util.VertexBuffer;
        private shader: Util.ShaderProgram;

        private lightDirection: number[] = null;
        private lightColor: number[] = null;

        private ambientColor: number[] = [0.20,0.20,0.20];

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


        setDirectionalLight(direction: number[], color: number[] ){
            this.lightDirection = direction;
            this.lightColor = color;
        }


        setAmbientColor( color: number[] ){
            this.ambientColor = color;
        }


        setSphere(sphere: Sphere){
            this.sphere = sphere;
            this.vertexBuffer.clear();
            this.vertexBuffer.push(sphere.getVertices());
        }
        
    
        draw(camera: Util.Camera){
            this.shader.bind();

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_Model", this.sphere.getModelMatrix());

            if( this.lightDirection != null ){
                this.shader.setFloatVector3("u_LightDirection", this.lightDirection);
                this.shader.setFloatVector3("u_LightEmission", this.lightColor);
            }
            this.shader.setFloatVector3("u_AmbientEmission", this.ambientColor);

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }
}
