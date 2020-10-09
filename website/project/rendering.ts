
namespace Project.Rendering {

    declare var gl;
    declare var shader;
    
    declare var vertexBuffer: VertexBuffer;
    declare var viewProjectionMatrix: Float32Array;

    export function initialize(glContext){
        gl = glContext;

        vertexBuffer = new VertexBuffer(gl, 1000);
        vertexBuffer.addAttribute("a_Position", 3);
        vertexBuffer.addAttribute("a_Color", 4);

        // @ts-ignore
        shader = initShaders(gl, "vertex.shader", "fragment.shader");

        // @ts-ignore
        viewProjectionMatrix = flatten( mult(ortho(-360, 360, -240, 240, 0,  5000), lookAt(vec3(0,0,0), vec3(0,0,1), vec3(0, 1, 0))));
    }


    

    function renderOpaque(){

    }


    function renderTransparent(){

    }


    function flush(){

    }


    export function drawSquares(squares: Square[]){
        gl.useProgram(shader);


        vertexBuffer.clear();
        squares.forEach(square => {
            if( !square.isTransparent() )
                vertexBuffer.push(square.getVertices());
        });

        
        var uViewProjection = gl.getUniformLocation(shader, "u_ViewProjection");
        gl.uniformMatrix4fv(uViewProjection, false, viewProjectionMatrix);

        vertexBuffer.bind(shader);
        gl.drawArrays(gl.TRIANGLES, 0, squares.length * 6);
    }
    

}