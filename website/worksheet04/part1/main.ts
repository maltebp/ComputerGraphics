
namespace Sheet4.Part1 {
    declare var gl;
    declare var sphereRenderer: SphereRenderer;
    declare var rotateCamera: boolean;
    declare var camera: PerspectiveCamera;
    declare var sphere: Sphere;

    function update(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if( rotateCamera) camera.rotateY(0.01);
        sphereRenderer.draw(sphere, camera);
        requestAnimationFrame(update);
    }

    function setup(){
        const CANVAS_SIZE = [720, 480];
        
        // @ts-ignore
        gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        
        camera = new PerspectiveCamera(CANVAS_SIZE, [-150, 0, -150], [0,0,0], 45);
        // rotateCamera = false;
        sphereRenderer = new SphereRenderer(gl);
        
        gl.clear(gl.COLOR_BUFFER_BIT);
        sphere = new Sphere([0,0,0], 50, 2);
        
        rotateCamera = false;
        
        // Rotation Check box
        document.getElementById("rotate").onchange =  (e) => {
            rotateCamera = !rotateCamera;
        };

        // Camera height (lookat eye y component)
        let cameraSlider = <HTMLInputElement>document.getElementById("camera-height");
        cameraSlider.oninput =  (e) => {
            camera.setY(cameraSlider.valueAsNumber);
        };
        camera.setY(cameraSlider.valueAsNumber);
        
        // Cube size slider
        let subdivisionsSlider = <HTMLInputElement>document.getElementById("subdivisions");
        subdivisionsSlider.oninput =  (e) => {
            sphere.setSubdivisions(subdivisionsSlider.valueAsNumber);
        };
        sphere.setSubdivisions(subdivisionsSlider.valueAsNumber);
                    
    }

    export function start(){
        setup();
        update();
    }
}

Sheet4.Part1.start();



