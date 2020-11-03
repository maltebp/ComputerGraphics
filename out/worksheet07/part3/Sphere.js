var Sheet7;
(function (Sheet7) {
    var Part3;
    (function (Part3) {
        class Sphere {
            /**
             *
             * @param color If the color is null (default value) the circle's triangles will be colored based on their surface normals
             */
            constructor(pos, size, subdivisionLevel, color = null) {
                this.vertices = null;
                this.dirty = true;
                this.rotationY = 0;
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
            rotateY(rotation) {
                this.rotationY = (this.rotationY + rotation) % 360;
                if (this.rotationY < 0)
                    this.rotationY + 360;
                this.dirty = true;
            }
            getModelMatrix() {
                if (this.dirty) {
                    this.modelMatrix = Util.createModelMatrix(this.position, [this.size, this.size, this.size], [0, this.rotationY, 0]);
                    this.dirty = false;
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
                var vertexList = new Util.FloatArrayList();
                vertexList.push(currentVertices);
                vertexList.compress();
                this.vertices = vertexList.getData();
                console.log(this.vertices.byteLength);
            }
        }
        Part3.Sphere = Sphere;
    })(Part3 = Sheet7.Part3 || (Sheet7.Part3 = {}));
})(Sheet7 || (Sheet7 = {}));
