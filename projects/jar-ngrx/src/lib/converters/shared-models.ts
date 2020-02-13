export interface IFormatConverter
{
    /**
     * return the media type supported by this format.
     */
    getMediaType(): string;

    /**
     * return the charsets supported by this format converter.
     */
    getCharset(): string;

    /**
     * convert the data to a javascript object. 
     * @param data the data to convert.
     */
    convertToObject(data: ArrayBuffer) : any;

    /**
     * convert javascript object to data.
     * @param obj the javascript object to convert.
     */
    convertToData(obj: any) : ArrayBuffer;   
}

//copied from stack overflow https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
export function stringToUint(string) {
    var str = btoa(unescape(encodeURIComponent(string))),
        charList = string.split(''),
        uintArray = [];
    for (var i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
}

export function uintToString(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
}