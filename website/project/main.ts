

namespace Project {

    enum DrawMode {
        NORMAL, // No maps drawn
        OCCLUSION, // Draws occlusion map for all lights
        RAYS, // Draws ray map for selected light
        SHADOW // Draws shadow map for selected light
    }

    const CANVAS_SIZE = [720, 480];
    const FRAME_TIMER = new Util.FrameTimer("fps-text");
    
    declare var gl: WebGLRenderingContext;
    declare var camera: Camera2D;

    // Objects
    declare var lights: Light[];
    declare var sprites: Sprite[];

    // Renderers
    declare var backgroundRenderer: BackgroundRenderer;
    declare var spriteRenderer: SpriteRenderer;
    declare var lightRenderer: LightRenderer;
    declare var selectionRenderer: SelectionRenderer;

    // Settings menus for objects
    declare var lightSettings: LightSettings;
    declare var spriteSettings: SpriteSettings;

    declare var drawMode: DrawMode;
    declare var enableLights: boolean;
    
    // The mouse's position in world coordinates
    declare var mouseWorldPosition: number[];
    declare var mousePressed: boolean;   

    // Variables for handling object movement/selection etc.
    declare var hasDragged: boolean;
    declare var dragOffset: number[];
    declare var dragSelectable: Selectable;
    declare var hoverSelectable: Selectable;
    declare var selected: Selectable;


    export function start() {
        setup();
        update();
    }
    
    //=============================================================================================================================================================================================
    // SETUP

    function setup() {

        // Initialized misc variables
        hasDragged = false;
        dragOffset = [0,0];
        dragSelectable = null;
        hoverSelectable = null;
        selected = null;
        drawMode = DrawMode.NORMAL;

        // Initialize WebGL
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);

        camera = new Camera2D(CANVAS_SIZE, [0, 0]);

        // Creating renderes
        backgroundRenderer = new BackgroundRenderer(gl);
        selectionRenderer = new SelectionRenderer(gl);
        lightRenderer = new LightRenderer(gl, CANVAS_SIZE);
        spriteRenderer = new SpriteRenderer(gl);

        // Setup initial lights and sprites
        lights = [];
        lights.push(new Light([-150,100], 400, new Util.Color(1, 0.5, 0.1)));

        sprites = [];
        sprites.push(new Sprite(75, 75, [-150,-100], 0));
        

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Setup GUI

        // Load sprite textures
        spriteSettings = new SpriteSettings();
        spriteSettings.addTextureOption("/project/sprites/santa.png", "Santa");
        spriteSettings.addTextureOption("/project/sprites/kingpig.png", "Pig King");
        spriteSettings.addTextureOption("/project/sprites/rocket.png", "Space Rocket");
        spriteSettings.addTextureOption("/project/sprites/bomb.png", "Bomb"); 
        spriteSettings.addTextureOption("/project/sprites/donut.png", "Donut");
        spriteSettings.addTextureOption("/project/sprites/box.png", "Box")   
        spriteSettings.addTextureOption("/project/sprites/dwarf.png", "Dwarf")

        // Settings menus
        lightSettings = new LightSettings();

        // Re-center camera button
        new Util.Button("camera-center", () => camera.setPosition([0,0]));

        // Light toggle checkbox
        new Util.Checkbox("enable-lights", true, (enable) => enableLights = enable);

        // Ambient color picker
        new Util.ColorPicker("ambient-color", new Util.Color(0.15, 0.15, 0.15), (newColor) => lightRenderer.setAmbient(newColor));

        // Num rays slider
        new Util.Slider("light-renderer-num-rays", 20, 2000, 300, 1, (numRays) => lightRenderer.setNumRays(numRays));

        // Samples per ray 
        new Util.Slider("light-renderer-num-ray-samples", 20, 2000, 300, 1, (numSamples) => lightRenderer.setNumRaySamples(numSamples));

