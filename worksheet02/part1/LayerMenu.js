class LayerMenu {

    constructor(container){
        this._container = container;
        this._layerButtons = [];
    }

    pushLayer(layer){
        this._layerButtons.push(new LayerButton(layer, this._layerButtons.length, this._container));     
    }

    getSelectedLayer(){
        for(var i=0; i<this._layerButtons.length; i++){
            if( this._layerButtons[i].isChecked() )
                return this._layerButtons[i].layer;
        }
    }
}


class LayerButton {
    
    constructor(layer, index, container ){
        this.layer = layer;
        this._container = document.createElement('div');
        
        this._radio = document.createElement('input');
        this._radio.type = 'radio';
        this._radio.name = 'layers';
        this._container.appendChild(this._radio);

        this._container.appendChild(document.createTextNode(`Layer ${index}`));
        this._container.appendChild(document.createElement('br'));

        // Append this layer button container to the given container
        container.appendChild(this._container);
    }


    isChecked(){
        return this._radio.checked;
    }

    check(){
        return this._radio.checked = true;
    }


}