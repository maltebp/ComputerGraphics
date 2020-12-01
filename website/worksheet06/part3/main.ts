
namespace Sheet6.Part3 {

    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var frameTimer: Util.FrameTimer;
    declare var camera: Util.OrbitalCamera;

    declare var sphere: Sphere;
    declare var renderer: SphereRenderer;

    declare var texture: Util.Texture;    
        
    declare var lightDirection: number[];
    declare var ambientColor: Util.Color;
    declare var lightColor: Util.Color;
    declare var rotateLight: boolean;
    declare var rotateGlobe: boolean;


    
    function setup(){
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        frameTimer = new Util.FrameTimer("fps-text");
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 150, 0, 0);

        sphere = new Sphere([0,0,0], 50, 8);
        renderer = new SphereRenderer(gl);
        renderer.setSphere(sphere);

        // Loading texture
        texture = null;
        Util.Texture.createFromImage(gl, "earth.jpg")
            .setChannels(4)
            .setFilter(gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR)
            .setWrap(gl.REPEAT, gl.REPEAT)
            .build((newTexture) => texture = newTexture);

         // Camera controls
         new Util.Slider("camera-distance", 60, 1000, 200, 1, (value) => camera.setDistance(value) );
         new Util.Slider("camera-horizontal", -360, 360, 0, 0.5, (value) => camera.setHorizontalRotation(value) );
         new Util.Slider("camera-vertical", -89, 89, 20, 0.5, (value) => camera.setVerticalRotation(value) );     

        // Globe Rotation Check box
        new Util.Checkbox("globe-rotate", false, (rotate) => rotateGlobe = rotate);
        
        // Light Rotation Check box
        lightDirection = [0.4, 0, -0.7, 0];
        new Util.Checkbox("rotate_light", false, (rotate) => rotateLight = rotate);

         // Directional light color picker
         lightColor = null;
         new Util.ColorPicker("directional-light-color", new Util.Color(0.5, 0.5, 0.5), (color) => lightColor = color);
 
         // Ambient light color picker
         ambientColor = null;
         new Util.ColorPicker("ambient-color", new Util.Color(0.25, 0.25, 0.25), (color) => ambientColor = color);

    }



    function update(){
        let timeStep = frameTimer.registerFrame();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if( texture !== null ){
            texture.bind(0);

            // @ts-ignore
            if( rotateLight ) lightDirection = mult(rotateY(-60 * timeStep), lightDirection);
            if( rotateGlobe ) sphere.rotateY(-30 * timeStep);

            renderer.setDirectionalLight(
                lightDirection.slice(0, 3),
                lightColor.asList(false)
            );

            renderer.setAmbientColor(ambientColor.asList(false));

            renderer.draw(camera);
        }

        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet6.Part3.start();



