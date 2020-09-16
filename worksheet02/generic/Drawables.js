
class Drawable {
    draw(){
        throw "Render function has not been implemented";
    }
}




class Point extends Drawable {
    constructor(pos, size, color, pointRenderer){
        super();
        this._pointRenderer = pointRenderer;
        this._pos = pos;
        this._size = size;
        this._color = color;
    }


    draw(depthIndex){
        this._pointRenderer.drawPoint(
            this._pos,
            depthIndex,
            this._size,
            this._color
        );
    }
}
