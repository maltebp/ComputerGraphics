
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



class Circle extends Drawable {
    
    constructor(centerPos, outerPos, circleRenderer) {
        super();
        this._center = centerPos._pos;
        this._radius = Math.sqrt(Math.pow(centerPos._pos[0]-outerPos._pos[0], 2) + Math.pow(centerPos._pos[1]-outerPos._pos[1], 2));
        this._colors = [centerPos._color, outerPos._color];
        this._circleRenderer = circleRenderer;
        console.log(this);
    }

    draw(depthIndex){
        this._circleRenderer.drawCircle( depthIndex, this._center, this._radius, this._colors);
    }

}

     
Circle.Point = class {
    constructor(pos, color){
        this._pos = pos;
        this._color = color;
    }
}