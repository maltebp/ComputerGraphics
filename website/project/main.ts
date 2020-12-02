

namespace Project {

    const CANVAS_SIZE = [720, 480];
    
    const FRAME_TIMER = new Util.FrameTimer("fps-text");
    
    declare var gl: WebGLRenderingContext;


    function setup() {

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        

    }


    function update() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();
        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Project.start();