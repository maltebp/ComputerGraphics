
namespace Util {

    
    export class Button {
        constructor(id: string, callback: () => void ) {
            (<HTMLButtonElement> document.getElementById(id)).onclick = (e) => {
                callback();
            }
        }
    }


    
    export class Slider {
        private element: HTMLInputElement;

        constructor(id: string, min: number, max: number, initial: number, step: number, callback: (value: number) => void = null ) {

            this.element = <HTMLInputElement> document.getElementById(id);

            if( this.element.getAttribute("type") !== "range" )
                throw "Slider must be an HTMLInputElement with type='range'"

            this.element.setAttribute("min", min.toString());
            this.element.setAttribute("max", max.toString());
            this.element.setAttribute("step", step.toString());
            this.element.setAttribute("value", initial.toString());
            
            if( callback !== null){
                this.element.oninput = (e) => {
                    callback(this.element.valueAsNumber);
                }
                callback(this.element.valueAsNumber);
            }
        }
    
        setValue(value: number) {
            this.element.value = value.toString();
        }

        getValue() {
            return this.element.valueAsNumber;
        }

        disable(toggle: boolean) {
            this.element.disabled = toggle;
        }
    }



    export class Checkbox {
        private element: HTMLInputElement;

        constructor(id: string, checked: boolean, callback: (checked: boolean) => void ) {
            this.element = <HTMLInputElement> document.getElementById(id);
            
            if( this.element.getAttribute("type") !== "checkbox" )
                throw "Checkbox must be an HTMLInputElement with type='checkbox'"

            if( checked )
                this.element.setAttribute("checked", "");

            this.element.onchange = (e) => {
                callback(this.element.checked);
            }

            callback(this.element.checked);   
        }

        check(toggle: boolean){
            this.element.checked = toggle;
        }
    
        isChecked() {
            return this.element.checked;
        }
    }

    
    export class ColorPicker {
        private element: HTMLInputElement;

        constructor(id: string, initial: Color, callback: (color: Color) => void = null ) {
            this.element = <HTMLInputElement> document.getElementById(id);
            
            if( this.element.getAttribute("type") !== "color" )
                throw "Color picker must be an HTMLInputElement with type='color'"

            this.element.setAttribute("value", initial.toHex(false) );

            if( callback !== null ){
                this.element.oninput = (e) => {
                    callback(Util.Color.fromHex(this.element.value));
                }
                callback(Util.Color.fromHex(this.element.value));
            }
        }
    
        setColor(color: Util.Color) {
            this.element.value = color.toHex(false);
            // TODO: Check that callback is fired
        }

        getColor() {
            return Color.fromHex(this.element.value);
        }
    }


    /**
     *  A logical group of radio buttons (HTML input element with type=radio), where
     *  each button is bound to a value of generic type T
     */
    export class RadioGroup<T> {
        private static nextGroupId = 0;

        private groupId: string;
        private buttons: HTMLInputElement[] = [];
        private values: T[] = [];
        private selected = -1;
        private callback: (value: T) => void;

        constructor(callback: (value: T) => void = null) {
            // A (hopefully) unique id
            this.groupId = "util-gui-radiogroup-id-" + (++RadioGroup.nextGroupId);
            this.callback = callback;
        }


        addOption(string: string, value: T) {
            let button = <HTMLInputElement> document.getElementById(string);
            if( button.getAttribute("type") !== "radio" )
                throw "Radio button must be an HTMLInputElement with type='radio'"

            let id = this.buttons.length;
            this.buttons.push(button);  
            this.values.push(value);          

            // Register change callback
            let _this = this;
            button.onchange = (e) => {
                if( button.checked) {
                    let fireCallback = _this.selected !== id;
                    _this.selected = id;
                    if( fireCallback && this.callback !== null )
                        this.callback(_this.values[id]);                   
                } 
            }

            // Add to group
            button.name = this.groupId;
            button.checked = false;
            return this;          
        }


        check(index: number) {
            if( index < 0 || index > this.buttons.length)
                throw "Radio group index is out of bounds";
            this.buttons.forEach(btn => btn.checked = false);
            this.buttons[index].checked = true;
            this.selected = index;
        }


        getChecked() {
            return this.selected; 
        }

    }

}