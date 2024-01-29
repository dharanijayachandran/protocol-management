import { DataProtocolFormat } from './DataProtocolFormat';
import { GatewayIODHTag } from './gatewayIODHTag';
import { GatewayIODHResponseTag } from './gatewayIODhResponseTag';

export class GatewayIODataHandler {
    id: number;
    name: string;
    dhCode: string;
    description: string;
    operationMode: string;
    publishIntervalMs: number
    retryCount: number
    retryTimeoutMs: number
    sendResponse: any;
    responseFormat: DataProtocolFormat;
    responseFormatId: number;
    responseTagSeperator: string;
    status: string
    createdBy: number;
    updatedBy: number;
    nodeCommProtocolId: number;
    nodeIoDhTags: GatewayIODHTag[];
    nodeIoDhResponseTags: GatewayIODHResponseTag[];
    gatewayId: number;
    templateName : string;
    communication: string;

}