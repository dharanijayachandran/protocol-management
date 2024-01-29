import { GatewayCommProtocol } from './gatewayCommProtocol';
import { DataProtocol } from './dataProtocol';
import { GatewayType } from './gatewayType';
import { GatewayModel } from './gateway-model';

export class GatewayTemplate {

    id: any;
    businessEntityId: number;
    name: string;
    created_by: string;
    createdOn: any;
    updated_by: number;
    gatewayModelId: number
    gatewayTypeId: number;
    timeZoneId: string;
    dataProtocolId: number;
    gatewayModel: GatewayModel;
    dataProtocol: DataProtocol;
    gatewayCommProtocols: GatewayCommProtocol[];
    gatewayType: GatewayType;
    status: string;
}