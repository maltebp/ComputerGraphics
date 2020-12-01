
namespace Sheet3.Part1 {

    declare var gl: WebGLRenderingContext;
    declare var cubeRenderer: CubeRenderer;
    declare var rotateCamera: boolean;
    declare var camera: Util.OrthographicCamera;
    declare var cube: Cube;


    function update(){
        gl.clear(gl.COLOR_BUFFER_BIT);
        if( rotateCamera) camera.rotateY(0.01);
        cubeRenderer.drawWireFrame(cube, camera);
        requestAnimationFrame(update);
    }


    function setup(){
        const CANVAS_SIZE = [720, 480];
        
        // @ts-ignore
        gl =Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        
        camera = new Util.OrthographicCamera(CANVAS_SIZE, [-200,100,-200], [0,0,0]);
        cubeRenderer = new CubeRenderer(gl);
        
        gl.clear(gl.COLOR_BUFFER_BIT);
        cube = new Cube();
        
        // Rotation Check box
        rotateCamera = false;
        new Util.Checkbox("rotate", false, (val) => rotateCamera = val);

        // Camera height (lookat eye y component)
        //  type="range" min="-500" max="500" value="0"
        new Util.Slider("camera-height", -500, 500, 0, 1, (height) => camera.setY(height))
        
        // Cube size slider
        //  min="10" max="500" value="200"
        new Util.Slider("cube-size", 10, 500, 200, 1, (size) => cube.setSize(size));                    
    }

    export function start(){
        setup();
        update();
    }
}

Sheet3.Part1.start();



