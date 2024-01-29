import { CommProtocol } from 'src/app/shared/model/commprotocol';
import { DataProtocol } from 'src/app/shared/model/dataProtocol';
import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';
import { ErrorCheckAlgorithm } from 'src/app/shared/model/errorCheckAlgorithm';
import { DataSubProtocolDH } from './dataSubProtocolDH';
import { DataSubProtocolTag } from './dataSubProtocolTag';


export class DataSubProtocol {
    id: number;
    dataProtocol: DataProtocol;
    dataProtocolId: number;
    name: string;
    description: string;
    commProtocolIdentifierOne: string;
    commProtocolIdentifierTwo: string;
    commProtocolIdentifierThree: string;
    dataProtocolTagSeparator: string;
    dataSubProtocolFormat: DataProtocolFormat;
    dataSubProtocolFormatID: number;
    commProtocol: CommProtocol;
    commProtocolId: number;
    startValidator: string;
    endValidator: string;
    errorCheckAlgorithmId: any;
    errorCheckAlgorithm: ErrorCheckAlgorithm;
    dataSubProtocolDHs: DataSubProtocolDH[];
    dataSubProtocolTags: DataSubProtocolTag[];
    createdBy: number;
    updatedBy: number;
    errorCheckTypeId: any;
    isEndValidatorCheckEnabled: boolean;
    isStartValidatorCheckEnabled: boolean;
    isErrorCheckEnabled: boolean;
    isLengthCheckEnabled: boolean;
}
