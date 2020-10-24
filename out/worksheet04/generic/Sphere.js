var Sheet4;
(function (Sheet4) {
    class Sphere {
        /**
         *
         * @param color If the color is null (default value) the circle's triangles will be colored based on their surface normals
         */
        constructor(pos, size, subdivisionLevel, color = null) {
            this.vertices = null;
            this.dirty = true;
            this.position = pos;
            this.size = size;
            // @ts-ignore
            this.color = color == null ? null : vec4(color);
            this.subdivisionLevel = subdivisionLevel;
            this.setupVertices();
        }
        setSize(size) {
            this.size = size;
            this.dirty = true;
        }
        setPosition(x, y, z) {
            this.position = [x, y, z];
            this.dirty = true;
        }
        getModelMatrix() {
            if (this.dirty) {
                this.modelMatrix = Util.createModelMatrix(this.position, [this.size, this.size, this.size], [0, 0, 0]);
                this.dirty = true;
            }
            return this.modelMatrix;
        }
        getVertices() {
            this.setupVertices();
            return this.vertices;
        }
        setupVertices() {
            if (this.vertices != null)
                return;
            // Build base Tetrahedon
            let sqrt2 = Math.sqrt(2) / 3;
            let sqrt6 = Math.sqrt(6) / 3;
            // The 4 vertices of the Tetrahedon
            var baseVertices = [
                // @ts-ignore
                vec3(0, 0, 1),
                // @ts-ignore
                vec3(0, 2 * sqrt2, -1 / 3),
                // @ts-ignore
                vec3(-sqrt6, -sqrt2, -1 / 3),
                // @ts-ignore
                vec3(sqrt6, -sqrt2, -1 / 3)
            ];
            // Constructing 4 triangles from base vertices
            var currentVertices = [
                baseVertices[0], baseVertices[1], baseVertices[2],
                baseVertices[0], baseVertices[3], baseVertices[1],
                baseVertices[0], baseVertices[2], baseVertices[3],
                baseVertices[1], baseVertices[3], baseVertices[2],
            ];
            // Subdivide
            for (var i = 0; i < this.subdivisionLevel; i++) {
                var newVertices = [];
                // For each triangle...
                for (var triangleIndex = 0; triangleIndex < currentVertices.length; triangleIndex += 3) {
                    var currentVertex1 = currentVertices[triangleIndex + 0];
                    var currentVertex2 = currentVertices[triangleIndex + 1];
                    var currentVertex3 = currentVertices[triangleIndex + 2];
                    //@ts-ignore
                    var newVertex1 = normalize(scale(0.5, add(currentVertex1, currentVertex2)));
                    //@ts-ignore
                    var newVertex2 = normalize(scale(0.5, add(currentVertex2, currentVertex3)));
                    //@ts-ignore
                    var newVertex3 = normalize(scale(0.5, add(currentVertex3, currentVertex1)));
                    // Insert new triangles into new array
                    newVertices.push(currentVertex1, newVertex1, newVertex3, newVertex1, currentVertex2, newVertex2, newVertex3, newVertex2, currentVertex3, newVertex1, newVertex2, newVertex3);
                }
                currentVertices = newVertices;
            }
            // Add Colors
            var coloredVertices = [];
            // For each triangle...
            for (var triangleIndex = 0; triangleIndex < currentVertices.length; triangleIndex += 3) {
                let vertex1 = currentVertices[triangleIndex + 0];
                let vertex2 = currentVertices[triangleIndex + 1];
                let vertex3 = currentVertices[triangleIndex + 2];
                var triangleColor = this.color;
                if (triangleColor == null) {
                    // This color calculation is damn slow
                    // Build color as the surface normal of the triangle
                    // @ts-ignore
                    let edge1 = subtract(vertex2, vertex1);
                    // @ts-ignore
                    let edge2 = subtract(vertex3, vertex1);
                    // @ts-ignore
                    triangleColor = scale(0.5, add(vec4(1.0, 1.0, 1.0, 1.0), vec4(normalize(cross(edge1, edge2)))));
                }
                coloredVertices.push(vertex1, triangleColor, vertex2, triangleColor, vertex3, triangleColor);
            }
            var vertexList = new Util.FloatArrayList();
            vertexList.push(coloredVertices);
            vertexList.compress();
            this.vertices = vertexList.getData();
            console.log(this.vertices.byteLength);
        }
    }
    Sheet4.Sphere = Sphere;
})(Sheet4 || (Sheet4 = {}));
