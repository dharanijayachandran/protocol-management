import { Injectable } from '@angular/core';
import { DataSubProtocolTag } from '../../model/dataSubProtocolTag';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataProtocolTag } from '../../model/dataProtocolTag';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';
import { TagLengthUnit } from 'src/app/shared/model/tagLengthUnit';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DataSubProtocolTagService {

  dataSubProtocol: DataSubProtocol;

  setDataSubProtocol(dataSubProtocol: DataSubProtocol) {
    this.dataSubProtocol = dataSubProtocol
  }

  constructor(private httpClient: HttpClient) { }

  apiurl = environment.baseUrl_gatewayManagement;

  getDataSubProtocolTagById(id: any) {
    return this.httpClient.get<DataSubProtocolTag>(this.apiurl + 'dataSubProtocolTagById/'+id);
  }
  saveDataSubProtocolTag(dataSubProtocolTag: DataSubProtocolTag) {
    return this.httpClient.post<any>(this.apiurl + 'dataSubProtocolTag', dataSubProtocolTag);
  }

  updateDataSubProtocolTag(dataSubProtocolTag: DataSubProtocolTag) {
    return this.httpClient.put<any>(this.apiurl + 'dataSubProtocolTag', dataSubProtocolTag);
  }

   getDataFormats() {
    return this.httpClient.get<DataProtocolFormat[]>(this.apiurl + 'dataProtocolFormats');
  }
  getDataProtocolTagsByDataProtocolId(id: number) {
    return this.httpClient.get<DataProtocolTag[]>(this.apiurl + 'dataProtocolTagsByDataProtocolId/'+id)
  }
  getDataSubProtocolTagsByDataSubProtocolId(id: any) {
    return this.httpClient.get<DataSubProtocolTag[]>(this.apiurl + 'dataSubProtocolTagsByDataSubProtocolId/'+ id);
  }

  deleteGatewayCommIOTag(id, userId) {
    return this.httpClient.delete<DataSubProtocolTag[]>(this.apiurl + 'dataSubProtocolTag/'+id+'/'+userId);
  }

  getTagLengthUnits(){
    return this.httpClient.get<TagLengthUnit[]>(this.apiurl + 'tagLengthUnits');
  }
}
