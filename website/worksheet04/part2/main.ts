
namespace Sheet4.Part2 {

    declare var gl;
    declare var sphereRenderer: SphereRenderer;
    declare var rotateCamera: boolean;
    declare var camera: PerspectiveCamera;
    declare var sphere: Sphere;
    declare var previousTime: number;

   

    function setup(){
        const CANVAS_SIZE = [720, 480];
    
        // @ts-ignore
        gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
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
        
        // Sub division
        let subdivisionsSlider = <HTMLInputElement>document.getElementById("subdivisions");
        subdivisionsSlider.oninput =  (e) => {
            sphereRenderer.setSphere(new Sphere([0,0,0], 50, subdivisionsSlider.valueAsNumber));
        };

        // rotateCamera = false;
        sphereRenderer = new SphereRenderer(gl);
        sphereRenderer.setSphere(new Sphere([0,0,0], 50, subdivisionsSlider.valueAsNumber))
                   
    }


    function update(){
        // Update time
        var currentTime = Date.now();
        var timeStep = (currentTime - previousTime)/1000.0;
        previousTime = currentTime;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if( rotateCamera ) camera.rotateY((-Math.PI/3) * timeStep);

        sphereRenderer.draw(camera);
        FPS.registerFrame();
        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet4.Part2.start();



