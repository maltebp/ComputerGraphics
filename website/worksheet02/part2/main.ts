
namespace Sheet2.Part2 {
    
    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var layerMenu: LayerMenu;
    declare var layers: Layer[];
    

    function setup(){
        let canvas = document.getElementById("canvas");
        gl =Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);

        gl.enable(gl.DEPTH_TEST);


        // Setup layer menu, and create initial layer
        layerMenu = new LayerMenu("layer_menu_list");
        layers = [];
        createLayer();


        // Setup color pickers
        let clearColorPicker = new Util.ColorPicker("clear-color", Util.Color.CORNFLOWER_BLUE);
        let drawColorPicker = new Util.ColorPicker("draw-color", Util.Color.WHITE);

        // Create layer
        new Util.Button('layer_menu_create', () => createLayer() );

        // Delete layer
        new Util.Button('layer_menu_delete', () => deleteSelectedLayer())

        new Util.Button('clear-canvas', () => clearAll(clearColorPicker.getColor()) );

        // Slider which determines point size
        let pointSizeSlider = new Util.Slider("point-size", 1, 100, 20, 1 );

        
        canvas.onmousedown = e => {
            var layer = layerMenu.getSelectedLayer();
            if( layer == null ) alert("No layer is selected");
            else{
                layer.addPoint(
                    [e.offsetX, CANVAS_SIZE[1]-e.offsetY], // Position
                    pointSizeSlider.getValue(),
                    drawColorPicker.getColor()
                );
            }
        }

        // Hot keys
        document.onkeypress = e => {
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
            }    
        }

        clearAll(clearColorPicker.getColor());
    }


    function clearAll(color: Util.Color){
        gl.clearColor(color.getRed(), color.getGreen(), color.getBlue(), 1.0); 
        layers.forEach(layer => layer.clear());
    }


    function clearSelectedLayer(){
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
        var layer = layerMenu.getSelectedLayer();
        layers.splice(layers.indexOf(layer), 1);
        layerMenu.deleteLayer(layer);
    }

    
    function update(){
        gl.clear(gl.COLOR_BUFFER_BIT);

        layers.forEach( layer => {
            layer.update();
        });

        requestAnimationFrame(update);
    }


    export function start() {
        setup();
        update();
    }

}

Sheet2.Part2.start();

