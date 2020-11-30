
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
    
        getValue() {
            return this.element.valueAsNumber;
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
    
        getColor() {
            return Color.fromHex(this.element.value);
        }
    }

    



}