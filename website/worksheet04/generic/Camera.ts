

namespace Sheet4 {
        

    /**
     * Abstract generic Camera class, defining methods to get View and Projection matrices
     */
    export abstract class Camera {

        protected dirty: boolean = true;
        protected viewMatrix: Float32Array = null;
        protected projectionMatrix: Float32Array = null;
        protected viewProjectionMatrix: Float32Array = null;
        protected screensize: number[] = null;

        protected abstract createViewMatrix();
        protected abstract createProjectionMatrix();


        private clean(){
            if( !this.dirty ) return;

            this.createViewMatrix();
            this.createProjectionMatrix();
            
            // @ts-ignore
            this.viewProjectionMatrix = mult(this.projectionMatrix, this.viewMatrix);

            this.dirty = false;
        }


        getViewProjectionMatrix(){
            this.clean();
            return this.viewProjectionMatrix;
        }

        getProjectionMatrix(){
            this.clean();
            return this.projectionMatrix;
        }


        getViewMatrix(){
            this.clean();
            return this.viewMatrix;
        }

    }



    export abstract class LookAtCamera extends Camera {
        private pos: number[] = [0, 0, 0];
        private target: number[] = [0, 0, 0];
        protected screensize: number[] = null;


        constructor(screenSize: number[], pos: number[], target: number[]){
            super();

            this.screensize = screenSize;
            this.pos = pos;
            this.target = target;
            this.dirty= true;
        }

        
        createViewMatrix() {
            // @ts-ignore
            this.viewMatrix = lookAt(vec3(this.pos), vec3(this.target), vec3(0, 1, 0));
        }


        setTarget(target: number[]){
            if( target.length != 3)
                throw "Target must be number vector of length 3";
            this.target = target;
            this.dirty = true;
        }

        
        setY(y: number){
            this.pos[1] = y;
            this.dirty = true;
        }
        

        /**
         * Rotates the camera's position around the target's y axis
         * @param angle  Radians to rotate around the y axis
         */
        rotateY(angle: number){
            // @ts-ignore
            let translationMatrix = translate(-this.target[0], -this.target[1], -this.target[2]);

            // @ts-ignore
            let rotationMatrix = rotateY((angle/Math.PI)*180);
            
            // @ts-ignore
            let totalMatrix = mult(translate(this.target), mult(rotationMatrix, translationMatrix));
            
            // @ts-ignore
            this.pos = mult(totalMatrix, vec4(this.pos));
            this.pos = this.pos.splice(0, 3);
            this.dirty = true;
        }
    }


    
    export class OrthographicCamera extends LookAtCamera {

        createProjectionMatrix(){
            // @ts-ignore
            this.projectionMatrix = ortho(-this.screensize[0]/2.0, this.screensize[0]/2.0, -this.screensize[1]/2.0, this.screensize[1]/2.0, 0,  10000);
        };
    }



    export class PerspectiveCamera extends LookAtCamera {
        protected fov: number;


        constructor(screenSize: number[], pos: number[], target: number[], fov: number){
            super(screenSize, pos, target);
            this.fov = fov;
        }


        setFOV(fov: number){
            this.fov = fov;
            this.dirty = true;
        }


        createProjectionMatrix(){
            // @ts-ignore
            this.projectionMatrix = perspective(this.fov, this.screensize[0]/this.screensize[1], 0.01, 10000);
        };
    }

}
