namespace Project {

    export class Square {
        
        private x: number;
        private y: number;
        private z: number;
        private size: number;
        private color: number[]
        private vertices: number[];

        constructor(x: number, y: number, z: number, size: number, color: number[]){
            this.x = x; 
            this.y = y;
            this.z = z;
            this.size = size;
            this.color = color;

            this.setupVertices();
        }




        private setupVertices(){
            var halfSize = this.size/2.0;
            this.vertices = [
                this.x-halfSize, this.y+halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x-halfSize, this.y-halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x+halfSize, this.y-halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],

                this.x-halfSize, this.y+halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x+halfSize, this.y-halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
                this.x+halfSize, this.y+halfSize, this.z, this.color[0], this.color[1], this.color[2], this.color[3],
            ];
        }

        


        getVertices() {
            return this.vertices;
        }

        getColor() {
            return this.color;
        }

        isTransparent(){
            return this.color[3] < 1.0;
        }



    }

}