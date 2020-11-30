
namespace Sheet1.Part4 {

    declare var gl: WebGLRenderingContext;
    declare var shader: Util.ShaderProgram;
    declare var vertexBuffer: Util.VertexBuffer;
    declare var rotation;


    function setup() {
        rotation = 0;

        gl = Util.appendGLCanvas("container", 512, 512);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT);

        shader = new Util.ShaderProgram(gl, "vert.shader", "frag.shader");
        shader.bind();        
            
        vertexBuffer = new Util.VertexBuffer(gl);
        vertexBuffer.addAttribute("a_Position", 2);
        vertexBuffer.addAttribute("a_Color", 3);
        vertexBuffer.push(
            -0.5,   0.5,   1.0, 0.0, 0.0,
             0.5, 0.5,    0.0, 1.0, 0.0,
            -0.5,  -0.5,   0.0, 0.0, 1.0,
            -0.5, -0.5,  0.0, 0.0, 1.0,
            0.5, 0.5,  0.0, 1.0, 0.0,
            0.5, -0.5,  1.0, 0.0, 0.0
        );
        vertexBuffer.bind();
    
        gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.getNumVertices());
    }
    

    function update() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        // Perform transform
        rotation += 0.01; //Math.PI/2.0;
        var transform = new Float32Array([
            Math.cos(rotation), Math.sin(rotation),
            -Math.sin(rotation), Math.cos(rotation)
        ]);
    
        shader.setFloatMatrix2("u_Transform", transform);
    
        gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.getNumVertices());
    
        requestAnimationFrame(update);
    }

    export function start(){
        setup();
        update();
    }

}

Sheet1.Part4.start();
