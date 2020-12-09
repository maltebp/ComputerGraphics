

namespace Project {

    enum DrawMode {
        NORMAL,
        OCCLUSION,
        RAYS,
        SHADOW,
        LIGHT
    }

    const CANVAS_SIZE = [720, 480];

    const LIGHT_SAMPLES = 1000;
    const LIGHT_RADIUS = 900;
    
    const FRAME_TIMER = new Util.FrameTimer("fps-text");
    
    declare var gl: WebGLRenderingContext;

    declare var quadRenderer: QuadRenderer;
    declare var camera: Camera2D;
    declare var lightRenderer: LightRenderer;
    declare var backgroundRenderer: BackgroundRenderer;

    declare var selectionRenderer: SelectionRenderer;

    // The mouse's position in world coordinates
    declare var mouseWorldPosition: number[];

    declare var lights: Light[];
    declare var quads: Quad[];
    declare var drawMode: DrawMode;


    declare var hasDragged: boolean;
    declare var dragOffset: number[];
    declare var dragSelectable: Selectable;
    declare var hoverSelectable: Selectable;
    declare var selected: Selectable;
    
    declare var mousePressed: boolean;    


    function setup() {

        hasDragged = false;
        dragOffset = [0,0];
        dragSelectable = null;
        hoverSelectable = null;
        selected = null;

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.ALWAYS); //TODO: Remove this at some point
        
        backgroundRenderer = new BackgroundRenderer(gl);

        selectionRenderer = new SelectionRenderer(gl);
        

        // imageRenderer = new Util.ImageRenderer(gl);
        // rayRenderer = new LightRayRenderer(gl, LIGHT_SAMPLES);


        lights = [];
        lights.push(new Light([-125,-100], 200, Util.Color.BLUE));
        lights.push(new Light([0,0], 300, Util.Color.GREEN));
        lights.push(new Light([150,-75], 200, Util.Color.YELLOW));
        lights.push(new Light([-200, 250], 200, Util.Color.RED));
        lightRenderer = new LightRenderer(gl);


        quadRenderer = new QuadRenderer(gl);
        camera = new Camera2D(CANVAS_SIZE, [0, 0]);

        quads = [];
        quads.push(new Quad(100, 100, [0,-120], 0, Util.Color.WHITE));
        quads.push(new Quad(30, 40, [50,50], 0, Util.Color.WHITE));
        quads.push(new Quad(10, 10, [100,10], 0, Util.Color.WHITE));
        quads.push(new Quad(5, 200, [-200,-100], 0, Util.Color.WHITE));

        // Drawing mode radio group
        drawMode = DrawMode.NORMAL;
        new Util.RadioGroup<DrawMode>((mode) => drawMode = mode )
            .addOption("draw-mode-normal", DrawMode.NORMAL)
            .addOption("draw-mode-occlusion", DrawMode.OCCLUSION)
            .addOption("draw-mode-rays", DrawMode.RAYS)
            .addOption("draw-mode-shadow", DrawMode.SHADOW)
            .check(0)
            ;

        // Ambient color picker
        new Util.ColorPicker("ambient-color", new Util.Color(0.15, 0.15, 0.15), (newColor) => lightRenderer.setAmbient(newColor));
        
