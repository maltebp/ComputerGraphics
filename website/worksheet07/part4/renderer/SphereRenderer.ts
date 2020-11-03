

namespace Sheet7.Part4 {

    export class SphereRenderer {

        private gl: WebGLRenderingContext;
        private vertexBuffer: Util.VertexBuffer;
        private backgroundVertices: Util.VertexBuffer;
        private shader: Util.ShaderProgram;

        private sphere: Sphere = null;
        
        constructor(gl){
            if( gl == null )
                throw "GL context cannot be null";
    
            this.gl = gl;
    
            this.vertexBuffer = new Util.VertexBuffer(gl, 50000);
            this.vertexBuffer.addAttribute("a_Position", 3);

            this.backgroundVertices = new Util.VertexBuffer(gl);
            this.backgroundVertices.addAttribute("a_Position", 3);

            this.backgroundVertices.push(
                -1,  1, -0.999,
                -1, -1, -0.999,
                 1, -1, -0.999,
                -1,  1, -0.999,
                 1, -1, -0.999,
                 1,  1, -0.999,
            );

            this.shader = new Util.ShaderProgram(gl, "renderer/vertex.glsl", "renderer/fragment.glsl");
        }



        setSphere(sphere: Sphere){
            this.sphere = sphere;
            this.vertexBuffer.clear();
            this.vertexBuffer.push(sphere.getVertices());
        }
    
    
        draw(camera: Util.Camera){
            this.shader.bind();
            this.shader.setInteger("u_TextureSampler", 0);
            this.shader.setInteger("u_NormalMap", 1);

            this.drawBackground(camera);

            this.shader.setInteger("u_Reflection", 1);
            this.shader.setFloatVector3("u_ViewPosition", (<Util.OrbitalCamera>camera).getPosition());
            
            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());
            this.shader.setFloatMatrix4("u_Model", this.sphere.getModelMatrix());

            // @ts-ignore
            this.shader.setFloatMatrix4("u_TextureMatrix", flatten(mat4()));

            this.vertexBuffer.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }


        private drawBackground(camera: Util.Camera){

            this.gl.depthMask(false);

            this.shader.setInteger("u_Reflection", 0);

            // @ts-ignore
            this.shader.setFloatMatrix4("u_ViewProjection", flatten(mat4()));

            // @ts-ignore
            this.shader.setFloatMatrix4("u_Model", flatten(mat4()));

            // @ts-ignore
            let reversedViewMatrix = inverse4(camera.getViewMatrix());

            // @ts-ignore
            reversedViewMatrix = mat4(
                reversedViewMatrix[0][0], reversedViewMatrix[0][1], reversedViewMatrix[0][2], 0,
                reversedViewMatrix[1][0], reversedViewMatrix[1][1], reversedViewMatrix[1][2], 0,
                reversedViewMatrix[2][0], reversedViewMatrix[2][1], reversedViewMatrix[2][2], 0,
                               0,                0,                0,                         0,
            );

            // @ts-ignore
            let textureMatrix = mult(
                reversedViewMatrix,
                // @ts-ignore
                inverse4(camera.getProjectionMatrix())
            );

            // @ts-ignore
            this.shader.setFloatMatrix4("u_TextureMatrix", flatten(textureMatrix));


            this.backgroundVertices.bind();
    
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

            this.gl.depthMask(true);

        }
    }
}
