var Project;
(function (Project) {
    class Square {
        constructor(x, y, z, size, color) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.size = size;
            this.color = color;
            this.setupVertices();
        }
        setupVertices() {
            var halfSize = this.size / 2.0;
            this.vertices = [
                this.x - halfSize, this.y + halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x - halfSize, this.y - halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x + halfSize, this.y - halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x - halfSize, this.y + halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x + halfSize, this.y - halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x + halfSize, this.y + halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
            ];
        }
        getVertices() {
            return this.vertices;
        }
        getColor() {
            return this.color;
        }
        isTransparent() {
            return this.color[3] < 1.0;
        }
    }
    Project.Square = Square;
})(Project || (Project = {}));
