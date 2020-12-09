

namespace Project {

    enum DrawMode {
        NORMAL,
        OCCLUSION,
        RAYS,
        SHADOW,
        LIGHT
    }

    const CANVAS_SIZE = [720, 480];

    const FRAME_TIMER = new Util.FrameTimer("fps-text");
    
    declare var gl: WebGLRenderingContext;

    declare var quadRenderer: QuadRenderer;
    declare var camera: Camera2D;
    declare var lightRenderer: LightRenderer;
    declare var backgroundRenderer: BackgroundRenderer;

    declare var selectionRenderer: SelectionRenderer;


    declare var lights: Light[];
    declare var quads: Quad[];

    declare var drawMode: DrawMode;
    
    // The mouse's position in world coordinates
    declare var mouseWorldPosition: number[];
    declare var mousePressed: boolean;   

    declare var hasDragged: boolean;
    declare var dragOffset: number[];
    declare var dragSelectable: Selectable;
    declare var hoverSelectable: Selectable;
    declare var selected: Selectable;

    declare var lightSettings: LightSettings;
    declare var spriteSettings: SpriteSettings;
    
    
    function setup() {

        hasDragged = false;
        dragOffset = [0,0];
        dragSelectable = null;
        hoverSelectable = null;
        selected = null;

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.ALWAYS); //TODO: Remove this at some point

        
        backgroundRenderer = new BackgroundRenderer(gl);

        selectionRenderer = new SelectionRenderer(gl);
        
        lights = [];
        lights.push(new Light([-125,-100], 200, Util.Color.BLUE));
        lights.push(new Light([0,0], 300, Util.Color.GREEN));
        lights.push(new Light([150,-75], 200, Util.Color.YELLOW));
        lights.push(new Light([-200, 250], 200, Util.Color.RED));
        lightRenderer = new LightRenderer(gl);

        quadRenderer = new QuadRenderer(gl);
        camera = new Camera2D(CANVAS_SIZE, [0, 0]);

        quads = [];
        quads.push(new Quad(100, 100, [0,-120], 0));
        quads.push(new Quad(30, 40, [50,50], 0));
        quads.push(new Quad(10, 10, [100,10], 0));
        quads.push(new Quad(5, 200, [-200,-100], 0));

        // Drawing mode radio group
        drawMode = DrawMode.NORMAL;
        new Util.RadioGroup<DrawMode>((mode) => drawMode = mode )
            .addOption("draw-mode-normal", DrawMode.NORMAL)
            .addOption("draw-mode-occlusion", DrawMode.OCCLUSION)
            .addOption("draw-mode-rays", DrawMode.RAYS)
            .addOption("draw-mode-shadow", DrawMode.SHADOW)
            .check(0)
            ;

        // Ambient color picker
        new Util.ColorPicker("ambient-color", new Util.Color(0.15, 0.15, 0.15), (newColor) => lightRenderer.setAmbient(newColor));

        // Create sprite button
        new Util.Button("create-sprite", () => {
            let newSprite = new Quad(100, 100, camera.screenToWorld([CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2]), 0);
            quads.push(newSprite);
            selectObject(newSprite);
        });

        // Create light button
        new Util.Button("create-light", () => {
            let newLight = new Light(camera.screenToWorld([CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2]), 100, Util.Color.WHITE);
            lights.push(newLight);
            selectObject(newLight);
        });

        // Settings menus
        lightSettings = new LightSettings();

        // Load sprite textures
        spriteSettings = new SpriteSettings();
        spriteSettings.addTextureOption("/project/sprites/santa.png", "Santa");
        spriteSettings.addTextureOption("/project/sprites/kingpig.png", "Pig King");
        spriteSettings.addTextureOption("/project/sprites/rocket.png", "Space Rocket");
        spriteSettings.addTextureOption("/project/sprites/bomb.png", "Bomb");
        spriteSettings.addTextureOption("/project/sprites/donut.png", "Donut");
        spriteSettings.addTextureOption("/project/sprites/box.png", "Box")   
        spriteSettings.addTextureOption("/project/sprites/dwarf.png", "Dwarf")   


        

