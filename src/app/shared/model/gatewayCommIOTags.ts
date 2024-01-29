import { DataProtocolFormat } from './DataProtocolFormat';
import { GatewayCommProtocol } from './gatewayCommProtocol';
import { GatewayIOTag } from './gatewayIOTag';


export class GatewayCommProtocolIOTag {
	id: number;
	nodeCommProtocolId: number;
	tagIndex: number;
	tagLength: number;
	tagLengthUnit: number;
	tagKeyName: string;
	dataFormatId: number
	tagSeprator: string;
	parentIOTagId: number;
	nodeIoTagId: number;
	parentNodeCommProtocolIoTagId: number
	gatewayCommProtocol: GatewayCommProtocol;
	status: string;
	updated_by: number;
	updated_on: Date;
	created_by: number;
	created_on: Date;
	gatewayIOTag: GatewayIOTag;
	dataFormat: DataProtocolFormat;
	gatewayCommProtocolIOTags: GatewayCommProtocolIOTag[];
	dateTimeFormat:string;
}