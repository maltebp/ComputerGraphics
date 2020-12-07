

namespace Project {

    enum DrawMode {
        NORMAL,
        OCCLUSION,
        RAYS,
        LIGHT
    }

    const CANVAS_SIZE = [720, 480];

    const LIGHT_SAMPLES = 1000;
    const LIGHT_RADIUS = 500;
    
    const FRAME_TIMER = new Util.FrameTimer("fps-text");
    
    declare var gl: WebGLRenderingContext;

    declare var imageRenderer: Util.ImageRenderer;
    declare var quadRenderer: QuadRenderer;
    declare var camera: Camera2D;
    declare var occlusionRenderer: OcclusionRenderer;
    declare var rayRenderer: LightRayRenderer;
    declare var lightRenderer: LightRenderer;

    declare var quads: Quad[];
    declare var drawMode: DrawMode;
    


    function setup() {

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.ALWAYS); //TODO: Remove this at some point

        imageRenderer = new Util.ImageRenderer(gl);
        occlusionRenderer = new OcclusionRenderer(gl, LIGHT_RADIUS, LIGHT_RADIUS);
        rayRenderer = new LightRayRenderer(gl, LIGHT_SAMPLES);

        lightRenderer = new LightRenderer(gl, LIGHT_RADIUS);

        quadRenderer = new QuadRenderer(gl);
        camera = new Camera2D(CANVAS_SIZE, [0, 0]);

        quads = [];
        quads.push(new Quad(100, 100, [0,-120], 0, Util.Color.WHITE));
        quads.push(new Quad(30, 40, [120,120], 0, Util.Color.WHITE));
        quads.push(new Quad(10, 10, [100,10], 0, Util.Color.WHITE));
        quads.push(new Quad(5, 600, [-200,-100], 30, Util.Color.WHITE));

        drawMode = DrawMode.NORMAL;
        new Util.RadioGroup<DrawMode>((mode) => drawMode = mode )
            .addOption("draw-mode-normal", DrawMode.NORMAL)
            .addOption("draw-mode-occlusion", DrawMode.OCCLUSION)
            .addOption("draw-mode-rays", DrawMode.RAYS)
            .addOption("draw-mode-light", DrawMode.LIGHT)
            .check(0)
            ;
    }


    function update() {
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();

        // quadRenderer.drawQuads(camera, ...quads);

        
        occlusionRenderer.drawQuads([0,0], ...quads);
        occlusionRenderer.bindTexture(1);
        rayRenderer.draw();
        
        if( drawMode == DrawMode.OCCLUSION ) {
            occlusionRenderer.bindTexture(0);
            imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], LIGHT_RADIUS, LIGHT_RADIUS );
        }
        if( drawMode ==DrawMode.RAYS ) {
            rayRenderer.bindTexture(0);
            imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], LIGHT_RADIUS, 1 );
        }
        if( drawMode ==DrawMode.LIGHT ) {
            rayRenderer.bindTexture(0);
            lightRenderer.draw();
            lightRenderer.bindTexture(0);
            imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], LIGHT_RADIUS, LIGHT_RADIUS);
        }
        
        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Project.start();