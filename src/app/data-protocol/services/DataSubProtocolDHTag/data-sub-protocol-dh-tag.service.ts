import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataSubProtocolDH } from '../../model/dataSubProtocolDH';
import { DataProtocolTag } from '../../model/dataProtocolTag';
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
export class DataSubProtocolDhTagService {

  apiurl = environment.baseUrl_gatewayManagement;

  constructor(private http: HttpClient) { }


  getDataProtocolTagsByProtocolId(id: number, operationMode: any) {
    return this.http.get<DataProtocolTag[]>(this.apiurl + 'dataProtocolTagsByDataProtocolIdAndMode/'+id +'/' + operationMode)
  }
  getDataFormats() {
    return this.http.get<DataProtocolFormat[]>(this.apiurl + 'dataProtocolFormats');
  }
  getDataSubProtocolDHByDHId(ioDHId: any) {
    return this.http.get<DataSubProtocolDH>(this.apiurl + 'dataSubProtocolDHByDataSubProtocolDHId/' + ioDHId);
  }
  getTagLengthUnits() {
    return this.http.get<TagLengthUnit[]>(this.apiurl + 'tagLengthUnits');
  }
  saveDataSubProtocolDH(saveDataSubProtocolDH: DataSubProtocolDH) {
    return this.http.post<any>(this.apiurl + 'dataSubProtocolDHTags',saveDataSubProtocolDH);
  }

  saveDataSubProtocolDHResponseTags(saveDataSubProtocolDH: DataSubProtocolDH) {
    return this.http.post<any>(this.apiurl + 'dataSubProtocolDHResponseTags',saveDataSubProtocolDH);
  }

}
