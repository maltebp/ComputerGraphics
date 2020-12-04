

namespace Project {

    const CANVAS_SIZE = [720, 480];
    
    const FRAME_TIMER = new Util.FrameTimer("fps-text");
    
    declare var gl: WebGLRenderingContext;

    declare var quadRenderer: QuadRenderer;
    declare var camera: Util.OrthographicCamera;

    declare var quads: Quad[];


    function setup() {

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.2, 0.2, 0.2, 1.0);

        quadRenderer = new QuadRenderer(gl);
        camera = new Util.OrthographicCamera(CANVAS_SIZE, [0, 0, -10], [0,0,0], -1, 1);

        quads = [];
        quads.push(new Quad(0.5, 0.5, [0,0], 0, Util.Color.WHITE));
    }


    function update() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();

        quadRenderer.drawQuads(...quads);

        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Project.start();