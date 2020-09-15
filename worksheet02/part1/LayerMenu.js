
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

    getSelectedLayer(){
        for(var i=0; i<this._layerButtons.length; i++){
            if( this._layerButtons[i].isChecked() )
                return this._layerButtons[i].layer;
        }
    }


    delete(layer){
        for(var i=0; i<this._layerButtons.length; i++){
            console.log(`Checking ${i}`);
            if( this._layerButtons[i].layer == layer ){
                console.log(`Deleting ${i}`);
                this._layerButtons[i].delete();
                this._layerButtons.splice(i, 1);
                if( this._layerButtons.length > 0)
                    this._layerButtons[0].check();
                return;
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

        this._container.appendChild(document.createTextNode(`Layer ${index}`));
        this._container.appendChild(document.createElement('br'));

        // Append this layer button container to the given container
        parent.appendChild(this._container);
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