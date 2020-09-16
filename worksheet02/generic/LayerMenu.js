
class LayerMenu {

    constructor(container){
        this._container = container;
        this._layerButtons = [];
        this._nextIndex = 1;
    }

    pushLayer(layer){
        var layerButton = new LayerButton(layer, this._nextIndex++, this._container);
        this._layerButtons.push(layerButton);
        if( this._layerButtons.length == 1)
            layerButton.check();
    }

    toggleHidden(layer){
        this._getLayerButton(layer).toggleHidden();     
    }

    getSelectedLayer(){
        for(var i=0; i<this._layerButtons.length; i++){
            if( this._layerButtons[i].isChecked() )
                return this._layerButtons[i].layer;
        }
    }


    deleteLayer(layer){
        var layerButton = this._getLayerButton(layer);
        this._layerButtons[i].delete();
        this._layerButtons.splice(i, 1);
        if( this._layerButtons.length > 0)
            this._layerButtons[0].check();
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

    constructor(layer, index, parent ){
        this.layer = layer;
        this._parent = parent;

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
        return this._radio.checked;
    }

    check(){
        return this._radio.checked = true;
    }

    delete(){
        this._parent.removeChild(this._container);
    }


}