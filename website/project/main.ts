

namespace Project {

    enum DrawMode {
        NORMAL,
        OCCLUSION,
        RAYS
    }

    const CANVAS_SIZE = [720, 480];
    
    const FRAME_TIMER = new Util.FrameTimer("fps-text");
    
    declare var gl: WebGLRenderingContext;

    declare var imageRenderer: Util.ImageRenderer;
    declare var quadRenderer: QuadRenderer;
    declare var camera: Camera2D;
    declare var occlusionRenderer: OcclusionRenderer;
    declare var rayRenderer: LightRayRenderer;

    declare var quads: Quad[];
    declare var drawMode: DrawMode;
    


    function setup() {

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);

        imageRenderer = new Util.ImageRenderer(gl);
        occlusionRenderer = new OcclusionRenderer(gl, 300, 300);
        rayRenderer = new LightRayRenderer(gl, 256);

        quadRenderer = new QuadRenderer(gl);
        camera = new Camera2D(CANVAS_SIZE, [0, 0]);

        quads = [];
        quads.push(new Quad(100, 100, [0,0], 0, Util.Color.WHITE));
        quads.push(new Quad(30, 40, [-150,100], 0, Util.Color.WHITE));
        quads.push(new Quad(50, 50, [100,10], 0, Util.Color.WHITE));
        quads.push(new Quad(5, 600, [-200,-100], 30, Util.Color.WHITE));

        drawMode = DrawMode.NORMAL;
        new Util.RadioGroup<DrawMode>((mode) => drawMode = mode )
            .addOption("draw-mode-normal", DrawMode.NORMAL)
            .addOption("draw-mode-occlusion", DrawMode.OCCLUSION)
            .addOption("draw-mode-rays", DrawMode.RAYS)
            .check(0)
            ;
    }


    function update() {
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();

        if( drawMode == DrawMode.NORMAL ) {
            quadRenderer.drawQuads(camera, ...quads);
        }
        if( drawMode == DrawMode.OCCLUSION ) {
            occlusionRenderer.drawQuads([0,0], ...quads);
            occlusionRenderer.bindTexture(0);
            imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], 300, 300 );
        }
        if( drawMode ==DrawMode.RAYS ) {
            rayRenderer.draw();
            rayRenderer.bindTexture(0);
            imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], 256, 1 );
        }
        
        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Project.start();