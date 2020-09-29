
class Cube {

    private static vertices: Float32Array = null;
    private static indices: Uint16Array = null;
    private static wireframeIndices: Uint16Array = null;
    
    private position: Array<number> = [0, 0, 0];
    private size = 1.0;;

    // Yaw, pitch, roll?
    
    setSize(size: number){
        this.size = size;
    }

    setPosition(x: number, y: number, z: number ){
        this.position = [x, y, z];
    }

    getVertices(){
        Cube.setupVertices();
        return Cube.vertices;
    }

    getIndices(){
        Cube.setupVertices();
        return Cube.indices;
    }


    getWireframeIndices(){
        Cube.setupVertices();
        return Cube.wireframeIndices;
    }
    

    getModelMatrix(){
        // TODO: Create correct model matrix from size, rotation, etc
    }


    private static setupVertices(){
        if( Cube.vertices != null ) return;
        
        // // Vertex positions
        // Cube.vertices = new Float32Array([
        //     // Position         // Color
        //      0.0,  0.0,  0.0,   0, 0, 0, 1,
        //      0.0,  1.0,  0.0,   0, 0, 0, 1,
        //      1.0,  1.0,  0.0,   0, 0, 0, 1,
        //      1.0,  0.0,  0.0,   0, 0, 0, 1,
        //      0.0,  0.0,  1.0,   0, 0, 0, 1,
        //      0.0,  1.0,  1.0,   0, 0, 0, 1,
        //      1.0,  1.0,  1.0,   0, 0, 0, 1,
        //      1.0,  0.0,  1.0,   0, 0, 0, 1
        // ]);

        // Vertex positions
        Cube.vertices = new Float32Array([
            // Position         // Color
            -0.5, -0.5, -0.5,   0, 0, 0, 1,
            -0.5,  0.5, -0.5,   0, 0, 0, 1,
             0.5,  0.5, -0.5,   0, 0, 0, 1,
             0.5, -0.5, -0.5,   0, 0, 0, 1,
            -0.5, -0.5,  0.5,   0, 0, 0, 1,
            -0.5,  0.5,  0.5,   0, 0, 0, 1,
             0.5,  0.5,  0.5,   0, 0, 0, 1,
             0.5, -0.5,  0.5,   0, 0, 0, 1
        ]);
    
        
        // TODO: Implement in part 2
        Cube.indices = new Uint16Array([
            
        ]);

        // Wireframe indices
        Cube.wireframeIndices = new Uint16Array([
            0,1, 1,2, 2,3, 3,0, // Front lines
            0,4, 1,5, 2,6, 3,7, // Middle lines
            4,5, 5,6, 6,7, 7,4  // Back lines
            // TODO: Add correct indices
        ]);
        
    }

}