        // Mouse Events
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
        canvas.onmouseleave = (e) => {
            mousePressed = false;
            dragSelectable = null;
            e.preventDefault();
        }
        canvas.onmouseup = (e) => {
            mousePressed = false;     
            if( dragSelectable !== null && !hasDragged ){
                selectObject(dragSelectable);
            } else {
                hoverSelectable = checkCollisions();
                // Clear selection if clicked on nothing
                if( hoverSelectable === null ) selectObject(null);
            }
            dragSelectable = null;
            e.preventDefault();
        }
        canvas.onmousemove = (e) => {
            mouseWorldPosition = camera.screenToWorld([e.offsetX,e.offsetY]);

            // Make sure we don't get hover effects when dragging
            hoverSelectable = null;

            if( mousePressed ) {
                if( dragSelectable !== null ){
                    dragSelectable.setPosition([mouseWorldPosition[0]+dragOffset[0], mouseWorldPosition[1]+dragOffset[1]]);
                    hasDragged = true;
                }else if( e.altKey ) {
                    camera.adjustZoom(e.movementY  / 100.0);
                }else{
                    camera.adjustPosition(-e.movementX, e.movementY);
                }
            } else {
                hoverSelectable = checkCollisions(); 
            }
        }

        document.onkeydown = (e) => {
            if( e.code == "Delete") {
                if( selected != null ) {
                    if( selected instanceof Light) lights.splice(lights.indexOf(selected), 1);
                    if( selected instanceof Quad) quads.splice(quads.indexOf(selected), 1);
                    
                    selectObject(null);
                    hoverSelectable = null;
                    dragSelectable = null;
                }
            }
        }
    }


    function checkCollisions(){
        for( let i=0; i<lights.length; i++){
            let light = lights[i];
            let points = light.getCollisionPoints();
            
            let collision = 
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[1], points[2]]) ||
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[2], points[3]]);

            if( collision ) return light;
        }

        for( let i=0; i<quads.length; i++){
            let quad = quads[i];
            let points = quad.getCollisionPoints();
            
            let collision = 
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[1], points[2]]) ||
                pointCollidesWithTriangle(mouseWorldPosition, [points[0], points[2], points[3]]);

            if( collision ) return quad;
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
        // Not sure about the floating point precision,
        // so we check they are "equal" with some error
        // like this
        
        return areaDiff < 0.0001;
    }


    function selectObject(object: Selectable){
        lightSettings.hide(true);
        spriteSettings.hide(true);
        
        if( object instanceof Light ) {
            lightSettings.hide(false);
            lightSettings.setLight(<Light>object);
        }

        if( object instanceof Quad ){
            spriteSettings.hide(false);
            spriteSettings.setSprite(<Quad>object);
        }

        selected = object;
    }

    
    function update() {
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        FRAME_TIMER.registerFrame();

        gl.disable(gl.BLEND);
        backgroundRenderer.drawBackground(camera);
        
        quadRenderer.drawQuads(camera, ...quads);

        lightRenderer.draw(camera, quads, lights);

        gl.disable(gl.BLEND);

        if( drawMode == DrawMode.OCCLUSION ) {
            lightRenderer.drawOcclusionMap(CANVAS_SIZE);
        }
        if( drawMode ==DrawMode.RAYS ) {
            lightRenderer.drawRayMap(CANVAS_SIZE);
        }
        if( drawMode == DrawMode.SHADOW ) {
            lightRenderer.drawShadowMap(CANVAS_SIZE);
        }

        if( hoverSelectable !== null )
            selectionRenderer.draw(camera, hoverSelectable.getCollisionPoints(), new Util.Color(1,1,1,0.75));

        if( dragSelectable !== null )
            selectionRenderer.draw(camera, dragSelectable.getCollisionPoints(), new Util.Color(1,1,1,0.75));

        if( selected !== null )
            selectionRenderer.draw(camera, selected.getCollisionPoints(), Util.Color.WHITE);

        
        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }


    // Class to group together html elements for light settings
    class LightSettings {
        private htmlGroup: HTMLElement;
        private color: Util.ColorPicker;
        private radius: Util.Slider;
        
        private light: Light = null;

        constructor(){
            this.htmlGroup = <HTMLElement>document.getElementById("light-settings");

            this.color = new Util.ColorPicker("light-settings-color", Util.Color.WHITE, newColor => {
                if( this.light !== null ) this.light.setColor(newColor);
            });

            this.radius = new Util.Slider("light-settings-radius", 2, 1000, 100, 1, radius => {
                if( this.light !== null ) this.light.setRadius(radius);
            });

            this.hide(true);
        }

        setLight(light: Light){
            this.light = null;
            this.color.setColor(light.getColor());
            this.radius.setValue(light.getRadius());
            this.light = light;
        }

        hide(toggle: boolean) {
            this.htmlGroup.hidden = toggle;
        }
    }


    // Class to group together html elements for sprite settings
    class SpriteSettings {
        private htmlGroup: HTMLElement;
        private width: Util.Slider;
        private height: Util.Slider;
        private rotation: Util.Slider;
        private texture: Util.DropdownMenu<Util.Texture>;
        private color: Util.ColorPicker;
        private diffuse: Util.Slider;
        private occluder: Util.Checkbox;
        
        private quad: Quad = null;

        constructor(){
            this.htmlGroup = <HTMLElement>document.getElementById("sprite-settings");

            this.width = new Util.Slider("sprite-settings-width", 2, 1000, 100, 1, width => {
                if( this.quad !== null ) this.quad.setWidth(width);
            });

            this.height = new Util.Slider("sprite-settings-height", 2, 1000, 100, 1, height => {
                if( this.quad !== null ) this.quad.setHeight(height);
            });

            this.rotation = new Util.Slider("sprite-settings-rotation", 0, 360, 0, 0.25, rotation => {
                if( this.quad !== null ) this.quad.setRotation(rotation);
            });

            this.texture = new Util.DropdownMenu<Util.Texture>("sprite-settings-texture", (texture) => {
                if( this.quad !== null ) this.quad.setTexture(texture);
            });
            this.texture.addOption("None", null);

            this.color = new Util.ColorPicker("sprite-settings-color", Util.Color.WHITE, newColor => {
                if( this.quad !== null ) this.quad.setColor(newColor);
            });

            this.diffuse = new Util.Slider("sprite-settings-diffuse", 0, 1, 0.8, 0.01, diffuse => {
                if( this.quad !== null ) this.quad.setDiffuseFactor(diffuse);
            });

            this.occluder = new Util.Checkbox("sprite-settings-occluder", true, occlude => {
                if( this.quad !== null ) this.quad.setOccluder(occlude);
            });

           
            this.hide(true);
        }


        addTextureOption(path: string, name: string){
            Util.Texture.createFromImage(gl, path)
                .setChannels(4)
                .setFilter(gl.LINEAR, gl.LINEAR)
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
                .build((texture) => this.texture.addOption(name, texture));
        }


        setSprite(sprite: Quad){
            this.quad = null;
            this.width.setValue(sprite.getWidth());
            this.height.setValue(sprite.getHeight());
            this.rotation.setValue(sprite.getRotation());
            this.texture.setOptionByValue(sprite.getTexture());
            this.color.setColor(sprite.getColor());
            this.diffuse.setValue(sprite.getDiffuseFactor());
            this.occluder.check(sprite.isOccluder());
            this.quad = sprite;
        }

        hide(toggle: boolean) {
            this.htmlGroup.hidden = toggle;
        }
    }

}

Project.start();