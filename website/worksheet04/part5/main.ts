
namespace Sheet4.Part5 {
    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var sphereRenderer: SphereRenderer;
    declare var rotateLight: boolean;
    declare var camera: Util.OrbitalCamera;
    declare var lightDirection: number[];
    declare var frameTimer: Util.FrameTimer;
    declare var ambientColor: Util.Color;
    declare var lightColor: Util.Color;

    
    function setup(){

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        
        lightDirection = [1.0, 0, 0, 0];
        rotateLight = false;

        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 150, 0, 0 );
        
        sphereRenderer = new SphereRenderer(gl);
        
        frameTimer = new Util.FrameTimer("fps-text");

        // Camera controls
        new Util.Slider("camera-distance", 25, 600, 200, 1, (value) => camera.setDistance(value) );
        new Util.Slider("camera-horizontal", -360, 360, 0, 1, (value) => camera.setHorizontalRotation(value) );
        new Util.Slider("camera-vertical", -89, 89, 20, 0.5, (value) => camera.setVerticalRotation(value) );
               
        // Sub division
        new Util.Slider("subdivisions", 0, 8, 0, 1, (numDivisions) => sphereRenderer.setSphere(new Sphere([0,0,0], 50, numDivisions)) );

        // Light Rotation Check box
        new Util.Checkbox("rotate_light", false, (rotate) => rotateLight = rotate);

        // Directional light color picker
        lightColor = null;
        new Util.ColorPicker("directional-light-color", new Util.Color(0.5, 0.5, 0.5), (color) => lightColor = color);

        // Ambient light color picker
        ambientColor = null;
        new Util.ColorPicker("ambient-color", new Util.Color(0.25, 0.25, 0.25), (color) => ambientColor = color);


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
        let timeStep = frameTimer.registerFrame();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // @ts-ignore
        if( rotateLight ) lightDirection = mult(rotateY(-60 * timeStep), lightDirection);

        sphereRenderer.setDirectionalLight(
            lightDirection.slice(0, 3),
            lightColor.asList(false)
        );

        sphereRenderer.setAmbientColor(ambientColor.asList(false));

        sphereRenderer.draw(camera);
        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet4.Part5.start();



