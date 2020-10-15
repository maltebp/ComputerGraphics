

namespace Sheet4.Part4 {

    export class SphereRenderer {

        private gl;
        private vertexBuffer: VertexBuffer;
        private shader: Util.ShaderProgram;

        private lightDirection: number[] = null;
        private lightColor: number[] = null;

        private ambientColor: number[] = [0.20,0.20,0.20];

        private sphere: Sphere = null;

        private materialDiffuse: number = 0.5;
        private materialSpecular: number = 0.5;
        private materialAmbient: number = 0.5;
        private materialShine: number = 100;

        
        constructor(gl){
            if( gl == null )
                throw "GL context cannot be null";
    
            this.gl = gl;
    
            this.vertexBuffer = new VertexBuffer(gl, 50000);
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


        setMaterial(ambient: number, diffuse: number, specular: number, shine: number){
            this.materialAmbient = ambient;
            this.materialDiffuse = diffuse;
            this.materialSpecular = specular;
            this.materialShine = shine;
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

            if( this.lightDirection != null ){
                this.shader.setFloatVector3("u_LightDirection", this.lightDirection);
                this.shader.setFloatVector3("u_LightEmission", this.lightColor);
            }
            this.shader.setFloatVector3("u_AmbientEmission", this.ambientColor);
            this.shader.setFloatVector3("u_CameraPos", camera.getPosition());

            this.shader.setFloat("u_MaterialDiffuse", this.materialDiffuse);
            this.shader.setFloat("u_MaterialAmbient", this.materialAmbient);
            this.shader.setFloat("u_MaterialSpecular", this.materialSpecular);
            this.shader.setFloat("u_MaterialPhongExponent", this.materialShine);

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }
    }
}
