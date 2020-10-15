
namespace Sheet4.Part5 {
    declare var gl;

    declare var sphereRenderer: SphereRenderer;
    declare var rotateCamera: boolean;
    declare var rotateLight: boolean;
    declare var camera: PerspectiveCamera;

    declare var lightDirection: number[];

    declare var previousTime: number;

    
    function setup(){

        const CANVAS_SIZE = [720, 480];
    
        // @ts-ignore
        gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        
        camera = new PerspectiveCamera(CANVAS_SIZE, [0, 0, -150], [0,0,0], 45);

        lightDirection = [1.0, 0, 0, 0];

        previousTime = Date.now();
        
        rotateCamera = false;
        rotateLight = false;

        // FPS
        FPS.textElement = <HTMLParagraphElement> document.getElementById("fps-text");
        
        // Camera Rotation Check box
        document.getElementById("rotate_camera").onchange =  (e) => {
            rotateCamera = !rotateCamera;
        };

        // Light Rotation Check box
        document.getElementById("rotate_light").onchange =  (e) => {
            rotateLight = !rotateLight;
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
            sphereRenderer.setSphere(new Sphere([0,0,0], 50, subdivisionsSlider.valueAsNumber));
        };

        // rotateCamera = false;
        sphereRenderer = new SphereRenderer(gl);
        sphereRenderer.setSphere(new Sphere([0,0,0], 50, subdivisionsSlider.valueAsNumber))


        // Material sliders
        let materialAmbientSlider = <HTMLInputElement>document.getElementById("mat-slider-ambient");
        let materialDiffuseSlider = <HTMLInputElement>document.getElementById("mat-slider-diffuse");
        let materialSpecularSlider = <HTMLInputElement>document.getElementById("mat-slider-specular");
        let materialShineSlider = <HTMLInputElement>document.getElementById("mat-slider-shine");

        var updateMaterial = (e) => {
            sphereRenderer.setMaterial(
                materialAmbientSlider.valueAsNumber,
                materialDiffuseSlider.valueAsNumber,
                materialSpecularSlider.valueAsNumber,
                materialShineSlider.valueAsNumber
            );
        }

        materialAmbientSlider.oninput = updateMaterial;
        materialDiffuseSlider.oninput = updateMaterial;
        materialSpecularSlider.oninput = updateMaterial;
        materialShineSlider.oninput = updateMaterial;
    }


    function update(){
        // Update time
        var currentTime = Date.now();
        var timeStep = (currentTime - previousTime)/1000.0;
        previousTime = currentTime;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if( rotateCamera ) camera.rotateY((-Math.PI/3) * timeStep);

        // @ts-ignore
        if( rotateLight ) lightDirection = mult(rotateY(-60 * timeStep), lightDirection);

        // @ts-ignore
        var lightColor = hexToRgb(document.getElementById("directional-light-color").value);
        sphereRenderer.setDirectionalLight(
            lightDirection.slice(0, 3),
            [lightColor.r/255, lightColor.g/255, lightColor.b/255]
        );

        // @ts-ignore
        var ambientColor = hexToRgb(document.getElementById("ambient-color").value);
        sphereRenderer.setAmbientColor([ambientColor.r/255, ambientColor.g/255, ambientColor.b/255]);
        sphereRenderer.draw(camera);
        FPS.registerFrame();
        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet4.Part5.start();



