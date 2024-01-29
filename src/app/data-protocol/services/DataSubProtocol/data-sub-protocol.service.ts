import { Injectable } from '@angular/core';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataSubProtocolTag } from '../../model/dataSubProtocolTag';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataSubProtocolService {

  apiurl = environment.baseUrl_gatewayManagement;
  dataSubProtocol: DataSubProtocol;

  constructor(private http: HttpClient) { }

  saveDataSubProtocol(dataSubProtocol: DataSubProtocol): Observable<DataSubProtocol> {
    return this.http.post<DataSubProtocol>(`${this.apiurl + 'dataSubProtocol'}`, dataSubProtocol, httpOptions);
  }

  getDataSubProtocolsByDataProtocolId(dataProtocolId: number) {
    return this.http.get<DataSubProtocol[]>(this.apiurl + 'dataSubProtocolsByDataProtocolId/' + dataProtocolId);
  }

  getDataSubProtocolTagsByDataSubProtocolId(dataSubProtocolId: number) {
    return this.http.get<DataSubProtocolTag[]>(this.apiurl + 'dataSubProtocolTagsByDataSubProtocolId/' + dataSubProtocolId);
  }

  setDataSubProtocol(dataSubProtocol: DataSubProtocol) {
    this.dataSubProtocol = dataSubProtocol;
  }

  deleteDataSubProtocolTag(id: number, userId: number) {
    return this.http.delete<DataSubProtocolTag>(this.apiurl + 'dataSubProtocolTag/' + id + '/' + userId)
  }
}
