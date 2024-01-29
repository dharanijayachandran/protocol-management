import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommProtocol } from 'src/app/shared/model/commprotocol';
import { environment } from 'src/environments/environment';
import { DataProtocol } from '../../model/dataProtocol';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DataProtocolService {

  apiurl = environment.baseUrl_gatewayManagement;
  constructor(private http: HttpClient) { }

  getDataProtocolList(businessEntityId: number) {
    return this.http.get<DataProtocol[]>(this.apiurl + 'dataProtocolsByBusinessEntityId/' + businessEntityId);
  }

  getCommprotocolList(){
    return this.http.get<CommProtocol[]>(this.apiurl + 'getAllProtocol');
  }

  saveDataProtocol(dataProtocol: DataProtocol){
    return this.http.post<any>(this.apiurl + 'dataProtocol', dataProtocol);
  }

  getDataProtocolById(id: number){
    return this.http.get<DataProtocol>(this.apiurl + 'dataProtocolById/' + id);
  }

  updateDataProtocol(dataProtocol: DataProtocol){
    return this.http.put<any>(this.apiurl + 'dataProtocol', dataProtocol);
  }

  deleteDataProtocol(dataProtocolId: number, userId: number, beId: number) {
    return this.http.delete<any>(this.apiurl + 'dataProtocol/'+dataProtocolId+'/'+userId+'/'+beId);
  }
}
