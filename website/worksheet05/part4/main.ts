
namespace Sheet5.Part4 {
    declare var gl;

    declare var rotateCamera: boolean;
    declare var rotateLight: boolean;
    declare var camera: Util.OrbitalCamera;
    
    declare var lightDirection: number[];
    
    declare var previousTime: number;
    
    declare var renderer: ModelRenderer;
    declare var model: Model;

    
    function setup(){

        const CANVAS_SIZE = [720, 480];
    
        // @ts-ignore
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        

        lightDirection = [1.0, 0, 0, 0];

        previousTime = Date.now();
        
        rotateCamera = false;
        rotateLight = false;

        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0, 2.5, 0], 45, 8, 0, 0);

        renderer = new ModelRenderer(gl);

        // Load Model
        model = null;
        Util.loadObjFile("/models/Tree.obj", 1.0, false, (obj) => {
            console.log(obj.getDrawingInfo());
            model = new Model(gl, obj, [0,0,0], 1.0);
        });


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
            camera.setVerticalRotation(cameraSlider.valueAsNumber);
        };
        camera.setVerticalRotation(cameraSlider.valueAsNumber);

        // Material sliders
        let materialAmbientSlider = <HTMLInputElement>document.getElementById("mat-slider-ambient");
        let materialDiffuseSlider = <HTMLInputElement>document.getElementById("mat-slider-diffuse");
        let materialSpecularSlider = <HTMLInputElement>document.getElementById("mat-slider-specular");
        let materialShineSlider = <HTMLInputElement>document.getElementById("mat-slider-shine");

        var updateMaterial = (e) => {
            renderer.setMaterial(
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
        if( rotateCamera ) camera.adjustHorizontalRotation(-60 * timeStep);

        // @ts-ignore
        if( rotateLight ) lightDirection = mult(rotateY(-60 * timeStep), lightDirection);

        var lightColor = Util.hexToRgb((<HTMLInputElement>document.getElementById("directional-light-color")).value);
        renderer.setDirectionalLight(
            lightDirection.slice(0, 3),
            [lightColor.r/255, lightColor.g/255, lightColor.b/255]
        );

        var ambientColor = Util.hexToRgb((<HTMLInputElement> document.getElementById("ambient-color")).value);
        renderer.setAmbientColor([ambientColor.r/255, ambientColor.g/255, ambientColor.b/255]);


        // Render model
        if( model != null )
            renderer.draw(camera, model);

        FPS.registerFrame();
        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet5.Part4.start();



