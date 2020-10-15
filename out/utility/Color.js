var Util;
(function (Util) {
    /**
     * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     * @param {*} hex
     */
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    Util.hexToRgb = hexToRgb;
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
    function rgbToHex(r, g, b) {
        return "#" + _componentToHex(r) + _componentToHex(g) + _componentToHex(b);
    }
    Util.rgbToHex = rgbToHex;
})(Util || (Util = {}));
