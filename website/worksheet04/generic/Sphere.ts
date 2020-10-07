
namespace Sheet4 {

    export class Sphere {

        private position: number[];
        private size: number;
        private subdivisionLevel: number;

        private vertices: Float32Array = null;

        //@ts-ignore
        private modelMatrix: number [] = mat4();
        private dirty: boolean = true;
        

        constructor(pos: number[], size: number, subdivisionLevel: number){
            this.position = pos;
            this.size = size;
            this.subdivisionLevel = subdivisionLevel;
        }

        setSize(size: number){
            this.size = size;
            this.dirty = true;
        }

        setPosition(x: number, y: number, z: number ){
            this.position = [x, y, z];
            this.dirty = true;
        }

        setSubdivisions(numSubdivisions: number){
            this.subdivisionLevel = numSubdivisions;
            this.vertices = null;
        }

        
        getModelMatrix(){
            if( this.dirty ){
                //@ts-ignore
                this.modelMatrix = mult(translate(this.position), scalem(this.size, this.size, this.size));  
                this.dirty = true;
            }   
            return this.modelMatrix;              
        }


        getVertices(){
            this.setupVertices();
            return this.vertices;
        }



        private setupVertices(){
            if( this.vertices != null ) return;

            // Build base Tetrahedon
            let sqrt2 = Math.sqrt(2)/3;
            let sqrt6 = Math.sqrt(6)/3;
            // The 4 vertices of the Tetrahedon
            var baseVertices = [
                // @ts-ignore
                vec3(0, 0, 1),
                // @ts-ignore
                vec3(0, 2*sqrt2, -1/3),
                // @ts-ignore
                vec3(-sqrt6, -sqrt2, -1/3),
                // @ts-ignore
                vec3(sqrt6, -sqrt2, -1/3)    
            ];

            // Constructing 4 triangles from base vertices
            var currentVertices = [
                baseVertices[0], baseVertices[1], baseVertices[2],
                baseVertices[0], baseVertices[3], baseVertices[1],
                baseVertices[0], baseVertices[2], baseVertices[3],
                baseVertices[1], baseVertices[3], baseVertices[2],
            ]            

            // Subdivide
            for( var i=0; i<this.subdivisionLevel; i++ ){
                
                var newVertices = [];

                // For each triangle...
                for( var triangleIndex=0; triangleIndex < currentVertices.length; triangleIndex += 3 ){
                    
                    var currentVertex1 = currentVertices[triangleIndex+0]; 
                    var currentVertex2 = currentVertices[triangleIndex+1]; 
                    var currentVertex3 = currentVertices[triangleIndex+2]; 

                    //@ts-ignore
                    var newVertex1 = normalize(scale(0.5, add(currentVertex1, currentVertex2)));
                     //@ts-ignore
                    var newVertex2 = normalize(scale(0.5, add(currentVertex2, currentVertex3)));
                     //@ts-ignore
                    var newVertex3 = normalize(scale(0.5, add(currentVertex3, currentVertex1)));

                    // Insert new triangles into new array
                    newVertices.push(
                        currentVertex1, newVertex1, newVertex3,
                        newVertex1, currentVertex2, newVertex2,
                        newVertex3, newVertex2, currentVertex3,
                        newVertex1, newVertex2, newVertex3
                    );
                }

                currentVertices = newVertices;
            }


            // Add Colors
            var coloredVertices = [];

            // For each triangle...
            for( var triangleIndex=0; triangleIndex < currentVertices.length; triangleIndex += 3 ){
                    
                let vertex1 = currentVertices[triangleIndex+0]; 
                let vertex2 = currentVertices[triangleIndex+1]; 
                let vertex3 = currentVertices[triangleIndex+2]; 
                
                // Build color as the surface normal of the triangle
                // @ts-ignore
                let edge1 = subtract(vertex2, vertex1);
                // @ts-ignore
                let edge2 = subtract(vertex3, vertex1);
                // @ts-ignore
                let triangleColor = scale(0.5, add(vec4(1.0, 1.0, 1.0, 1.0), vec4( normalize( cross(edge1, edge2)))));
                 

                coloredVertices.push(
                    vertex1, triangleColor,
                    vertex2, triangleColor,
                    vertex3, triangleColor,
                )
                
                console.log(vertex1);
                console.log(vertex2);
                console.log(vertex3);
            }

            // @ts-ignore
            var vertexList = new FloatArrayList();
            vertexList.push(coloredVertices);
            vertexList.compress();
            this.vertices = vertexList.getData();
        }




        }


}