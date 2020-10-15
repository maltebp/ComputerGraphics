

function setDrawMode(newDrawMode){
    clearDrawState();

    document.getElementById("draw-mode-point").checked = (newDrawMode == DrawModes.POINT);
    document.getElementById("draw-mode-triangle").checked = (newDrawMode == DrawModes.TRIANGLE);
    document.getElementById("draw-mode-circle").checked = (newDrawMode == DrawModes.CIRCLE);
    
    pointSizeSlider.disabled = newDrawMode != DrawModes.POINT;
    
    drawMode = newDrawMode;
}


function clearAll(){
    clearDrawState();

    var clearColor = Util.hexToRgb(clearColorPicker.value);
    gl.clearColor(clearColor.r/255, clearColor.g/255, clearColor.b/255, 1.0); 
    layers.forEach(layer => {
        layer.clear();
    });
}

function clearSelectedLayer(){
    clearDrawState();

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
    clearDrawState(layer);
    layers.splice(layers.indexOf(layer), 1);
    layerMenu.deleteLayer(layer);
}

function drawTriangle(layer, x, y, color){
    
    var newPoint = layer.addPoint([x,y], 5, color);
    trianglePoints.push(newPoint);

    if( trianglePoints.length == 3 ){
        var points = [];
        trianglePoints.forEach( point => {
            points.push( new Triangle.Point(point._pos, point._color));
        });
        layer.addTriangle(points);
        clearTrianglePoints(layer);
    }
}


function drawCircle(layer, x, y, color){
    var newPoint = layer.addPoint([x,y], 5, color);
    circlePoints.push(newPoint);

    if( circlePoints.length == 2 ){
        layer.addCircle(new Circle.Point(circlePoints[0]._pos, circlePoints[0]._color), new Circle.Point(circlePoints[1]._pos, circlePoints[1]._color));
        clearCirclePoints(layer);
    }
}


function clearTrianglePoints(layer){
    trianglePoints.forEach( point => {
        layer.removeDrawable(point);
    });
    trianglePoints = [];
}

function clearCirclePoints(layer){
    circlePoints.forEach( point => {
        layer.removeDrawable(point);
    });
    circlePoints = [];
}



/**
 * Clears the Triangle and circle draw states (removes existing point(s))
 */
function clearDrawState(layer){
    clearTrianglePoints(layer);
    clearCirclePoints(layer);
}


function drawPoint(layer, x, y, color){
    var size = pointSizeSlider.value;
    layer.addPoint([x, y], size, color);
}

function draw(layer, x, y){
    var colorRaw = Util.hexToRgb(document.getElementById("draw-color").value); 
    var color = [colorRaw.r/255, colorRaw.g/255, colorRaw.b/255, 1.0];
    
    switch(drawMode){
        case DrawModes.POINT:
            drawPoint(layer, x, y, color);
            break;
        case DrawModes.TRIANGLE:
            drawTriangle(layer, x, y, color);
            break;
        case DrawModes.CIRCLE:
            drawCircle(layer, x, y, color);
            break;
        default:
            alert("Unknown draw mode!");
    }
}


function update(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    layers.forEach( layer => {
        layer.update();
    });

    requestAnimationFrame(update);
}



// Setup ------------------------------------------------------------------------


const DrawModes = {
    POINT: "point",
    TRIANGLE: "triangle",
    CIRCLE: "circle"
};

const CANVAS_SIZE = [720, 480];

var canvas = document.getElementById("canvas");
var gl =Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);

gl.enable(gl.DEPTH_TEST);

var trianglePoints = [];
var circlePoints = [];


// Slider which determines point size
var pointSizeSlider = document.getElementById("point-size");

// Setup layer menu, and create initial layer
var layerMenu = new LayerMenu(document.getElementById("layer_menu_list"));
layerMenu.onLayerChange((oldLayer, newLayer) => {
    clearDrawState(oldLayer);
});

var layers = [];
createLayer();




// Set initial draw mode
var drawMode;
setDrawMode(DrawModes.POINT);


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

document.onkeydown = e => {
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
        case 'Escape':
            clearDrawState(layerMenu.getSelectedLayer());
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

document.getElementById('draw-mode-point').onclick = event => {
    setDrawMode(DrawModes.POINT);
};

document.getElementById('draw-mode-triangle').onclick = event => {
    setDrawMode(DrawModes.TRIANGLE);
};

document.getElementById('draw-mode-circle').onclick = event => {
    setDrawMode(DrawModes.CIRCLE);
};

// ------------------------------------------------------------------------------------------------

update();

