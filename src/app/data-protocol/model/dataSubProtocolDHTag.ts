import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';
import { DataProtocolTag } from './dataProtocolTag';
import { DataSubProtocolDH } from './dataSubProtocolDH';

export class DataSubProtocolDHTag{
    id: number;
	dataSubProtocolDHId: number;
	dataSubProtocolDHName:string;
	tagIndex: number;
	tagLength: number;
	tagLengthUnit: string;
	tagLengthUnitName: string;
	tagKeyName: string;
	dataSubProtocolDHTagFormatId: number;
	dataFormateName: string
	dataProtocolTagSeperator: string;
	dataProtocolTagId: number;
	dataProtocolTagName; string
	parentDataSubProtocolDHTagId: number;
	parentNodeIoDHTag: string;
	isParticipantInLength: boolean;
    isParticipantInErrorCheck: boolean;
	status: string;
	updatedBy: number;
	updated_on: Date;
	createdBy: number;
	created_on: Date;
	dataProtocolTag: DataProtocolTag;
	dataSubProtocolDHTagFormat: DataProtocolFormat;
	//nodeIoTag: GatewayIOTag;
    dataSubProtocolDH: DataSubProtocolDH;
    dataSubProtocolDHTags: DataSubProtocolDHTag[];
	dataSubProtocolDHTag: DataSubProtocolDHTag;
	dateTimeFormat: string;
	isAssign :Boolean;
	defaultValue:string;
	tagName: string;

}
