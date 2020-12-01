

namespace Sheet2.Part4 {

    const CANVAS_SIZE = [720, 480];

    enum DrawMode {
        POINT = "point",
        TRIANGLE = "triangle",
        CIRCLE = "circle"
    };

    declare var gl: WebGLRenderingContext;
    declare var layerMenu: LayerMenu;
    declare var layers: Layer[];
    declare var drawingPoints: Point[];
    declare var drawMode: DrawMode;
    declare var pointSizeSlider: Util.Slider;


    function setup() {        

        var canvas = document.getElementById("canvas");
        gl =Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);

        gl.enable(gl.DEPTH_TEST);

        drawingPoints = [];

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
        drawModeGroup.addOption("draw-mode-circle", DrawMode.CIRCLE);
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
                    layerMenu.toggleHidden(layerMenu.getSelectedLayer());
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
            case DrawMode.CIRCLE:
                drawCircle(layer, x, y, color);
                break;
            default:
                alert("Unknown draw mode: " + drawMode);
        }
    }
        

    function clearAll(color: Util.Color){
        clearDrawState();
        gl.clearColor(color.getRed(), color.getGreen(), color.getBlue(), 1.0); 
        layers.forEach(layer => layer.clear());
    }


    function clearSelectedLayer(){
        clearDrawState(layerMenu.getSelectedLayer());

        var layer = layerMenu.getSelectedLayer();
        layer.clear();
    }

    
    // Create new layer and add to LayerMenu
    function createLayer(){
        var layer = new Layer(gl, CANVAS_SIZE);
        layerMenu.pushLayer(layer);
        layers.push(layer);
    }


    // Remove current layer from LayerMenu
    function deleteSelectedLayer(){
        clearDrawState();
        var layer = layerMenu.getSelectedLayer();
        layers.splice(layers.indexOf(layer), 1);
        layerMenu.deleteLayer(layer);
    }


    function drawTriangle(layer: Layer, x: number, y: number, color: Util.Color){
        var newPoint = layer.addPoint([x,y], 5, color);
        drawingPoints.push(newPoint);

        if( drawingPoints.length == 3 ){
            var points = [];
            drawingPoints.forEach( point => {
                points.push( new Triangle.Point(point.getPosition(), point.getColor()));
            });
            layer.addTriangle(points);
            clearDrawingPoints(layer);
        }
    }


    function drawCircle(layer: Layer, x: number, y: number, color: Util.Color){
        var newPoint = layer.addPoint([x,y], 5, color);
        drawingPoints.push(newPoint);

        if( drawingPoints.length == 2 ){

            // Calculate radius
            let centerPos = drawingPoints[0].getPosition();
            let outerPos = drawingPoints[1].getPosition();
            let xDiff = centerPos[0] - outerPos[0];
            let yDiff = centerPos[1] - outerPos[1];
            let radius = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
            
            layer.addCircle(
                centerPos,
                radius,
                drawingPoints[0].getColor().copy(), // Inner color
                drawingPoints[1].getColor().copy()  // Outer color
            );
            clearDrawingPoints(layer);
        }
    }


    // Clears intermediate drawing points (for drawing triangles/circles)
    function clearDrawingPoints(layer: Layer){
        drawingPoints.forEach( point => layer.removeDrawable(point) );
        drawingPoints = [];
    }

    
    // Clears the Triangle and circle draw states (removes existing point(s))
    function clearDrawState(layer: Layer = null){
        if( layer === null )
            layer = layerMenu.getSelectedLayer();
        clearDrawingPoints(layer);
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

Sheet2.Part4.start();


