

/**
 * Represents a Layer
 * Contains one of each renderer, and each layer operates as if it's a standalone drawing context
 */
class Layer {
    
    constructor(gl, screenSize){
        this._drawables = [];
        this._gl = gl;
        this._nextDepthIndex = 0;
        this.hidden = false;

        this._camera = new Camera(screenSize);

        this._pointRenderer = new PointRenderer(this._gl, this._camera);
        this._triangleRenderer = new TriangleRenderer(this._gl, this._camera);
        this._circleRenderer = new CircleRenderer(this._gl, this._camera);
    }


    update(){
        if( this.hidden )
            return;

        /**
         * Objects are draw in order by using a z-index. The lower the z-index, the
         * closer it is to the screen, so objects with low z-index will be on top.
         * WebGL promises at least 16-bit resolution for the depth buffer, so we
         * have 2^16=65536 z-index values.
         */

        this._gl.clear(gl.DEPTH_BUFFER_BIT);
        this._nextDepthIndex = 0;

        this._drawables.forEach( drawable => {
            drawable.draw(this._nextDepthIndex);
            this._nextDepthIndex++;
        });

        this._pointRenderer.flush();
        this._triangleRenderer.flush();
        this._circleRenderer.flush();
    }

    addPoint( pos, size, color ){
        var point = new Point(pos, size, color, this._pointRenderer);
        this._drawables.push(point);
        return point;
    }

    addTriangle( points ){
        var triangle = new Triangle(points, this._triangleRenderer);
        this._drawables.push(triangle);
        return triangle;
    }

    addCircle(centerPoint, outerPoint){
        var circle = new Circle(centerPoint, outerPoint, this._circleRenderer);
        this._drawables.push(circle);
        return circle;
    }

    removeDrawable(drawable){
        this._drawables.splice(this._drawables.indexOf(drawable), 1);
    }

   


    clear(){
        this._drawables = [];
    }

}