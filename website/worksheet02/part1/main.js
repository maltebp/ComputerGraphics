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



// Setup ------------------------------------------------------------------------

const CANVAS_SIZE = [1080, 720];

var canvas = document.getElementById("canvas");
var gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);

gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
gl.enable(gl.DEPTH_TEST);


// Slider which determines point size
var pointSizeSlider = document.getElementById("point-size");

// Setup layer menu, and create initial layer
var layerMenu = new LayerMenu(document.getElementById("layer_menu_list"));
var layers = [];
createLayer();



// ------------------------------------------------------------------------------------------------
// EVENTS 
canvas.onmousedown = e => {

    var layer = layerMenu.getSelectedLayer();
    var pointSize = pointSizeSlider.value;

    if( layer == null ) alert("No layer is selected");
    else layer.addPoint([e.offsetX, CANVAS_SIZE[1]-e.offsetY], pointSize, [1.0, 1.0, 1.0, 1.0]);

    
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

// ------------------------------------------------------------------------------------------------

update();

