
class Cube {

    private static vertices: Float32Array = null;
    private static wireframeIndices: Uint16Array = null;
    
    //@ts-ignore
    private modelMatrix: number [] = mat4();
    private dirty: boolean = true;

    private position: Array<number> = [0, 0, 0];
    private size = 1.0;;

    // Yaw, pitch, roll?
    
    setSize(size: number){
        this.size = size;
        this.dirty = true;
    }

    setPosition(x: number, y: number, z: number ){
        this.position = [x, y, z];
        this.dirty = true;
    }

    getVertices(){
        Cube.setupVertices();
        return Cube.vertices;
    }

    getWireframeIndices(){
        Cube.setupVertices();
        return Cube.wireframeIndices;
    }
    

    getModelMatrix(){
        if( this.dirty ){
            //@ts-ignore
            this.modelMatrix = mult(translate(this.position), scalem(this.size, this.size, this.size));  
            this.dirty = true;
        }   
        return this.modelMatrix;              
    }


    private static setupVertices(){
        if( Cube.vertices != null ) return;

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
       
        // Wireframe indices
        Cube.wireframeIndices = new Uint16Array([
            0,1, 1,2, 2,3, 3,0, // Front lines
            0,4, 1,5, 2,6, 3,7, // Middle lines
            4,5, 5,6, 6,7, 7,4  // Back lines
        ]);
    }

}