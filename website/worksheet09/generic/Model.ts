
namespace Sheet9 {


    export class Model {

        private vertexBuffer: Util.VertexBuffer;
        private indexBuffer: Util.IndexBuffer;
        
        private position: number[];
        private size: number;

        private modelMatrix: number [] = [];
        private dirty: boolean = true;
                
        private numVertices: number = 0;

        constructor(gl, obj, position: number[], size: number){
            this.position = position;
            this.size = size;
            
            gl;

            var drawInfo = obj.getDrawingInfo();
            this.numVertices = drawInfo.vertices.length / 3;
            
            // Move data to my own buffers (makes it easier to work with)
            this.vertexBuffer = new Util.VertexBuffer(gl, this.numVertices*(3+3+4));
            this.vertexBuffer.addAttribute("a_Position", 3);
            this.vertexBuffer.addAttribute("a_Normal", 3);
            this.vertexBuffer.addAttribute("a_Color", 4);

            for( var i=0;  i < this.numVertices; i++ ){
                this.vertexBuffer.push(
                    drawInfo.vertices[i*3 + 0],
                    drawInfo.vertices[i*3 + 1],
                    drawInfo.vertices[i*3 + 2],

                    drawInfo.normals[i*3 + 0],
                    drawInfo.normals[i*3 + 1],
                    drawInfo.normals[i*3 + 2],

                    drawInfo.colors[i*4 + 0],
                    drawInfo.colors[i*4 + 1],
                    drawInfo.colors[i*4 + 2],
                    drawInfo.colors[i*4 + 3],
                );
            }

            // Move indices
            this.indexBuffer = new Util.IndexBuffer(gl, drawInfo.indices.length);
            this.indexBuffer.push(drawInfo.indices);
        }

        setSize(size: number){
            this.size = size;
            this.dirty = true;
        }

        setPosition(x: number, y: number, z: number ){
            this.position = [x, y, z];
            this.dirty = true;
        }
        
        getModelMatrix(){
            if( this.dirty ){
                //@ts-ignore
                this.modelMatrix = mult(translate(this.position), scalem(this.size, this.size, this.size));  
                this.dirty = true;
            }   
            return this.modelMatrix;              
        }


        getVertexBuffer() {
            return this.vertexBuffer;
        }

        getIndexBuffer() {
            return this.indexBuffer;
        }


    }

}