import { DataSubProtocol } from './dataSubProtocol';
import { DataSubProtocolDHTag } from './dataSubProtocolDHTag';
import { DataSubProtocolDHResponseTag } from './dataSubProtocolDHResponseTag';
import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';

export class DataSubProtocolDH {
    id: number;
    dataSubProtocol: DataSubProtocol;
    dataSubProtocolId: number;
    dhCode: string;
    name: string;
    description: string;
    operatioMode: string;
    responseTagSeperator: string;
    dataSubProtocolDHTags: DataSubProtocolDHTag[];
    dataSubProtocolDHResponseTags: DataSubProtocolDHResponseTag[];
    sendResponse: boolean;
    responseFormat: DataProtocolFormat;
    responseFormatId: any;
    status: string
    createdBy: number;
    updatedBy: number;
    dataProtocolId: number;
    dataProtocolName : string;
    communication: string;
    sendResponseStr: string;
    templateName:string;
    operationMode:string;
    isEndValidatorCheckEnabled: boolean;
    isStartValidatorCheckEnabled: boolean;
    isErrorCheckEnabled: boolean;
    isLengthCheckEnabled: boolean;
}
