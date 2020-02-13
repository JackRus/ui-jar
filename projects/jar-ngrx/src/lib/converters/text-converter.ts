import { IFormatConverter, uintToString, stringToUint } from './shared-models';

export class TextFormatConverter implements IFormatConverter
{
    getMediaType(): string {
        return 'text/plain'
    }

    getCharset(): string {
        return 'utf-8';
    }

    convertToObject(data: ArrayBuffer) : any {
        return uintToString(new Uint8Array(data));
    }

    convertToData(obj: any) : ArrayBuffer {
        let str: string;
        if (typeof obj === 'string') {
          str = obj;
        } else {
          str = JSON.stringify(obj);
        }
        return stringToUint(str).buffer as ArrayBuffer;
    }
}