        // Draw occlusion map
        new Util.Button("draw-occlusionmap", () => drawMode = DrawMode.OCCLUSION );
     
        // Create sprite button
        new Util.Button("create-sprite", () => {
            let newSprite = new Sprite(50, 50, camera.screenToWorld([CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2]), 0);
            sprites.push(newSprite);
            selectObject(newSprite);
        });

        // Create light button
        new Util.Button("create-light", () => {
            let newLight = new Light(camera.screenToWorld([CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2]), 100, Util.Color.WHITE);
            lights.push(newLight);
            selectObject(newLight);
        });


        // Button: Draw ray map for this light on screen
        new Util.Button("light-settings-raymap", () => {
            let light = lightSettings.getLight(); 
            if( light != null ) {
                // Light must be last in list.. (bad implementation)
                lights.splice(lights.indexOf(light), 1);
                lights.push(light);
                drawMode = DrawMode.RAYS;                   
            }
        });

        // Button: Draw shadow map for this on the screen
        new Util.Button("light-settings-shadowmap", () => {
            let light = lightSettings.getLight(); 
            if( light != null ) {
                // Light must be last in list.. (bad implementation)
                lights.splice(lights.indexOf(light), 1);
                lights.push(light);
                drawMode = DrawMode.SHADOW;                   
            }
        });


        
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Mouse events 

        mousePressed = false;
        let canvas = <HTMLCanvasElement> document.getElementById("canvas");
        canvas.onmousedown = (e) => {
            mousePressed = true;

            hasDragged = false;
            dragSelectable = checkCollisions();
            if( dragSelectable !== null ){
                //@ts-ignore
                dragOffset = subtract(dragSelectable.getPosition(), mouseWorldPosition);
                hoverSelectable = null;
            }


            e.preventDefault(); 
        }

        // Mouse move
        canvas.onmousemove = (e) => {
            mouseWorldPosition = camera.screenToWorld([e.offsetX,e.offsetY]);

            // Make sure we don't get hover effects when dragging
            hoverSelectable = null;

            if( mousePressed ) {
                hasDragged = true;
                if( dragSelectable !== null ){
                    // Drag object which was hovered at mouse down
                    dragSelectable.setPosition([mouseWorldPosition[0]+dragOffset[0], mouseWorldPosition[1]+dragOffset[1]]);
                }else if( e.altKey ) {
                    // Camera zzom
                    camera.adjustZoom(e.movementY  / 100.0);
                }else{
                    // Camera movement
                    camera.adjustPosition(-e.movementX, e.movementY);
                }
            } else {
                // Re-check if anything is hovered
                hoverSelectable = checkCollisions(); 
            }
        }

        // Mouse release
        canvas.onmouseup = (e) => {
            mousePressed = false;
            if( !hasDragged ){
                // The mouse was clicked on the canvas (no draggin)
                if( dragSelectable !== null )
                    // New object selected
                    selectObject(dragSelectable);
                else
                    // Selection cleared
                    selectObject(null);
            }else{
                // "Re-hover" the selectable
                hoverSelectable = checkCollisions();
            }
            dragSelectable = null;
            e.preventDefault();
        }

        // Mouse leave canvas
        canvas.onmouseleave = (e) => {
            // clear selection
            mousePressed = false;
            dragSelectable = null;
            e.preventDefault();
        }

