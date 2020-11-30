
namespace Sheet2 {

    /**
     * Represents a Layer
     * Contains one of each renderer, and each layer operates as if it's a standalone drawing context
     */
    export class Layer {
        
        private gl: WebGLRenderingContext;
        private drawables: Drawable[];
        private camera: Camera2D;

        private pointRenderer: PointRenderer;
        private triangleRenderer: TriangleRenderer;
        private circleRenderer: CircleRenderer;

        private nextDepthIndex = 0;
        private hidden = false;
        
        
        constructor(gl: WebGLRenderingContext, screenSize: number[]){
            this.drawables = [];
            this.gl = gl;
            this.nextDepthIndex = 0;
            this.hidden = false;

            this.camera = new Camera2D(screenSize);

            this.pointRenderer = new PointRenderer(this.gl, this.camera);
            this.triangleRenderer = new TriangleRenderer(this.gl, this.camera);
            this.circleRenderer = new CircleRenderer(this.gl, this.camera);
        }


        update(){
            if( this.hidden ) return;

            /**
             * Objects are draw in order by using a z-index. The lower the z-index, the
             * closer it is to the screen, so objects with low z-index will be on top.
             * WebGL promises at least 16-bit resolution for the depth buffer, so we
             * have 2^16=65536 z-index values.
             */

            this.gl.clear(gl.DEPTH_BUFFER_BIT);
            this.nextDepthIndex = 0;

            this.drawables.forEach( drawable => {
                drawable.draw(this.nextDepthIndex);
                this.nextDepthIndex++;
            });

            this.pointRenderer.flush();
            this.triangleRenderer.flush();
            this.circleRenderer.flush();
        }


        addPoint( pos: number[], size: number, color: Util.Color ){
            var point = new Point(pos, size, color, this.pointRenderer);
            this.drawables.push(point);
            return point;
        }


        addTriangle( points ){
            var triangle = new Triangle(points, this.triangleRenderer);
            this.drawables.push(triangle);
            return triangle;
        }


        addCircle(center: number[], radius: number, centerColor: Util.Color, outerColor: Util.Color,){
            var circle = new Circle(center, radius, centerColor, outerColor, this.circleRenderer);
            this.drawables.push(circle);
            return circle;
        }


        removeDrawable(drawable){
            this.drawables.splice(this.drawables.indexOf(drawable), 1);
        }
        

        setHidden(hidden: boolean){
            this.hidden = hidden;
        }

        
        isHidden(){
            return this.hidden;
        }

        clear(){
            this.drawables = [];
        }

    }

}
