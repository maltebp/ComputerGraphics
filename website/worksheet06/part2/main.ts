
namespace Sheet6.Part2 {

    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var frameTimer: Util.FrameTimer;
    declare var camera: Util.OrbitalCamera;
    declare var renderer: Renderer;
    declare var texture: Util.Texture;
    

    // Creates checkerboard texture
    function createCheckerboardTexture() {

        // Construct image data
        var data = Array<number>();
        for( var y=0; y<64; y++ ) {
            for( var x=0; x<64; x++ ) {
                var black = (Math.floor(x/8) + Math.floor(y/8)) % 2 == 0;
                var color = black ? [0, 0, 0, 1] : [255, 255, 255, 1];
                color.forEach((e) => data.push(e));
            } 
        } 
        var dataFlattened = new Uint8Array(data);

        // Build the gl texture
        Util.Texture.createFromData(gl, dataFlattened, 64, 64)
                    .setChannels(4)
                    .setFilter(gl.NEAREST, gl.NEAREST)
                    .setWrap(gl.REPEAT, gl.REPEAT)
                    .loadMipmaps()
                    .build((newTexture) => {
                        texture = newTexture;
                        newTexture.bind(0);
                    });
    }



    function setup(){
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 

        frameTimer = new Util.FrameTimer("fps-text");
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 90, 100, 0, 0);

        renderer = new Renderer(gl);

        texture = null;
        createCheckerboardTexture();

         // Camera controls
         new Util.Slider("camera-distance", 0, 100, 35, 0.5, (value) => camera.setDistance(value) );
         new Util.Slider("camera-horizontal", -360, 360, 0, 0.5, (value) => camera.setHorizontalRotation(value) );
         new Util.Slider("camera-vertical", -89, 89, 20, 0.5, (value) => camera.setVerticalRotation(value) );     
        
        // Wrap options
        new Util.RadioGroup<number>((wrap) => {
            texture.setWrap(wrap, wrap);
        })
        .addOption("wrap-mode-repeat", gl.REPEAT)
        .addOption("wrap-mode-clamp", gl.CLAMP_TO_EDGE)
        .check(0);
        ;

        // Minification filter options
        new Util.RadioGroup<number>((filter) => {
            texture.setMinificationFilter(filter);
        })
        .addOption("minfilter-mode-nearest", gl.NEAREST)
        .addOption("minfilter-mode-linear", gl.LINEAR)
        .addOption("minfilter-mode-mipmap-n-l", gl.NEAREST_MIPMAP_LINEAR)
        .addOption("minfilter-mode-mipmap-l-l", gl.LINEAR_MIPMAP_LINEAR)
        .addOption("minfilter-mode-mipmap-n-n", gl.NEAREST_MIPMAP_NEAREST)
        .addOption("minfilter-mode-mipmap-l-n", gl.LINEAR_MIPMAP_NEAREST )
        .check(0);

        // Magnification filter options
        new Util.RadioGroup<number>( (filter) => {
            texture.setMagnificationFilter(filter);
        })
        .addOption("magfilter-mode-nearest", gl.NEAREST)
        .addOption("magfilter-mode-linear", gl.LINEAR)
        .check(0);
        ;
    }


    function update(){
        frameTimer.registerFrame();
        
        gl.clear(gl.COLOR_BUFFER_BIT );

        if( texture !== null )
            renderer.drawQuad(camera,
                // Quad laying flat on the xz plane 
                [0, 0, 0], 100, 500, [90, 0, 0]
            );

        requestAnimationFrame(update);
    }

    export function start(){
        setup();
        update();
    }
}

Sheet6.Part2.start();



