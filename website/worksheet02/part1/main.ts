
namespace Sheet2.Part1 {

    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var layerMenu: LayerMenu;
    declare var layers: Layer[];
    


    function setup() {
                   
        // Setup ------------------------------------------------------------------------
        let canvas = <HTMLCanvasElement> document.getElementById("canvas");
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        gl.enable(gl.DEPTH_TEST);
        
        // Setup layer menu, and create initial layer
        layerMenu = new LayerMenu("layer_menu_list");
        layers = [];
        createLayer();
        
    
        // Create layer
        new Util.Button('layer_menu_create', () => createLayer() );

        // Delete layer
        new Util.Button('layer_menu_delete', () => deleteSelectedLayer())

        // Slider which determines point size
        var pointSizeSlider = <HTMLInputElement> document.getElementById("point-size");

        // Click: Draw 
        canvas.onmousedown = e => {
            var layer = layerMenu.getSelectedLayer();
            var pointSize = pointSizeSlider.valueAsNumber;
        
            if( layer == null ) alert("No layer is selected");
            else layer.addPoint([e.offsetX, CANVAS_SIZE[1]-e.offsetY], pointSize, Util.Color.WHITE);           
        };
        
        // Shortcuts
        document.onkeypress = e => {
            console.log(e.code);
        
            switch(e.code) {
                case 'KeyD':
                    clearSelectedLayer();
                    break;
                case 'KeyC':
                    clearAll();
                    break;
                case 'KeyH':
                    toggleLayerVisibility();
                    break;
            }    
        }
    }


    function clearAll(){
        layers.forEach(layer => {
            layer.clear();
        });
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

Sheet2.Part1.start();
