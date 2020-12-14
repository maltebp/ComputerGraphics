
namespace Util {

    
    export class Button {
        constructor(id: string, callback: () => void ) {
            (<HTMLButtonElement> document.getElementById(id)).onclick = (e) => {
                callback();
            }
        }
    }


    
    export class Slider {
        private valueDisplay: HTMLParagraphElement = null;
        private element: HTMLInputElement;

        constructor(id: string, min: number, max: number, initial: number, step: number, callback: (value: number) => void = null ) {

            this.element = <HTMLInputElement> document.getElementById(id);
            this.addValueDisplay();

            if( this.element.getAttribute("type") !== "range" )
                throw "Slider must be an HTMLInputElement with type='range'"

            this.element.setAttribute("min", min.toString());
            this.element.setAttribute("max", max.toString());
            this.element.setAttribute("step", step.toString());
            this.element.setAttribute("value", initial.toString());
            
            if( callback !== null){
                this.element.oninput = (e) => {
                    this.updateValueDisplay();
                    callback(this.element.valueAsNumber);
                }
                callback(this.element.valueAsNumber);
            }else{
                this.element.oninput = (e) => {
                    this.updateValueDisplay();
                }
            }

            this.updateValueDisplay();
        }

        // Adds a text which displays the value of the given slider
        addValueDisplay(){
            this.valueDisplay = document.createElement('p');
            this.valueDisplay.style.margin = "0px";
            this.element.parentElement.insertBefore(this.valueDisplay, this.element.nextSibling);
        }
    
        setValue(value: number) {
            this.element.value = value.toString();
            this.updateValueDisplay();
        }

        getValue() {
            return this.element.valueAsNumber;
        }

        disable(toggle: boolean) {
            this.element.disabled = toggle;
        }

        private updateValueDisplay(){
            if( this.valueDisplay === null ) return;
            let decimalValue = Number.parseFloat(this.element.step) < 1.0;
            this.valueDisplay.innerText = this.element.valueAsNumber.toFixed(decimalValue ? 2 : 0);
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



    export class DropdownMenu<T> {

        private element: HTMLSelectElement;
        private valueMap: Map<string, T> = new Map<string,T>();
        private labelMap: Map<T, string> = new Map<T, string>();

        constructor(id: string, callback: (value: T) => void = null) {
            this.element = <HTMLSelectElement> document.getElementById(id);
            this.element.onchange = (e) => {
                callback(this.valueMap.get(this.element.value));
            };
        }


        addOption(label: string, value: T) {
            let option = document.createElement("option");
            option.text = label;
            
            option.setAttribute("value", label);

            this.labelMap.set(value, label);
            this.valueMap.set(label, value);

            this.element.add(option);
        }


        /**
         * Sets the current option to the option which has the given value
         */
        setOptionByValue(value: T){
            this.element.value = this.labelMap.get(value);
        }


        getValue() {
            return this.valueMap.get(this.element.value);
        }

    }

}