        // Mouse Events
        mousePressed = false;
        let canvas = <HTMLCanvasElement> document.getElementById("canvas");
        canvas.onmousedown = (e) => {
            mousePressed = true;

            hasDragged = false;
            dragSelectable = checkCollisions();
            if( dragSelectable !== null ){
                //@ts-ignore
                dragOffset = subtract(dragSelectable.getPosition(), mouseWorldPosition);
                hoverSelectable = null;
            }


            e.preventDefault(); 
        }
        canvas.onmouseleave = (e) => {
            mousePressed = false;
            dragSelectable = null;
            e.preventDefault();
        }
        canvas.onmouseup = (e) => {
            mousePressed = false;     
            if( dragSelectable !== null && !hasDragged ){
                selected = dragSelectable;
            } else {
                hoverSelectable = checkCollisions(); 
            }
            dragSelectable = null;
            e.preventDefault();
        }
        canvas.onmousemove = (e) => {
            mouseWorldPosition = camera.screenToWorld([e.offsetX,e.offsetY]);

            // Make sure we don't get hover effects when dragging
            hoverSelectable = null;

            if( mousePressed ) {
                if( dragSelectable !== null ){
                    dragSelectable.setPosition([mouseWorldPosition[0]+dragOffset[0], mouseWorldPosition[1]+dragOffset[1]]);
                    hasDragged = true;
                }else if( e.altKey ) {
                    camera.adjustZoom(e.movementY  / 100.0);
                }else{
                    camera.adjustPosition(-e.movementX, e.movementY);
                }
            } else {
                hoverSelectable = checkCollisions(); 
            }
        }
        // canvas.onwheel = (e) =>{
        //     camera.adjustDistance(e.deltaY);
        //     e.preventDefault();
        // }
    }


    function checkCollisions(){
        for( let i=0; i<lights.length; i++){
            let light = lights[i];
            let points = light.getCollisionPoints();
            
            let collision = 
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[1], points[2]]) ||
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[2], points[3]]);

            if( collision ) return light;
        }

        for( let i=0; i<quads.length; i++){
            let quad = quads[i];
            let points = quad.getCollisionPoints();
            
            let collision = 
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[1], points[2]]) ||
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[2], points[3]]);

            if( collision ) return quad;
        }
        return null;
    }


    /**
     * Checks if a the given points collides with given triangle, which is defined
     * by 3 points.
     */
    function pointCollidesWithTriangle(point: number[], triangle: number[][]) {
        let triangleArea = Math.abs( 
            (triangle[1][0]-triangle[0][0])*(triangle[2][1]-triangle[0][1])
            - 
            (triangle[2][0]-triangle[0][0])*(triangle[1][1]-triangle[0][1])
        );;

        let area1 =    Math.abs( (triangle[0][0]-point[0])*(triangle[1][1]-point[1]) - (triangle[1][0]-point[0])*(triangle[0][1]-point[1]) );
        let area2 =    Math.abs( (triangle[1][0]-point[0])*(triangle[2][1]-point[1]) - (triangle[2][0]-point[0])*(triangle[1][1]-point[1]) );
        let area3 =    Math.abs( (triangle[2][0]-point[0])*(triangle[0][1]-point[1]) - (triangle[0][0]-point[0])*(triangle[2][1]-point[1]) );

        let areaDiff = Math.abs(area1 + area2 + area3 - triangleArea);
        // Not sure about the floating point precision,
        // so we check they are "equal" with some error
        // like this
        
        return areaDiff < 0.0001;
    }

    
    function update() {
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();
        

        gl.disable(gl.BLEND);
        backgroundRenderer.drawBackground(camera);
        
        quadRenderer.drawQuads(camera, ...quads);

        lightRenderer.draw(camera, quads, lights);

        // occlusionRenderer.drawOccluders(camera, ...quads);
        // rayRenderer.draw();
        
        gl.disable(gl.BLEND);

        if( drawMode == DrawMode.OCCLUSION ) {
            lightRenderer.drawOcclusionMap(CANVAS_SIZE);
        }
        if( drawMode ==DrawMode.RAYS ) {
            lightRenderer.drawRayMap(CANVAS_SIZE);
        }
        if( drawMode == DrawMode.SHADOW ) {
            lightRenderer.drawShadowMap(CANVAS_SIZE);
        }
        // if( drawMode ==DrawMode.LIGHT ) {
        //     rayRenderer.bindTexture(0);
        //     lightRenderer.draw(camera);
        //     lightRenderer.bindTexture(0);
        //     // imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], LIGHT_RADIUS, LIGHT_RADIUS);
        // }


        if( hoverSelectable !== null )
            selectionRenderer.draw(camera, hoverSelectable.getCollisionPoints(), new Util.Color(1,1,1,0.75));

        if( dragSelectable !== null )
            selectionRenderer.draw(camera, dragSelectable.getCollisionPoints(), new Util.Color(1,1,1,0.75));

        if( selected !== null )
            selectionRenderer.draw(camera, selected.getCollisionPoints(), Util.Color.WHITE);

        
        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Project.start();