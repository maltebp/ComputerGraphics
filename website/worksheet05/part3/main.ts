
namespace Sheet5.Part3 {

    declare var gl;
    declare var rotateCamera: boolean;
    declare var camera: PerspectiveCamera;
    declare var previousTime: number;   

    function setup(){
        const CANVAS_SIZE = [720, 480];
    
        // @ts-ignore
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        
        previousTime = Date.now();
        
        rotateCamera = false;

        // FPS
        FPS.textElement = <HTMLParagraphElement> document.getElementById("fps-text");
        
        camera = new PerspectiveCamera(CANVAS_SIZE, [0, 0, -150], [0,0,0], 45);

        // Camera Rotation Check box
        document.getElementById("rotate_camera").onchange =  (e) => {
            rotateCamera = !rotateCamera;
        };

        // Camera height (lookat eye y component)
        let cameraSlider = <HTMLInputElement>document.getElementById("camera-height");
        cameraSlider.oninput =  (e) => {
            camera.setY(cameraSlider.valueAsNumber);
        };
        camera.setY(cameraSlider.valueAsNumber);
                   
    }


    function update(){
        // Update time
        var currentTime = Date.now();
        var timeStep = (currentTime - previousTime)/1000.0;
        previousTime = currentTime;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if( rotateCamera ) camera.rotateY((-Math.PI/3) * timeStep);

        requestAnimationFrame(update);
    }

    export function start(){
        // setup();
        // update();
        ObjUtil.loadFile("/models/Tree.obj", 1.0, false, (obj) => {
            console.log("Loaded object file!");
            console.log(obj.isMTLComplete());
            console.log(obj);
            console.log(obj.getDrawingInfo());
        });
    }
}

Sheet5.Part3.start();



