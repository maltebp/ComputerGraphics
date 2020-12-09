
namespace Project {


    // Class to group together html elements for light settings
    export class LightSettings {
        private htmlGroup: HTMLElement;
        private color: Util.ColorPicker;
        private radius: Util.Slider;
        
        private light: Light = null;

        constructor(){
            this.htmlGroup = <HTMLElement>document.getElementById("light-settings");

            this.color = new Util.ColorPicker("light-settings-color", Util.Color.WHITE, newColor => {
                if( this.light !== null ) this.light.setColor(newColor);
            });

            this.radius = new Util.Slider("light-settings-radius", 2, 1000, 100, 1, radius => {
                if( this.light !== null ) this.light.setRadius(radius);
            });

            this.hide(true);
        }


        getLight(){
            return this.light;
        }

        setLight(light: Light){
            this.light = null;
            this.color.setColor(light.getColor());
            this.radius.setValue(light.getRadius());
            this.light = light;
        }

        hide(toggle: boolean) {
            this.htmlGroup.hidden = toggle;
        }
    }



    // Class to group together html elements for sprite settings
    export class SpriteSettings {
        private htmlGroup: HTMLElement;
        private width: Util.Slider;
        private height: Util.Slider;
        private rotation: Util.Slider;
        private texture: Util.DropdownMenu<Util.Texture>;
        private color: Util.ColorPicker;
        private diffuse: Util.Slider;
        private occluder: Util.Checkbox;
        
        private sprite: Sprite = null;

        constructor(){
            this.htmlGroup = <HTMLElement>document.getElementById("sprite-settings");

            this.width = new Util.Slider("sprite-settings-width", 2, 1000, 100, 1, width => {
                if( this.sprite !== null ) this.sprite.setWidth(width);
            });

            this.height = new Util.Slider("sprite-settings-height", 2, 1000, 100, 1, height => {
                if( this.sprite !== null ) this.sprite.setHeight(height);
            });

            this.rotation = new Util.Slider("sprite-settings-rotation", 0, 360, 0, 0.25, rotation => {
                if( this.sprite !== null ) this.sprite.setRotation(rotation);
            });

            this.texture = new Util.DropdownMenu<Util.Texture>("sprite-settings-texture", (texture) => {
                if( this.sprite !== null ) this.sprite.setTexture(texture);
            });
            this.texture.addOption("None", null);

            this.color = new Util.ColorPicker("sprite-settings-color", Util.Color.WHITE, newColor => {
                if( this.sprite !== null ) this.sprite.setColor(newColor);
            });

            this.diffuse = new Util.Slider("sprite-settings-diffuse", 0, 1, 0.8, 0.01, diffuse => {
                if( this.sprite !== null ) this.sprite.setDiffuseFactor(diffuse);
            });

            this.occluder = new Util.Checkbox("sprite-settings-occluder", true, occlude => {
                if( this.sprite !== null ) this.sprite.setOccluder(occlude);
            });

           
            this.hide(true);
        }


        addTextureOption(path: string, name: string){
            Util.Texture.createFromImage(gl, path)
                .setChannels(4)
                .setFilter(gl.LINEAR, gl.LINEAR)
                .setWrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE)
                .build((texture) => this.texture.addOption(name, texture));
        }


        setSprite(sprite: Sprite){
            this.sprite = null;
            this.width.setValue(sprite.getWidth());
            this.height.setValue(sprite.getHeight());
            this.rotation.setValue(sprite.getRotation());
            this.texture.setOptionByValue(sprite.getTexture());
            this.color.setColor(sprite.getColor());
            this.diffuse.setValue(sprite.getDiffuseFactor());
            this.occluder.check(sprite.isOccluder());
            this.sprite = sprite;
        }

        hide(toggle: boolean) {
            this.htmlGroup.hidden = toggle;
        }
    }
}