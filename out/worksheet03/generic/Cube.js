class Cube {
    constructor() {
        this.position = [0, 0, 0];
        this.size = 1.0;
    }
    ;
    // Yaw, pitch, roll?
    setSize(size) {
        this.size = size;
    }
    setPosition(x, y, z) {
        this.position = [x, y, z];
    }
    getVertices() {
        Cube.setupVertices();
        return Cube.vertices;
    }
    getIndices() {
        Cube.setupVertices();
        return Cube.indices;
    }
    getWireframeIndices() {
        Cube.setupVertices();
        return Cube.wireframeIndices;
    }
    getModelMatrix() {
        // TODO: Create correct model matrix from size, rotation, etc
    }
    static setupVertices() {
        if (Cube.vertices != null)
            return;
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
            -0.5, -0.5, -0.5, 0, 0, 0, 1,
            -0.5, 0.5, -0.5, 0, 0, 0, 1,
            0.5, 0.5, -0.5, 0, 0, 0, 1,
            0.5, -0.5, -0.5, 0, 0, 0, 1,
            -0.5, -0.5, 0.5, 0, 0, 0, 1,
            -0.5, 0.5, 0.5, 0, 0, 0, 1,
            0.5, 0.5, 0.5, 0, 0, 0, 1,
            0.5, -0.5, 0.5, 0, 0, 0, 1
        ]);
        // TODO: Implement in part 2
        Cube.indices = new Uint16Array([]);
        // Wireframe indices
        Cube.wireframeIndices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0,
            0, 4, 1, 5, 2, 6, 3, 7,
            4, 5, 5, 6, 6, 7, 7, 4 // Back lines
            // TODO: Add correct indices
        ]);
    }
}
Cube.vertices = null;
Cube.indices = null;
Cube.wireframeIndices = null;
