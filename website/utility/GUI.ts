
namespace Util {

    
    export class Slider {
        private element: HTMLInputElement;
        private value: number;

        constructor(id: string, min: number, max: number, initial: number, step: number, callback: (value: number) => void ) {

            this.element = <HTMLInputElement> document.getElementById(id);

            if( this.element.getAttribute("type") !== "range" )
                throw "Slider must be an HTMLInputElement with type='range'"

            this.element.setAttribute("min", min.toString());
            this.element.setAttribute("max", max.toString());
            this.element.setAttribute("step", step.toString());
            this.element.setAttribute("value", initial.toString());
            let _this = this;
            this.element.oninput = (e) => {
                _this.value = this.element.valueAsNumber
                callback(_this.value);
            }

            _this.value = this.element.valueAsNumber
            callback(_this.value);
        }
    
        getValue() {
            return this.value;
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



}