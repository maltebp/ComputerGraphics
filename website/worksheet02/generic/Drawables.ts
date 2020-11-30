
namespace Sheet2 {

    export interface Drawable {
        draw(depthIndex: number);
    }    
    
    
    export class Point implements Drawable {
        private pointRenderer: PointRenderer;
        private pos: number[];
        private size: number;
        private color: Util.Color;

        constructor(pos: number[], size: number, color: Util.Color, pointRenderer: PointRenderer){
            this.pointRenderer = pointRenderer;
            this.pos = pos;
            this.size = size;
            this.color = color.copy();
        }
    
        draw(depthIndex: number) {
            this.pointRenderer.drawPoint(
                this.pos,
                depthIndex,
                this.size,
                this.color
            );
        }
    }
    



    
    export class Triangle implements Drawable {

        private renderer: TriangleRenderer;
        private points: Triangle.Point[];

        constructor(points: Triangle.Point[], triangleRenderer: TriangleRenderer) {
            this.points = points;
            this.renderer = triangleRenderer;
        }
    
        draw(depthIndex: number){
            this.renderer.drawTriangle(depthIndex, this.points);
        }
        
    }
    
    export namespace Triangle {
        // Pseudo-nested class of Triangle to represent a point of a triangle
        export class Point {
           private pos: number[];
           private color: Util.Color;

           constructor(pos: number[], color: Util.Color){
               this.pos = pos;
               this.color = color.copy();
           }

           getColor(){
               return this.color.copy();
           }

           getPos(){
               return this.pos;
           }
       }
   }    
    
    
    
    export class Circle implements Drawable {
        private center: number[]; // Size: 2
        private radius: number;
        private centerColor: Util.Color;
        private outerColor: Util.Color;
        private renderer: CircleRenderer;

        constructor(center: number[], radius: number, centerColor: Util.Color, outerColor: Util.Color, circleRenderer: CircleRenderer) {
            this.center = center;
            this.radius = radius;
            this.centerColor = centerColor;
            this.outerColor = outerColor;
            this.renderer = circleRenderer;
        }
    
        draw(depthIndex: number){
            this.renderer.drawCircle( depthIndex, this.center, this.radius, [this.centerColor, this.outerColor]);
        }
    }

}