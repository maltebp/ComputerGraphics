

namespace Sheet2.Part3 {

    const CANVAS_SIZE = [720, 480];

    enum DrawMode {
        POINT = "point",
        TRIANGLE = "triangle"
    };

    declare var gl: WebGLRenderingContext;
    declare var layerMenu: LayerMenu;
    declare var layers: Layer[];
    declare var trianglePoints: Point[];
    declare var drawMode: DrawMode;
    declare var pointSizeSlider: Util.Slider;


    function setup() {        

        var canvas = document.getElementById("canvas");
        gl =Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);

        gl.enable(gl.DEPTH_TEST);

        trianglePoints = [];

        // Setup layer menu, and create initial layer
        layerMenu = new LayerMenu("layer_menu_list");
        layerMenu.onLayerChange((oldLayer, newLayer) => {
            clearDrawState(oldLayer);
        });
        layers = [];
        createLayer();

        // Setup color pickers
        let clearColorPicker = new Util.ColorPicker("clear-color", Util.Color.CORNFLOWER_BLUE);
        let drawColorPicker = new Util.ColorPicker("draw-color", Util.Color.WHITE);

        // Create layer
        new Util.Button('layer_menu_create', () => createLayer() );

        // Delete layer
        new Util.Button('layer_menu_delete', () => deleteSelectedLayer())

        // Clear canvas
        new Util.Button('clear-canvas', () => clearAll(clearColorPicker.getColor()) );

        // Slider which determines point size
        pointSizeSlider = new Util.Slider("point-size", 1, 100, 20, 1 );

        // Draw mode group
        drawMode = DrawMode.POINT;
        let drawModeGroup = new Util.RadioGroup<DrawMode>((mode) => {
            clearDrawState();
            drawMode = mode;
            pointSizeSlider.disable(drawMode !== DrawMode.POINT);
        });
        drawModeGroup.addOption("draw-mode-point", DrawMode.POINT);
        drawModeGroup.addOption("draw-mode-triangle", DrawMode.TRIANGLE);
        drawModeGroup.check(0);


        // Mouse click: Draw
        canvas.onmousedown = e => {
            var layer = layerMenu.getSelectedLayer();
            if( layer == null ) alert("No layer is selected");
            else draw(layer, e.offsetX, CANVAS_SIZE[1]-e.offsetY, drawColorPicker.getColor(), drawMode);    
        };

        // Hotkeys
        document.onkeydown = e => {
            console.log(e.code);

            switch(e.code) {
                
                case 'KeyD':
                    clearSelectedLayer();
                    break;
                case 'KeyC':
                    clearAll(clearColorPicker.getColor());
                    break;
                case 'KeyH':
                    toggleLayerVisibility();
                    break;
                case 'Escape':
                    clearDrawState(layerMenu.getSelectedLayer());
                    break;
            }    
        }

        clearAll(clearColorPicker.getColor());
    }
    

    function draw(layer: Layer, x: number, y: number, color: Util.Color, drawMode: DrawMode){
        
        switch(drawMode){
            case DrawMode.POINT:
                drawPoint(layer, x, y, color);
                break;
            case DrawMode.TRIANGLE:
                drawTriangle(layer, x, y, color);
                break;
            default:
                alert("Unknown draw mode!");
        }
    }
        

    function clearAll(color: Util.Color){
        clearDrawState();
        gl.clearColor(color.getRed(), color.getGreen(), color.getBlue(), 1.0); 
        layers.forEach(layer => layer.clear());
    }

    // function clearAll(){
    //     clearDrawState();

    //     var clearColor = Util.hexToRgb(clearColorPicker.value);
    //     gl.clearColor(clearColor.r/255, clearColor.g/255, clearColor.b/255, 1.0); 
    //     layers.forEach(layer => {
    //         layer.clear();
    //     });
    // }

    function clearSelectedLayer(){
        clearDrawState(layerMenu.getSelectedLayer());

        var layer = layerMenu.getSelectedLayer();
        layer.clear();
    }

    function createLayer(){
        var layer = new Layer(gl, CANVAS_SIZE);
        layerMenu.pushLayer(layer);
        layers.push(layer);
    }

    function toggleLayerVisibility(){
        
        layerMenu.toggleHidden(layerMenu.getSelectedLayer());
    }

    
    function deleteSelectedLayer(){
        clearDrawState();

        var layer = layerMenu.getSelectedLayer();
        console.log(layer);

        layers.splice(layers.indexOf(layer), 1);
        layerMenu.deleteLayer(layer);
    }


    function drawTriangle(layer: Layer, x: number, y: number, color: Util.Color){
        
        var newPoint = layer.addPoint([x,y], 5, color);
        trianglePoints.push(newPoint);

        if( trianglePoints.length == 3 ){
            var points = [];
            trianglePoints.forEach( point => {
                points.push( new Triangle.Point(point.getPosition(), point.getColor()));
            });
            layer.addTriangle(points);
            clearTrianglePoints(layer);
        }
    }


    function clearTrianglePoints(layer: Layer){
        // Remove triangle points
        trianglePoints.forEach( point => layer.removeDrawable(point) );
        trianglePoints = [];
    }


    /**
     * Clears the Triangle and circle draw states (removes existing point(s))
     */
    function clearDrawState(layer: Layer = null){
        if( layer === null )
            layer = layerMenu.getSelectedLayer();
        clearTrianglePoints(layer);
    }


    function drawPoint(layer: Layer, x: number, y: number, color: Util.Color){
        var size = pointSizeSlider.getValue();
        layer.addPoint([x, y], size, color);
    }


    function update() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        layers.forEach( layer => layer.update() );
        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Sheet2.Part3.start();


