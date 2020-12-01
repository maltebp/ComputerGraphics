

namespace Sheet8.Part2 {

    export class QuadRenderer {

        private gl: WebGLRenderingContext;
        private shader: Util.ShaderProgram;
        private pointLight: Util.PointLight;

        private vertexBuffer: Util.VertexBuffer;

        private groundPlaneBuffer: Util.VertexBuffer;

        constructor(gl: WebGLRenderingContext, pointLight: Util.PointLight){
            this.gl = gl;
            this.pointLight = pointLight;
    
            this.groundPlaneBuffer = new Util.VertexBuffer(gl, 100);
            this.groundPlaneBuffer.addAttribute("a_Position", 3);
            this.groundPlaneBuffer.addAttribute("a_TextureCoordinates", 2);
            this.groundPlaneBuffer.addAttribute("a_TextureIndex", 1);

            this.vertexBuffer = new Util.VertexBuffer(gl, 1000);
            this.vertexBuffer.addAttribute("a_Position", 3);
            this.vertexBuffer.addAttribute("a_TextureCoordinates", 2);
            this.vertexBuffer.addAttribute("a_TextureIndex", 1);            

            this.shader = new Util.ShaderProgram(gl, "vertex.glsl", "fragment.glsl");
        }


        setGroundPlane(quad: Quad){
            this.groundPlaneBuffer.clear();
            this.groundPlaneBuffer.push(quad.getVertices());
        }

        addQuad(quad: Quad){
            this.vertexBuffer.push(quad.getVertices());
        }   

    
        draw(camera: Util.Camera){
            this.shader.bind();

            // Set texture samplers
            this.shader.setInteger("u_TextureSampler0", 0);
            this.shader.setInteger("u_TextureSampler1", 1);

            this.shader.setFloatMatrix4("u_ViewProjection", camera.getViewProjectionMatrix());

            // Draw the ground
            // @ts-ignore
            let model = mat4();
            this.shader.setFloatMatrix4("u_Model", model);        
            this.groundPlaneBuffer.bind();
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.groundPlaneBuffer.getNumVertices());
            
            this.vertexBuffer.bind();

            // Render shadows
            let lightPosition = this.pointLight.getPosition();
            
            // @ts-ignore
            let modelLight = mat4();
            let d = -lightPosition[1];
            modelLight[3][1] = 1/d;
            modelLight[3][3] = 0;

            // @ts-ignore
            let translation = translate(-lightPosition[0], -lightPosition[1], -lightPosition[2]);

            // @ts-ignore
            let translationBack = translate(lightPosition[0], lightPosition[1], lightPosition[2]);

            // @ts-ignore
            let shadow = mult(translationBack, mult(modelLight, mult(translation, model)));

            this.shader.setFloatMatrix4("u_Model", shadow);        
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());                
        
            // Render objects
            this.shader.setFloatMatrix4("u_Model", model);        
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.getNumVertices());
        }

        
    }
}
