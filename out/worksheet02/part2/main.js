function clearAll(){
    var clearColor = hexToRgb(clearColorPicker.value);
    gl.clearColor(clearColor.r/255, clearColor.g/255, clearColor.b/255, 1.0); 
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

function draw(layer, x, y){
    var color = hexToRgb(document.getElementById("draw-color").value); 
    var size = pointSizeSlider.value;
    
    layer.addPoint([x, y], size, [color.r/255, color.g/255, color.b/255, 1.0]);
}


function update(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    layers.forEach( layer => {
        layer.update();
    });

    requestAnimationFrame(update);
}



// Setup ------------------------------------------------------------------------

const CANVAS_SIZE = [720, 480];

var canvas = document.getElementById("canvas");
var gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);

gl.enable(gl.DEPTH_TEST);


// Slider which determines point size
var pointSizeSlider = document.getElementById("point-size");

// Setup layer menu, and create initial layer
var layerMenu = new LayerMenu(document.getElementById("layer_menu_list"));
var layers = [];
createLayer();

// Setup initial clear color
var clearColorPicker = document.getElementById("clear-color");
clearColorPicker.value = "#6495ED";
clearAll();



// ------------------------------------------------------------------------------------------------
// EVENTS 
canvas.onmousedown = e => {
    var layer = layerMenu.getSelectedLayer();
    if( layer == null ) alert("No layer is selected");
    else draw(layer, e.offsetX, CANVAS_SIZE[1]-e.offsetY);    
};

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

document.getElementById('layer_menu_create').onclick = event => {
    createLayer();
};

document.getElementById('layer_menu_delete').onclick = event => {
    deleteSelectedLayer();
};


// Clear canvas 
document.getElementById('clear-canvas').onclick = event => {
    clearAll();
};

// ------------------------------------------------------------------------------------------------

update();

