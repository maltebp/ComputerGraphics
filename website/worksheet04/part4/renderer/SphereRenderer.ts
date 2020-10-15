

namespace Sheet4.Part4 {

    export class SphereRenderer {

        private gl;
        private vertexBuffer: VertexBuffer;
        private shader: Util.ShaderProgram;

        private lightDirection: number[] = null;
        private lightColor: number[] = null;
        private ambientColor: number[] = [0.20,0.20,0.20];

        
        constructor(gl){
            if( gl == null )
                throw "GL context cannot be null";
    
            this.gl = gl;
    
            this.vertexBuffer = new VertexBuffer(gl, 256);
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
        
    
        draw(sphere: Sphere, camera: LookAtCamera){
            this.shader.bind();

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_Model", sphere.getModelMatrix());

            if( this.lightDirection != null ){
                this.shader.setFloatVector3("u_LightDirection", this.lightDirection);
                this.shader.setFloatVector3("u_LightEmission", this.lightColor);
            }
            this.shader.setFloatVector3("u_AmbientEmission", this.ambientColor);
            this.shader.setFloatVector3("u_CameraPos", camera.getPosition());

            
            let vertices = sphere.getVertices(); 

            this.vertexBuffer.clear();
            this.vertexBuffer.push(vertices);
            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }
}
