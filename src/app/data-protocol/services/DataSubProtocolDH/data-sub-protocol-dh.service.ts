import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataSubProtocolDH } from '../../model/dataSubProtocolDH';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';

@Injectable({
  providedIn: 'root'
})
export class DataSubProtocolDHService {

  apiurl = environment.baseUrl_gatewayManagement;

  constructor(private http: HttpClient) { }

  dataSubProtocol: DataSubProtocol;

  setDataSubProtocol(dataSubProtocol: DataSubProtocol) {
    this.dataSubProtocol = dataSubProtocol
  }

  updateDataSubProtocolDH(dataSubProtocolDH: DataSubProtocolDH) {
    return this.http.put<any>(this.apiurl + 'dataSubProtocolDH' , dataSubProtocolDH);
  }
  saveDataSubProtocolDH(dataSubProtocolDH: DataSubProtocolDH) {
    return this.http.post<any>(this.apiurl + 'dataSubProtocolDH' , dataSubProtocolDH);
  }
  getDataProtocolFormats() {
    return this.http.get<DataProtocolFormat[]>(this.apiurl + 'dataProtocolFormats');
  }
  getDataSubProtocolDHById(id: any) {
    return this.http.get<DataSubProtocolDH>(this.apiurl + 'dataSubProtocolDHById/' + id);
  }

  getDataSubProtocolDHsByDataSubProtocolId(dataSubProtocolId: number) {
    return this.http.get<DataSubProtocolDH[]>(this.apiurl + 'dataSubProtocolDHsByDataSubProtocolId/' + dataSubProtocolId);
  }

  deleteDataSubProtocolDH(id: number, userId: number) {
    return this.http.delete<DataSubProtocolDH>(this.apiurl + 'dataSubProtocolDH/' + id + '/' + userId)
  }
}
