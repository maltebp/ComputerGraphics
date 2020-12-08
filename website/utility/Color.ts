namespace Util {


    /**
     * Data class to hold an RGBA color with values between 0 and 1
     */
    export class Color {
        private red: number;
        private green: number;
        private blue: number;
        private alpha: number;

        constructor(red: number, green: number, blue: number, alpha: number = 1.0) {
            this.setRed(red);
            this.setGreen(green);
            this.setBlue(blue);
            this.setAlpha(alpha);
        }


        setRed(red: number) {
            this.red = this.adjust(red);
        }

        setGreen(green: number) {
            this.green = this.adjust(green);
        }

        setBlue(blue: number) {
            this.blue = this.adjust(blue);
        }

        setAlpha(alpha: number) {
            this.alpha = this.adjust(alpha);
        }

        getRed() {
            return this.red;
        }

        getGreen() {
            return this.green;            
        }

        getBlue() {
            return this.blue;
        }

        getAlpha() {
            return this.alpha;
        }

        asList(includeAlpha = true): number[] {
            if( includeAlpha)
                return [this.red, this.green, this.blue, this.alpha];
            return [this.red, this.green, this.blue];
        }
        
        copy(){
            return new Color(this.red, this.green, this.blue, this.alpha);
        }
    
        private adjust(value) {
            if( value < 0) return 0;
            if( value > 1) return 1;
            return value;
        }

        
        toHex(includeAlpha = false){
            if( includeAlpha )
                "#" + Color._componentToHex(this.red) + Color._componentToHex(this.green) + Color._componentToHex(this.blue) + Color._componentToHex(this.alpha);  
            return "#" + Color._componentToHex(this.red) + Color._componentToHex(this.green) + Color._componentToHex(this.blue);  
        }

        static fromHex(hex: string) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if( !result )
                throw `Couldn't parse '${hex}' as color`;
            return new Color(
                parseInt(result[1], 16)/255,
                parseInt(result[2], 16)/255,
                parseInt(result[3], 16)/255,
                1.0);
        }


        /**
         * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
         * @param {*} hex 
         */
        private static _componentToHex(c) {
            // Pretty bad solution, but it works
            var hex = parseInt((c*255).toFixed()).toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
    }

    export namespace Color {
        export const WHITE      = new Color(1.0, 1.0, 1.0);
        export const BLACK      = new Color(0.0, 0.0, 0.0);
        export const RED        = new Color(1.0, 0.0, 0.0);
        export const GREEN      = new Color(0.0, 1.0, 0.0);
        export const BLUE       = new Color(0.0, 0.0, 1.0);
        export const CORNFLOWER_BLUE = new Color(0.39, 0.58, 0.93);
    }





    // - - -  - - -  - - -  - - -  - - -  - - -  - - -  - - -  - - -  - - -  - - - 
    // Old solution to color problem. Still here because it's used by some older
    // worksheetss

    /**
     * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     * @param {*} hex 
     */
    export function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
        } : null;
    }


    /**
     * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     * @param {*} hex 
     */
    function _componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /**
     * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     * @param {*} hex 
     */
    export function rgbToHex(r, g, b) {
        return "#" + _componentToHex(r) + _componentToHex(g) + _componentToHex(b);
    }
    
}