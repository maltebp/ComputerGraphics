var Util;
(function (Util) {
    /**
     * Abstract generic Camera class, defining methods to get View and Projection matrices
     */
    class Camera {
        constructor() {
            this.dirty = true;
            this.viewMatrix = null;
            this.projectionMatrix = null;
            this.viewProjectionMatrix = null;
            this.screensize = null;
        }
        clean() {
            if (!this.dirty)
                return;
            this.createViewMatrix();
            this.createProjectionMatrix();
            // @ts-ignore
            this.viewProjectionMatrix = mult(this.projectionMatrix, this.viewMatrix);
            this.dirty = false;
        }
        getViewProjectionMatrix() {
            this.clean();
            return this.viewProjectionMatrix;
        }
        getProjectionMatrix() {
            this.clean();
            return this.projectionMatrix;
        }
        getViewMatrix() {
            this.clean();
            return this.viewMatrix;
        }
    }
    Util.Camera = Camera;
    class LookAtCamera extends Camera {
        constructor(screenSize, pos, target) {
            super();
            this.pos = [0, 0, 0];
            this.target = [0, 0, 0];
            this.screensize = null;
            this.screensize = screenSize;
            this.pos = pos;
            this.target = target;
            this.dirty = true;
        }
        createViewMatrix() {
            // @ts-ignore
            this.viewMatrix = lookAt(vec3(this.pos), vec3(this.target), vec3(0, 1, 0));
        }
        setTarget(target) {
            if (target.length != 3)
                throw "Target must be number vector of length 3";
            this.target = target;
            this.dirty = true;
        }
        setY(y) {
            this.pos[1] = y;
            this.dirty = true;
        }
        setZ(z) {
            this.pos[2] = z;
            this.dirty = true;
        }
        /**
         * Rotates the camera's position around the target's y axis
         * @param angle  Radians to rotate around the y axis
         */
        rotateY(angle) {
            // @ts-ignore
            let translationMatrix = translate(-this.target[0], -this.target[1], -this.target[2]);
            // @ts-ignore
            let rotationMatrix = rotateY((angle / Math.PI) * 180);
            // @ts-ignore
            let totalMatrix = mult(translate(this.target), mult(rotationMatrix, translationMatrix));
            // @ts-ignore
            this.pos = mult(totalMatrix, vec4(this.pos));
            this.pos = this.pos.splice(0, 3);
            this.dirty = true;
        }
        getPosition() {
            return this.pos;
        }
    }
    Util.LookAtCamera = LookAtCamera;
    class OrthographicCamera extends LookAtCamera {
        createProjectionMatrix() {
            // @ts-ignore
            this.projectionMatrix = ortho(-this.screensize[0] / 2.0, this.screensize[0] / 2.0, -this.screensize[1] / 2.0, this.screensize[1] / 2.0, 0, 10000);
        }
        ;
    }
    Util.OrthographicCamera = OrthographicCamera;
    class PerspectiveCamera extends LookAtCamera {
        constructor(screenSize, pos, target, fov) {
            super(screenSize, pos, target);
            this.fov = fov;
        }
        setFOV(fov) {
            this.fov = fov;
            this.dirty = true;
        }
        createProjectionMatrix() {
            // @ts-ignore
            this.projectionMatrix = perspective(this.fov, this.screensize[0] / this.screensize[1], 0.01, 10000);
        }
        ;
    }
    Util.PerspectiveCamera = PerspectiveCamera;
    /**
     * Perspective camera which has a target view point, and spherical position in relation to that point.
     * The spherical position consists of a distance, vertical rotation (polar) and a horizontal rotation (azimuth)
     *
     * With a rotation of (0,0) it looks down the positive z-axis.
     */
    class OrbitalCamera extends Camera {
        constructor(screenSize, target, fov, distance, horizontalRotation, verticalRotation) {
            super();
            this.screenSize = screenSize;
            this.fov = fov;
            this.target = target;
            this.distance = distance;
            this.setHorizontalRotation(horizontalRotation);
            this.setVerticalRotation(verticalRotation);
        }
        setFOV(fov) {
            this.fov = fov;
            this.dirty = true;
        }
        setHorizontalRotation(rotation) {
            var newRotation = rotation % 360;
            if (newRotation < 0)
                newRotation += 360;
            this.horizontalRotation = rotation;
            this.dirty = true;
        }
        setVerticalRotation(rotation) {
            var newRotation = rotation % 360;
            if (newRotation < 0)
                newRotation += 360;
            this.verticalRotation = newRotation;
            this.dirty = true;
        }
        setDistance(distance) {
            this.distance = distance;
            if (this.distance < 0)
                this.distance = 0;
            this.dirty = true;
        }
        adjustHorizontalRotation(rotation) {
            this.setHorizontalRotation(this.horizontalRotation + rotation);
        }
        getPosition() {
            if (this.dirty)
                this.createViewMatrix();
            return this.position;
        }
        createViewMatrix() {
            // Change up vector to upside down if on the "other side" of the orbit target
            var upVector = this.verticalRotation <= 90 || this.verticalRotation >= 270 ? [0, 1, 0] : [0, -1, 0];
            let vAngleRadians = (this.verticalRotation / 180) * Math.PI - Math.PI / 2;
            let hAngleRadians = (this.horizontalRotation / 180) * Math.PI - Math.PI / 2;
            // Spherical to cartesian
            this.position = [
                this.distance * Math.sin(vAngleRadians) * Math.cos(hAngleRadians),
                this.distance * Math.cos(vAngleRadians),
                this.distance * Math.sin(vAngleRadians) * Math.sin(hAngleRadians)
            ];
            // Translate origin
            this.position[0] += this.target[0];
            this.position[1] += this.target[1];
            this.position[2] += this.target[2];
            // @ts-ignore
            this.viewMatrix = lookAt(this.position, this.target, upVector);
        }
        createProjectionMatrix() {
            // @ts-ignore
            this.projectionMatrix = perspective(this.fov, this.screenSize[0] / this.screenSize[1], 0.01, 10000);
        }
        ;
    }
    Util.OrbitalCamera = OrbitalCamera;
})(Util || (Util = {}));
