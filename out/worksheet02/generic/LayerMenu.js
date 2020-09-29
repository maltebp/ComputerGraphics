
class LayerMenu {

    constructor(container){
        this._container = container;
        this._layerButtons = [];
        this._nextIndex = 1;
        this._onLayerChangeCallback = null;
        this._selectedButton = null;
        
    }

    pushLayer(layer){
        var layerButton = new LayerButton(layer, this._nextIndex++, this._container, (btn) => this._layerChanged(btn));
        this._layerButtons.push(layerButton);
        if( this._layerButtons.length == 1)
            layerButton.check();
    }

    toggleHidden(layer){
        this._getLayerButton(layer).toggleHidden();     
    }

    getSelectedLayer(){
        if( this._selectedButton == null ) return null;
        return this._selectedButton.layer;
    }


    deleteLayer(layer){
        if( layer == null ) return;
        var layerButton = this._getLayerButton(layer);
        this._layerButtons.splice(this._layerButtons.indexOf(layerButton), 1);

        if( this._layerButtons.length > 0)
            this._layerButtons[0].check();
        else
            this._layerChanged(null);

        layerButton.delete();
    }


    /** Adds callback to listen for when the selected layer has changed.
     *  The new layer and old layer can both be null.
     */
    onLayerChange(callback){
        this._onLayerChangeCallback = callback;
    }


    _layerChanged(button){
        var currentButton = this._selectedButton;
        this._selectedButton = button;

        if( currentButton != button ){
            if( currentButton != null )
                currentButton.uncheck();

            if(  this._onLayerChangeCallback != null){
                var currentLayer = currentButton == null ? null : currentButton.layer;
                var newLayer = button == null ? null : button.layer;
                this._onLayerChangeCallback(currentLayer, newLayer);
            }
        }
    }

    /**
     * Returns the button which contains the given layer 
     */
    _getLayerButton(layer){
        for(var i=0; i<this._layerButtons.length; i++){
            if( this._layerButtons[i].layer == layer ){
                return this._layerButtons[i];
            }
        }
    }
}


class LayerButton {

    constructor(layer, index, parent, onChangeCallback ){
        this.layer = layer;
        this._parent = parent;
        this._onSelectedCallback = onChangeCallback;

        this._container = document.createElement('div');
        
        this._radio = document.createElement('input');
        this._radio.type = 'radio';
        this._radio.name = 'layers';
        this._container.appendChild(this._radio);

        this._name = `Layer ${index}`;
        this._label = document.createTextNode(this._name);
        this._container.appendChild(this._label);
        this._container.appendChild(document.createElement('br'));

        // Append this layer button container to the given container
        parent.appendChild(this._container);

        this._selected = false;

        this._radio.onchange = e => {
            console.log(this._radio.checked);
            if( this._radio.checked && !this._selected )
                this._onSelectedCallback(this);
            this._selected = this._radio.checked;
        };
    }


    /**
     *  Hides/shows the given layer associated with the button,
     *  and changes the label of the button to match its state.
     */
    toggleHidden(){
        this.layer.hidden = !this.layer.hidden;
        if( this.layer.hidden )
            this._label.textContent = this._name + " (H)"
        else
            this._label.textContent = this._name; 
    }


    isChecked(){
        return this._selected;
    }

    check(){
        var wasChecked = this._selected;
        this._selected = true;
        this._radio.checked = true;
        if( !wasChecked ) this._onSelectedCallback(this);
    }

    uncheck(){
        this._selected = false;
        this._radio.checked = false;
    }

    delete(){
        this._parent.removeChild(this._container);
    }


}