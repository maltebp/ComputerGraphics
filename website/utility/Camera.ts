

namespace Util {
        

    /**
     * Abstract generic Camera class, defining methods to get View and Projection matrices
     */
    export abstract class Camera {

        protected dirty: boolean = true;
        protected viewMatrix: Float32Array = null;
        protected projectionMatrix: Float32Array = null;
        protected viewProjectionMatrix: Float32Array = null;
        protected screensize: number[] = null;
        protected position: number[] = null;

        protected abstract createViewMatrix();
        protected abstract createProjectionMatrix();


        protected clean(){
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

        
        setY(y: number){
            this.position[1] = y;
            this.dirty = true;
        }


        setZ(z: number){
            this.position[2] = z;
            this.dirty = true;
        }

        setPosition(position: number[]) {
            this.position = position;
            this.dirty = true;
        }

        getPosition(){
            this.clean();
            return this.position;
        }

    }



    export abstract class LookAtCamera extends Camera {
        private target: number[] = [0, 0, 0];
        protected screensize: number[] = null;


        constructor(screenSize: number[], pos: number[], target: number[]){
            super();

            this.screensize = screenSize;
            this.position = pos;
            this.target = target;
            this.dirty= true;
        }

        
        createViewMatrix() {
            // @ts-ignore
            this.viewMatrix = lookAt(vec3(this.position), vec3(this.target), vec3(0, 1, 0));
        }


        setTarget(target: number[]){
            if( target.length != 3)
                throw "Target must be number vector of length 3";
            this.target = target;
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
            this.position = mult(totalMatrix, vec4(this.position));
            this.position = this.position.splice(0, 3);
            this.dirty = true;
        }

        
    }


    
    export class OrthographicCamera extends LookAtCamera {
        private nearPlane: number;
        private farPlane: number;

        constructor(screenSize: number[], pos: number[], target: number[], nearPlane = 0, farPlane = 10000){
            super(screenSize, pos, target);
            this.nearPlane = nearPlane;
            this.farPlane = farPlane;
        }

        createProjectionMatrix(){
            // @ts-ignore
            this.projectionMatrix = ortho(-this.screensize[0]/2.0, this.screensize[0]/2.0, -this.screensize[1]/2.0, this.screensize[1]/2.0, nearPlane,  farPlane);
        };
    }



    export class PerspectiveCamera extends LookAtCamera {
        protected fov: number;
        protected farPlane: number;
        protected nearPlane: number;

        constructor(screenSize: number[], pos: number[], target: number[], fov: number, nearPlane = 1, farPlane = 10000) {
            super(screenSize, pos, target);
            this.fov = fov;
            this.farPlane = farPlane;
            this.nearPlane = nearPlane; 
        }     
       

        setFOV(fov: number){
            this.fov = fov;
            this.dirty = true;
        }


        createProjectionMatrix(){
            // @ts-ignore
            this.projectionMatrix = perspective(this.fov, this.screensize[0]/this.screensize[1], this.nearPlane, this.farPlane);
        };
    }





    /**
     * Perspective camera which has a target view point, and spherical position in relation to that point.
     * The spherical position consists of a distance, vertical rotation (polar) and a horizontal rotation (azimuth)
     * 
     * With a rotation of (0,0) it looks down the z-axis in the negative direction.
     */
    export class OrbitalCamera extends Camera {
        
        protected screenSize: number[];
        protected distance: number;
        protected target: number[];
        protected fov: number;
        protected horizontalRotation: number;
        protected verticalRotation: number;
        protected direction: number[];

        constructor(screenSize: number[], target: number[], fov: number, distance: number, horizontalRotation: number, verticalRotation: number ){
            super();

            this.screenSize = screenSize;
            this.fov = fov;
            this.target = target;
            this.distance = distance;

            this.setHorizontalRotation(horizontalRotation);
            this.setVerticalRotation(verticalRotation);
        }

        setFOV(fov: number){
            this.fov = fov;
            this.dirty = true;
        }


        setHorizontalRotation(rotation: number){
            var newRotation = rotation % 360;
            if( newRotation < 0 ) newRotation += 360;
            this.horizontalRotation = newRotation;
            this.dirty = true;
        }


        setVerticalRotation(rotation: number){
            var newRotation = rotation % 360;
            if( newRotation < 0 ) newRotation += 360;
            this.verticalRotation = newRotation;
            this.dirty = true;
        }


        setDistance(distance: number){
            this.distance = distance;
            if( this.distance < 0) this.distance = 0;
            this.dirty = true;
        }


        adjustHorizontalRotation(rotation: number){
            this.setHorizontalRotation(this.horizontalRotation + rotation);
        }
    

        adjustVerticalRotation(rotation: number){
            this.setVerticalRotation(this.verticalRotation + rotation);
        }


        adjustDistance(amount: number) {
            this.setDistance(this.distance+amount);
        }


        getDirection(){
            this.clean();
            return this.direction;
        }


        createViewMatrix() {

            // Change up vector to upside down if on the "other side" of the orbit target
            let upVector = [0,0,0];
            if( this.verticalRotation < 90 || this.verticalRotation > 270 ) {
                upVector = [0, 1, 0];

            }else if(this.verticalRotation == 90 ) {
                // @ts-ignore
                upVector = mult(rotateY(-this.horizontalRotation), [0, 0, -1, 0]).splice(0,3);
            }else {
                upVector = [0, -1, 0];
            }

            let vAngleRadians = ((-this.verticalRotation+90) / 180) * Math.PI;
            let hAngleRadians = ((this.horizontalRotation+90) / 180) * Math.PI;

            // Spherical to cartesian
            this.position = [
                -this.distance * Math.sin(vAngleRadians) * Math.cos(hAngleRadians),
                this.distance * Math.cos(vAngleRadians),
                this.distance * Math.sin(vAngleRadians) * Math.sin(hAngleRadians)
            ];

            // Translate origin 
            this.position[0] += this.target[0];
            this.position[1] += this.target[1];
            this.position[2] += this.target[2];

            // @ts-ignore
            this.direction = normalize(subtract(this.target, this.position));

            // @ts-ignore
            this.viewMatrix = lookAt( this.position, this.target, upVector );
        }


        createProjectionMatrix(){
            // @ts-ignore
            this.projectionMatrix = perspective(this.fov, this.screenSize[0]/this.screenSize[1], 1, 10000);
        };



    }

}
