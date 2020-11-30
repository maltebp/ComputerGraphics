
namespace Sheet2 {


    export class LayerMenu {
        private _container: HTMLElement;
        private _layerButtons;

        private _nextIndex = 1;
        private _onLayerChangeCallback: (currentLayer: Layer, newLayer: Layer) => void;
        private _selectedButton: LayerButton;

        constructor(containerId: string){
            this._container = <HTMLElement> document.getElementById(containerId);
            this._layerButtons = [];
            this._nextIndex = 1;
            this._onLayerChangeCallback = null;
            this._selectedButton = null;
            
        }

    
        pushLayer(layer){
            var layerButton = new LayerButton(layer, this._nextIndex++, this._container, (btn) => this.layerChanged(btn));
            this._layerButtons.push(layerButton);
            if( this._layerButtons.length == 1)
                layerButton.check();
        }
    

        toggleHidden(layer){
            this.getLayerButton(layer).toggleHidden();     
        }
    

        getSelectedLayer(){
            if( this._selectedButton == null ) return null;
            return this._selectedButton.getLayer();
        }
    
    
        deleteLayer(layer){
            if( layer == null ) return;
            var layerButton = this.getLayerButton(layer);
            this._layerButtons.splice(this._layerButtons.indexOf(layerButton), 1);
    
            if( this._layerButtons.length > 0)
                this._layerButtons[0].check();
            else
                this.layerChanged(null);
    
            layerButton.delete();
        }
    
    
        /** Adds callback to listen for when the selected layer has changed.
         *  The new layer and old layer can both be null.
         */
        onLayerChange(callback: (currentLayer: Layer, newLayer: Layer) => void){
            this._onLayerChangeCallback = callback;
        }
    
    
        private layerChanged(button){
            var currentButton = this._selectedButton;
            this._selectedButton = button;
    
            if( currentButton != button ){
                if( currentButton != null )
                    currentButton.uncheck();
    
                if(  this._onLayerChangeCallback != null){
                    var currentLayer = currentButton == null ? null : currentButton.getLayer();
                    var newLayer = button == null ? null : button.layer;
                    this._onLayerChangeCallback(currentLayer, newLayer);
                }
            }
        }
    
        /**
         * Returns the button which contains the given layer 
         */
        private getLayerButton(layer){
            for(var i=0; i<this._layerButtons.length; i++){
                if( this._layerButtons[i].layer == layer ){
                    return this._layerButtons[i];
                }
            }
        }
    }
    
    
    class LayerButton {
        private layer: Layer;
        private name: string;
        private label: Text;
        private parent: HTMLElement;
        private onSelectedCallback;
        private radio: HTMLInputElement;
        private container: HTMLDivElement;
        
        private _selected = false;
    
        constructor(layer: Layer, index: number, parent: HTMLElement, onChangeCallback: (btn: LayerButton) => void ){
            this.layer = layer;
            this.parent = parent;
            this.onSelectedCallback = onChangeCallback;
    
            this.container = document.createElement('div');
            
            this.radio = document.createElement('input');
            this.radio.type = 'radio';
            this.radio.name = 'layers';
            this.container.appendChild(this.radio);
    
            this.name = `Layer ${index}`;
            this.label = document.createTextNode(this.name);
            this.container.appendChild(this.label);
            this.container.appendChild(document.createElement('br'));
    
            // Append this layer button container to the given container
            parent.appendChild(this.container);
    
            this._selected = false;
    
            this.radio.onchange = e => {
                console.log(this.radio.checked);
                if( this.radio.checked && !this._selected )
                    this.onSelectedCallback(this);
                this._selected = this.radio.checked;
            };
        }
    
    
        /**
         *  Hides/shows the given layer associated with the button,
         *  and changes the label of the button to match its state.
         */
        toggleHidden(){
            this.layer.setHidden(!this.layer.isHidden());
            if( this.layer.isHidden() )
                this.label.textContent = this.name + " (H)"
            else
                this.label.textContent = this.name; 
        }
    
    
        isChecked(){
            return this._selected;
        }
    
        check(){
            var wasChecked = this._selected;
            this._selected = true;
            this.radio.checked = true;
            if( !wasChecked ) this.onSelectedCallback(this);
        }
    
        uncheck(){
            this._selected = false;
            this.radio.checked = false;
        }
    
        delete(){
            this.parent.removeChild(this.container);
        }

        getLayer() {
            return this.layer;
        }
    
    
    }
}
