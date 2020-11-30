
namespace Sheet1.Part2 {
    
    export function start(){
        let gl = Util.appendGLCanvas("container", 512, 512);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT);

        let shader = new Util.ShaderProgram(gl, "vert.shader", "frag.shader");
        shader.bind();        
    
        let vertexBuffer = new Util.VertexBuffer(gl);
        vertexBuffer.addAttribute("a_Position", 2);
        vertexBuffer.push(
            // Pos
            -0.5, -0.5,
             0.5,  0.5,
             0.5, -0.5,
            -0.5,  0.5
        );
        vertexBuffer.bind();
    
        gl.drawArrays(gl.POINTS, 0, vertexBuffer.getNumVertices());
    }

}

Sheet1.Part2.start();