        // Delete object
        document.onkeydown = (e) => {
            if( e.code == "Delete") {
                if( selected != null ) {
                    if( selected instanceof Light) lights.splice(lights.indexOf(selected), 1);
                    if( selected instanceof Sprite) sprites.splice(sprites.indexOf(selected), 1);
                    selectObject(null);
                    hoverSelectable = null;
                    dragSelectable = null;
                }
            }
        }
    }


    //=======================================================================================================================================================================================================
    // Update function
    
    function update() {
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();

        gl.disable(gl.BLEND);
        backgroundRenderer.drawBackground(camera);
        
        spriteRenderer.drawQuads(camera, ...sprites);

        if( enableLights)
            lightRenderer.draw(camera, sprites, lights);

        gl.disable(gl.BLEND);
       

        if( hoverSelectable !== null )
            selectionRenderer.draw(camera, hoverSelectable.getCollisionPoints(), new Util.Color(1,1,1,0.75));

        if( dragSelectable !== null )
            selectionRenderer.draw(camera, dragSelectable.getCollisionPoints(), new Util.Color(1,1,1,0.75));

        if( selected !== null )
            selectionRenderer.draw(camera, selected.getCollisionPoints(), Util.Color.WHITE);

        if( drawMode == DrawMode.OCCLUSION ) {
            lightRenderer.drawOcclusionMap(CANVAS_SIZE);
        }
        if( drawMode ==DrawMode.RAYS ) {
            // Draw ray map of last light in list
            lightRenderer.drawRayMap(CANVAS_SIZE);
        }
        if( drawMode == DrawMode.SHADOW ) {
            // Draw ray map of last light in list
            lightRenderer.drawShadowMap(CANVAS_SIZE);
        }
        
        requestAnimationFrame(update);
    }


    //=======================================================================================================================================================================================================
    // Object selection

    /**
     * Set the selected object to the given object, resetting
     * drawing mode (i.e. removing maps), and displaying correct
     * settings.
     * 
     * @param object    Object to select
     */
    function selectObject(object: Selectable){
        // We reset draw mode when we re-select or de-selct
        drawMode = DrawMode.NORMAL;

        lightSettings.hide(true);
        spriteSettings.hide(true);
        
        if( object instanceof Light ) {
            lightSettings.hide(false);
            lightSettings.setLight(<Light>object);
        }

        if( object instanceof Sprite ){
            spriteSettings.hide(false);
            spriteSettings.setSprite(<Sprite>object);
        }

        selected = object;
    }



    //=======================================================================================================================================================================================================
    // Mouse collision detection 
    
    /**
     * Tests if the mouse collides with either a light or sprite
     * @return  The Selectable (interface) which was collides with
     */
    function checkCollisions(){

        // Light collision
        for( let i=lights.length-1; i>=0; i--){
            let light = lights[i];
            let points = light.getCollisionPoints();
            
            let collision = 
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[1], points[2]]) ||
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[2], points[3]]);

            if( collision ) return light;
        }

        // Sprite collision
        for( let i=sprites.length-1; i>=0; i--){
            let sprite = sprites[i];
            let points = sprite.getCollisionPoints();
            
            let collision = 
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[1], points[2]]) ||
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[2], points[3]]);

            if( collision ) return sprite;
        }
        return null;
    }


    /**
     * Checks if a the given points collides with given triangle, which is defined
     * by 3 points.
     */
    function pointCollidesWithTriangle(point: number[], triangle: number[][]) {
        let triangleArea = Math.abs( 
            (triangle[1][0]-triangle[0][0])*(triangle[2][1]-triangle[0][1])
            - 
            (triangle[2][0]-triangle[0][0])*(triangle[1][1]-triangle[0][1])
        );;

        let area1 =    Math.abs( (triangle[0][0]-point[0])*(triangle[1][1]-point[1]) - (triangle[1][0]-point[0])*(triangle[0][1]-point[1]) );
        let area2 =    Math.abs( (triangle[1][0]-point[0])*(triangle[2][1]-point[1]) - (triangle[2][0]-point[0])*(triangle[1][1]-point[1]) );
        let area3 =    Math.abs( (triangle[2][0]-point[0])*(triangle[0][1]-point[1]) - (triangle[0][0]-point[0])*(triangle[2][1]-point[1]) );

        let areaDiff = Math.abs(area1 + area2 + area3 - triangleArea);
        // Not sure about the floating point precision in typescript
        // so we check they are "equal" with some error
        // like this
        
        return areaDiff < 0.0001;
    }
}

Project.start();