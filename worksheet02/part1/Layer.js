
class Layer {
    
    constructor(gl, screenSize){
        this._drawables = [];
        this._gl = gl;
        this._nextDepthIndex = 0;
        this._hidden = false;

        this._camera = new Camera(screenSize);

        this._pointRenderer = new PointRenderer(this._gl, this._camera);
    }


    update(){
        if( this._hidden )
            return;

        this._gl.clear(gl.DEPTH_BUFFER_BIT);
        this._nextDepthIndex = 0;

        this._drawables.forEach( drawable => {
            drawable.draw(this._nextDepthIndex);
            this._nextDepthIndex++;
        });

        this._pointRenderer.flush();
    }


    addPoint( pos, size, color ){
        this._drawables.push(new Point(pos, size, color, this._pointRenderer));
    }


    clear(){
        this._drawables = [];
    }

}