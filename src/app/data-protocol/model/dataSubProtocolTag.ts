import { DataProtocolTag } from './dataProtocolTag';
import { DataSubProtocol } from './dataSubProtocol';
import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';

export class DataSubProtocolTag {
    id: number;
    dataSubProtocol: DataSubProtocol;
    dataSubProtocolId: number;
    //dataProtocolTag: DataProtocolTag;
    dataProtocolTagId: number;
    dataProtocolTag: DataProtocolTag
    tagIndex: any;
    tagLength: any;
    tagLengthUnit: string;
    tagKeyName: string;
    dataProtocolTagSeparator: string;
    parentDataSubProtocolTagId: any;
    //dataSubProtocolDHTagValues: DataSubProtocolDHTagValue[];
    dataSubProtocolTags: DataSubProtocolTag[];
    dataSubProtocolTagFormat: DataProtocolFormat;
    dataSubProtocolTagFormatId: any;
    isParticipantInLength: Boolean;
    isParticipantInErrorCheck: Boolean;
    dateTimeFormat: string;
    createdBy: number;
    updatedBy: number;
    status: string;
    tagLengthUnitValue:string;
    tagName:string;
}
