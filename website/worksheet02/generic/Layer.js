
class Layer {
    
    constructor(gl, screenSize){
        this._drawables = [];
        this._gl = gl;
        this._nextDepthIndex = 0;
        this.hidden = false;

        this._camera = new Camera(screenSize);

        this._pointRenderer = new PointRenderer(this._gl, this._camera);
        this._triangleRenderer = new TriangleRenderer(this._gl, this._camera);
    }


    update(){
        if( this.hidden )
            return;

        this._gl.clear(gl.DEPTH_BUFFER_BIT);
        this._nextDepthIndex = 0;

        this._drawables.forEach( drawable => {
            drawable.draw(this._nextDepthIndex);
            this._nextDepthIndex++;
        });

        this._pointRenderer.flush();
        this._triangleRenderer.flush();
    }


    addPoint( pos, size, color ){
        var point = new Point(pos, size, color, this._pointRenderer);
        this._drawables.push(point);
        return point;
    }


    addTriangle( points ){
        console.log("Adding triangle");
        console.log(points); 
        var triangle = new Triangle(points, this._triangleRenderer);
        this._drawables.push(triangle);
        return triangle;
    }

    removeDrawable(drawable){
        this._drawables.splice(this._drawables.indexOf(drawable), 1);
    }

   


    clear(){
        this._drawables = [];
    }

}