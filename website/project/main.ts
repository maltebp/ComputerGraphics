

namespace Project {

    const CANVAS_SIZE = [720, 480];
    
    const FRAME_TIMER = new Util.FrameTimer("fps-text");
    
    declare var gl: WebGLRenderingContext;

    declare var imageRenderer: Util.ImageRenderer;
    declare var quadRenderer: QuadRenderer;
    declare var camera: Camera2D;
    declare var occlusionRenderer: OcclusionRenderer;

    declare var quads: Quad[];
    declare var renderOcclusionMap;
    


    function setup() {

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);

        imageRenderer = new Util.ImageRenderer(gl);
        occlusionRenderer = new OcclusionRenderer(gl, 300, 300);

        quadRenderer = new QuadRenderer(gl);
        camera = new Camera2D(CANVAS_SIZE, [0, 0]);

        quads = [];
        quads.push(new Quad(100, 100, [0,0], 0, Util.Color.WHITE));
        quads.push(new Quad(30, 40, [-150,100], 0, Util.Color.WHITE));
        quads.push(new Quad(50, 50, [100,10], 0, Util.Color.WHITE));
        quads.push(new Quad(5, 600, [-200,-100], 30, Util.Color.WHITE));

        new Util.Checkbox("render-occlusion-map", false, value => renderOcclusionMap = value);
    }


    function update() {
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();

        if( renderOcclusionMap ) {
            occlusionRenderer.drawQuads([0,0], ...quads);
            occlusionRenderer.bindTexture(0);
            imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], 300, 300 );
        }else{
            quadRenderer.drawQuads(camera, ...quads);
        }
        
        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Project.start();