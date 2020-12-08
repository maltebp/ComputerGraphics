

namespace Project {

    enum DrawMode {
        NORMAL,
        OCCLUSION,
        RAYS,
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


    declare var quads: Quad[];
    declare var drawMode: DrawMode;

    
    declare var mousePressed: boolean;
    


    function setup() {

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.ALWAYS); //TODO: Remove this at some point
        
        backgroundRenderer = new BackgroundRenderer(gl);
        

        // imageRenderer = new Util.ImageRenderer(gl);
        // rayRenderer = new LightRayRenderer(gl, LIGHT_SAMPLES);

        lightRenderer = new LightRenderer(gl);


        quadRenderer = new QuadRenderer(gl);
        camera = new Camera2D(CANVAS_SIZE, [0, 0]);

        quads = [];
        quads.push(new Quad(100, 100, [0,-120], 0, Util.Color.WHITE));
        quads.push(new Quad(30, 40, [50,50], 0, Util.Color.WHITE));
        quads.push(new Quad(10, 10, [100,10], 0, Util.Color.WHITE));
        quads.push(new Quad(5, 600, [-200,-100], 30, Util.Color.WHITE));

        // Drawing mode radio group
        drawMode = DrawMode.NORMAL;
        new Util.RadioGroup<DrawMode>((mode) => drawMode = mode )
            .addOption("draw-mode-normal", DrawMode.NORMAL)
            .addOption("draw-mode-occlusion", DrawMode.OCCLUSION)
            .addOption("draw-mode-rays", DrawMode.RAYS)
            .addOption("draw-mode-light", DrawMode.LIGHT)
            .check(0)
            ;

        // Ambient color picker
        new Util.ColorPicker("ambient-color", new Util.Color(0.15, 0.15, 0.15), (newColor) => lightRenderer.setAmbient(newColor));
        
        // Mouse Events
        mousePressed = false;
        let canvas = <HTMLCanvasElement> document.getElementById("canvas");
        canvas.onmousedown = (e) => {
            mousePressed = true;
            e.preventDefault(); 
        }
        canvas.onmouseleave = (e) => {
            mousePressed = false;
            e.preventDefault();
        }
        canvas.onmouseup = (e) => {
            mousePressed = false;     
            e.preventDefault();
        }
        canvas.onmousemove = (e) => {
            if( mousePressed ) {
                if( e.altKey ) {
                    camera.adjustZoom(e.movementY  / 100.0);
                }else{
                    camera.adjustPosition(-e.movementX, e.movementY);
                }
            }
        }
        // canvas.onwheel = (e) =>{
        //     camera.adjustDistance(e.deltaY);
        //     e.preventDefault();
        // }

        
    }


    function update() {
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();
        

        gl.disable(gl.BLEND);
        backgroundRenderer.drawBackground(camera);
        
        lightRenderer.draw(camera, quads, null);

        // occlusionRenderer.drawOccluders(camera, ...quads);
        // rayRenderer.draw();
        

        if( drawMode == DrawMode.OCCLUSION ) {
            lightRenderer.drawOcclusionMap(CANVAS_SIZE);
        }
        // if( drawMode ==DrawMode.RAYS ) {
        //     rayRenderer.bindTexture(0);
        //     imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], LIGHT_RADIUS, 1 );
        // }
        // if( drawMode ==DrawMode.LIGHT ) {
        //     rayRenderer.bindTexture(0);
        //     lightRenderer.draw(camera);
        //     lightRenderer.bindTexture(0);
        //     // imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], LIGHT_RADIUS, LIGHT_RADIUS);
        // }

        // quadRenderer.drawQuads(camera, ...quads);

        
        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Project.start();