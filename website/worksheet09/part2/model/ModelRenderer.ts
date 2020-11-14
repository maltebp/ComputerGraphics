

namespace Sheet9.Part2 {

    export class ModelRenderer {
        private gl;
        private shader: Util.ShaderProgram;

        private lightPosition: number[] = null;
        private lightColor: number[] = null;

        private ambientColor: number[] = [0.20,0.20,0.20];

        private materialDiffuse: number = 0.5;
        private materialSpecular: number = 0.5;
        private materialAmbient: number = 0.5;
        private materialShine: number = 100;


        constructor(gl){
            if( gl == null )
                throw "GL context cannot be null";
    
            this.gl = gl;
            
            this.shader = new Util.ShaderProgram(gl, "model/vertex.glsl", "model/fragment.glsl");
        }

        
        setPointLight(position: number[], color: number[]) {
            this.lightPosition = position;
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

    
        draw(camera: Util.OrbitalCamera, model: Model){
            this.shader.bind();

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_Model", model.getModelMatrix());

            if( this.lightPosition != null ){
                this.shader.setFloatVector3("u_LightPosition", this.lightPosition);
                this.shader.setFloatVector3("u_LightEmission", this.lightColor);
            }
            this.shader.setFloatVector3("u_AmbientEmission", this.ambientColor);
            this.shader.setFloatVector3("u_CameraPos", camera.getPosition());

            this.shader.setFloat("u_MaterialDiffuse", this.materialDiffuse);
            this.shader.setFloat("u_MaterialAmbient", this.materialAmbient);
            this.shader.setFloat("u_MaterialSpecular", this.materialSpecular);
            this.shader.setFloat("u_MaterialPhongExponent", this.materialShine);

            model.getVertexBuffer().bind();
            model.getIndexBuffer().bind();

            this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().length(), this.gl.UNSIGNED_SHORT, 0);
        }
    }
}
