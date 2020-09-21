
class Drawable {
    draw(){
        throw "Drawable must be derived by another class, and render function must be implemented";
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



class Triangle extends Drawable {

    constructor(points, triangleRenderer) {
        super();
        this._points = points;
        this._triangleRenderer = triangleRenderer;
    }

    draw(depthIndex){
        this._triangleRenderer.drawTriangle(depthIndex, this._points);
    }    
}

// Pseudo-nested class of Triangle to represent a point of a triangle
Triangle.Point = class {
    constructor(pos, color){
        this._pos = pos;
        this._color = color;
    }
}