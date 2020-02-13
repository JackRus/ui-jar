import { IFormatConverter, uintToString, stringToUint } from './shared-models';

export class JsonFormatConverter implements IFormatConverter
{
    getMediaType(): string {
        return 'application/json';
    }

    getCharset(): string {
        return 'utf-8';
    }

    convertToObject(data: ArrayBuffer) : any {
        let str = uintToString(new Uint8Array(data));
        return JSON.parse(str);
    }

    convertToData(obj: any) : ArrayBuffer {
        let str = JSON.stringify(obj);
        return stringToUint(str).buffer as ArrayBuffer;
    }
}
