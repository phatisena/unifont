namespace sprdata {
    
    /**
     * Sets a number in the data of a sprite
     */
    //% blockId=spriteDataSetNumber block="set $sprite=variables_get data $name to number $value"
    //% blockHidden=true
    //% name.shadow="spriteDataNumberNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function setDataNumber(sprite: Sprite, name: string, value: number) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Change a number in the data of a sprite by a given value
     */
    //% blockId=spriteDataChangeNumber block="change $sprite=variables_get data $name by number $value"
    //% blockHidden=true
    //% name.shadow="spriteDataNumberNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function changeDataNumberBy(sprite: Sprite, name: string, value: number) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = (d[name] || 0) + value;
    }

    /**
     * Gets a number in the data of a sprite
     */
    //% blockId=spriteDataGetNumber block="$sprite=variables_get data $name as number"
    //% name.shadow="spriteDataNumberNameShadow"
    //% blockHidden=true
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function readDataNumber(sprite: Sprite, name: string): number {
        if (!sprite || !name) return 0;
        const d = sprite.data;
        return d[name] as number;
    }
    
    /**
     * Sets a number array in the data of a sprite
     */
    //% blockId=spriteDataSetNumberArray block="set $sprite=variables_get data $name to number array $value"
    //% blockHidden=true
    //% name.shadow="spriteDataNumberArrayNameShadow"
    //% group="Data array"
    //% weight=10
    //% blockGap=8
    export function setDataNumberArray(sprite: Sprite, name: string, value: number[]) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Gets a number array in the data of a sprite
     */
    //% blockId=spriteDataGetNumberArray block="$sprite=variables_get data $name as number array"
    //% blockHidden=true
    //% name.shadow="spriteDataNumberArrayNameShadow"
    //% group="Data array"
    //% weight=10
    //% blockGap=8
    export function readDataNumberArray(sprite: Sprite, name: string): number[] {
        if (!sprite || !name) return undefined;
        const d = sprite.data;
        return d[name] as number[];
    }

    /**
     * Sets a string in the data of a sprite
     */
    //% blockId=spriteDataSetString block="set $sprite=variables_get data $name to string $value"
    //% blockHidden=true
    //% name.shadow="spriteDataStringNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function setDataString(sprite: Sprite, name: string, value: string) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Gets a string in the data of a sprite
     */
    //% blockId=spriteDataGetString block="$sprite=variables_get data $name as string"
    //% blockHidden=true
    //% name.shadow="spriteDataStringNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function readDataString(sprite: Sprite, name: string): string {
        if (!sprite || !name) return "";
        const d = sprite.data;
        return d[name] as string;
    }

    /**
     * Sets a string array in the data of a sprite
     */
    //% blockId=spriteDataSetStringArray block="set $sprite=variables_get data $name to string array $value"
    //% blockHidden=true
    //% name.shadow="spriteDataStringArrayNameShadow"
    //% group="Data array"
    //% weight=10
    //% blockGap=8
    export function setDataStringArray(sprite: Sprite, name: string, value: string[]) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Gets a string array in the data of a sprite
     */
    //% blockId=spriteDataGetStringArray block="$sprite=variables_get data $name as string array"
    //% blockHidden=true
    //% name.shadow="spriteDataStringArrayNameShadow"
    //% group="Data array"
    //% weight=10
    //% blockGap=8
    export function readDataStringArray(sprite: Sprite, name: string): string[] {
        if (!sprite || !name) return undefined;
        const d = sprite.data;
        return d[name] as string[];
    }

    /**
     * Sets a boolean in the data of a sprite
     */
    //% blockId=spriteDataSetBoolean block="set $sprite=variables_get data $name to boolean $value"
    //% blockHidden=true
    //% name.shadow="spriteDataBooleanNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function setDataBoolean(sprite: Sprite, name: string, value: boolean) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = !!value;
    }

    /**
     * Gets a boolean in the data of a sprite
     */
    //% blockId=spriteDataGetBoolean block="$sprite=variables_get data $name as boolean"
    //% blockHidden=true
    //% name.shadow="spriteDataBooleanNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function readDataBoolean(sprite: Sprite, name: string): boolean {
        if (!sprite || !name) return false;
        const d = sprite.data;
        return !!d[name];
    }
    

    /**
     * Sets a boolean array in the data of a sprite
     */
    //% blockId=spriteDataSetBooleanArray block="set $sprite=variables_get data $name to boolean array $value"
    //% blockHidden=true
    //% name.shadow="spriteDataBooleanArrayNameShadow"
    //% group="Data array"
    //% weight=10
    //% blockGap=8
    export function setDataBooleanArray(sprite: Sprite, name: string, value: boolean[]) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Gets a boolean array in the data of a sprite
     */
    //% blockId=spriteDataGetBooleanArray block="$sprite=variables_get data $name as boolean array"
    //% blockHidden=true
    //% name.shadow="spriteDataBooleanArrayNameShadow"
    //% group="Data array"
    //% weight=10
    //% blockGap=8
    export function readDataBooleanArray(sprite: Sprite, name: string): boolean[] {
        if (!sprite || !name) return undefined;
        const d = sprite.data;
        return d[name] as boolean[];
    }

    /**
     * Sets a sprite in the data of a sprite
     */
    //% blockId=spriteDataSetSprite block="set $sprite=variables_get data $name to sprite $value"
    //% blockHidden=true
    //% name.shadow="spriteDataSpriteNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function setDataSprite(sprite: Sprite, name: string, value: Sprite) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Gets a sprite in the data of a sprite
     */
    //% blockId=spriteDataGetSprite block="$sprite=variables_get data $name as sprite"
    //% blockHidden=true
    //% name.shadow="spriteDataSpriteNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function readDataSprite(sprite: Sprite, name: string): Sprite {
        if (!sprite || !name) return undefined;
        const d = sprite.data;
        return d[name] as Sprite;
    }

    /**
     * Sets a sprite array in the data of a sprite
     */
    //% blockId=spriteDataSetSpriteArray block="set $sprite=variables_get data $name to sprite array $value"
    //% blockHidden=true
    //% value.shadow="lists_create_with"
    //% name.shadow="spriteDataSpriteNameShadow"
    //% group="Data array"
    //% weight=10
    //% blockGap=8
    export function setDataSpriteArray(sprite: Sprite, name: string, value: Sprite[]) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Gets a sprite array in the data of a sprite
     */
    //% blockId=spriteDataGetSpriteArray block="$sprite=variables_get data $name as sprite array"
    //% blockHidden=true
    //% name.shadow="spriteDataSpriteArrayNameShadow"
    //% group="Data array"
    //% weight=10
    //% blockGap=8
    export function readDataSpriteArray(sprite: Sprite, name: string): Sprite[] {
        if (!sprite || !name) return undefined;
        const d = sprite.data;
        return d[name] as Sprite[];
    }
    
    /**
     * Sets an Image in the data of a sprite.
     * Deprecated. Use setDataImageValue instead
     */
    //% blockId=spriteDataSetImage block="set $sprite=variables_get data $name to image $value"
    //% blockHidden=true
    //% name.shadow="spriteDataImageNameShadow"
    //% group="Data"
    //% deprecated=1
    //% weight=9
    //% blockGap=8
    export function setDataImage(sprite: Sprite, name: string, value: Image) {
        setDataImageValue(sprite, name, value);
    }

    /**
     * Sets an Image in the data of a sprite
     */
    //% blockId=spriteDataSetImageValue block="set $sprite data $name to image $value"
    //% blockHidden=true
    //% name.shadow="spriteDataImageNameShadow"
    //% group="Data"
    //% sprite.shadow=variables_get
    //% value.shadow=screen_image_picker
    //% weight=9
    //% blockGap=8
    export function setDataImageValue(sprite: Sprite, name: string, value: Image) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Gets a sprite in the data of a sprite
     */
    //% blockId=spriteDataGetImage block="$sprite=variables_get data $name as image"
    //% blockHidden=true
    //% name.shadow="spriteDataImageNameShadow"
    //% group="Data"
    //% weight=9
    //% blockGap=8
    export function readDataImage(sprite: Sprite, name: string): Image {
        if (!sprite || !name) return undefined;
        const d = sprite.data;
        return d[name] as Image;
    }

    /**
     * Sets an Image array in the data of a sprite.
     * Deprecated. Use setDataImageValue instead
     */
    //% blockId=spriteDataSetImageArray block="set $sprite=variables_get data $name to image array $value"
    //% blockHidden=true
    //% value.shadow="lists_create_with" value.defl=screen_image_picker
    //% name.shadow="spriteDataImageArrayNameShadow"
    //% group="Data array"
    //% deprecated=1
    //% weight=9
    //% blockGap=8
    export function setDataImageArray(sprite: Sprite, name: string, value: Image[]) {
        setDataImageValueArray(sprite, name, value);
    }

    /**
     * Sets an Image array in the data of a sprite
     */
    //% blockId=spriteDataSetImageValueArray block="set $sprite data $name to image array $value"
    //% blockHidden=true
    //% value.shadow="lists_create_with" value.defl=screen_image_picker
    //% name.shadow="spriteDataImageArrayNameShadow"
    //% group="Data array"
    //% sprite.shadow=variables_get
    //% weight=9
    //% blockGap=8
    export function setDataImageValueArray(sprite: Sprite, name: string, value: Image[]) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    /**
     * Gets a sprite in the data of a sprite
     */
    //% blockId=spriteDataGetImageArray block="$sprite=variables_get data $name as image array"
    //% blockHidden=true
    //% name.shadow="spriteDataImageArrayNameShadow"
    //% group="Data array"
    //% weight=9
    //% blockGap=8
    export function readDataImageArray(sprite: Sprite, name: string): Image[] {
        if (!sprite || !name) return undefined;
        const d = sprite.data;
        return d[name] as Image[];
    }

    //% block="$name"
    //% blockId=spriteDataNumberNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedatanumber"
    export function _numberNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataNumberArrayNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedatanumberarray"
    export function _numberArrayNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataSpriteNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedatasprite"
    export function _spriteNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataSpriteArrayNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedataspritearray"
    export function _spriteArrayNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataBooleanNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedataboolean"
    export function _booleanNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataBooleanArrayNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedatabooleanarray"
    export function _booleanArrayNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataStringNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedatastring"
    export function _stringNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataStringArrayNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedatastringarray"
    export function _stringArrayNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataImageNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedataimage"
    export function _imageNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataImageArrayNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedataimagearray"
    export function _imageArrayNameShadow(name: string) {
        return name
    }
}

export default sprdata;
