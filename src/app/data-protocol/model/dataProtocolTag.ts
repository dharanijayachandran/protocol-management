import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';
import { DataProtocol } from './dataProtocol';

export class DataProtocolTag{
   dataProtocol: DataProtocol;
   dataProtocolId: number;
    name: string;
    tagKeyName: string;
    description: string;
    tagType: string;
    tagIOMode:string;
    dataTypeId: number;
    dataTypeName: string;
    dataProtocolStandardTag: DataProtocolFormat;
    dataProtocolStandardTagId: any;
    engUnitId: number;
    id: number;
    status: string;
    updatedBy: number;
    updatedOn: Date;
    createdBy: number;
    createdOn: Date;
}
