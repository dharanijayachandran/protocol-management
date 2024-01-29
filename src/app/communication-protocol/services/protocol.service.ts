import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Protocol } from '../model/protocol';
import { ProtocolParamGroup } from '../model/protocol-param-group';
import { ProtocolParam } from '../model/protocol-param';
import { ProtocolParamValue } from '../model/protocol-param-value';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  public tabLevel: string;
  apiurl = environment.baseUrl_gatewayManagement;
  constructor(private http: HttpClient) { }

  setTabLevel(tabLevel) {
    this.tabLevel = tabLevel;
    setTimeout(() => {
      this.tabLevel = null;
    }, 2000)
  }

  getProtocolList(): Observable<Protocol[]> {
    return this.http.get<Protocol[]>(this.apiurl + 'getAllProtocol');
  }

  getProtocolByProtocolId(protocolId): Observable<Protocol> {
    return this.http.get<Protocol>(this.apiurl + 'getProtocolByProtocolId/' + protocolId);
  }

  addProtocol(protocol: Protocol): Observable<Protocol> {
    return this.http.post<Protocol>(`${this.apiurl + 'addProtocol'}`, protocol, httpOptions);
  }

  updateProtocol(protocol: Protocol): Observable<Protocol> {
    return this.http.put<Protocol>(`${this.apiurl + 'updateProtocol'}`, protocol, httpOptions);
  }

  deleteProtocol(protocolId, userId): Observable<Protocol> {
    return this.http.delete<Protocol>(`${this.apiurl + 'deleteProtocol/' + protocolId + "/" + userId}`, httpOptions);
  }

  getAllProtocolParamGroupByProtocolId(protocolId): Observable<ProtocolParamGroup[]> {
    return this.http.get<ProtocolParamGroup[]>(this.apiurl + 'getAllProtocolParamGroupByProtocolId/' + protocolId);
  }

  getProtocolParamGroupByProtocolParamGroupId(protocolParamGroupId): Observable<ProtocolParamGroup> {
    return this.http.get<ProtocolParamGroup>(this.apiurl + 'getProtocolParamGroupByProtocolParamGroupId/' + protocolParamGroupId);
  }

  addProtocolParamGroup(protocolParamGroup: ProtocolParamGroup): Observable<ProtocolParamGroup> {
    return this.http.post<ProtocolParamGroup>(`${this.apiurl + 'addProtocolParamGroup'}`, protocolParamGroup, httpOptions);
  }

  updateProtocolParamGroup(protocolParamGroup: ProtocolParamGroup): Observable<ProtocolParamGroup> {
    return this.http.put<ProtocolParamGroup>(`${this.apiurl + 'updateProtocolParamGroup'}`, protocolParamGroup, httpOptions);
  }

  deleteProtocolParamGroup(protocolParamGroupId, userId): Observable<ProtocolParamGroup> {
    return this.http.delete<ProtocolParamGroup>(`${this.apiurl + 'deleteProtocolParamGroup/' + protocolParamGroupId + '/' + protocolParamGroupId}`, httpOptions);
  }

  getAllProtocolParamByProtocolParamGroupId(protocolParamGroupId): Observable<ProtocolParam[]> {
    return this.http.get<ProtocolParam[]>(this.apiurl + 'getAllProtocolParamByProtocolParamGroupId/' + protocolParamGroupId);
  }

  getProtocolParamByProtocolParamId(protocolParamId): Observable<ProtocolParam> {
    return this.http.get<ProtocolParam>(this.apiurl + 'getProtocolParamByProtocolParamId/' + protocolParamId);
  }

  addProtocolParam(protocolParam: ProtocolParam): Observable<ProtocolParam> {
    return this.http.post<ProtocolParam>(`${this.apiurl + 'addProtocolParam'}`, protocolParam, httpOptions);
  }

  updateProtocolParam(protocolParam: ProtocolParam): Observable<ProtocolParam> {
    return this.http.put<ProtocolParam>(`${this.apiurl + 'updateProtocolParam'}`, protocolParam, httpOptions);
  }

  deleteProtocolParam(protocolParamId, userId): Observable<any> {
    // 
    return this.http.delete<any>(`${this.apiurl + 'deleteProtocolParam/' + protocolParamId + '/' + userId}`, httpOptions);
  }

  getAllProtocolParamValueByProtocolParamId(protocolParamId): Observable<ProtocolParamValue[]> {
    return this.http.get<ProtocolParamValue[]>(this.apiurl + 'getAllProtocolParamValueByProtocolParamId/' + protocolParamId);
  }

  getProtocolParamValueWithRefValueByProtocolParamId(protocolParamId): Observable<ProtocolParamValue[]> {
    return this.http.get<ProtocolParamValue[]>(this.apiurl + 'getProtocolParamValueWithRefValueByProtocolParamId/' + protocolParamId);
  }

  getProtocolParamValueByProtocolParamValueId(protocolParamValueId): Observable<ProtocolParamValue> {
    return this.http.get<ProtocolParamValue>(this.apiurl + 'getProtocolParamValueByProtocolParamValueId/' + protocolParamValueId);
  }

  addProtocolParamValue(protocolParamValue: ProtocolParamValue): Observable<ProtocolParamValue> {
    return this.http.post<ProtocolParamValue>(`${this.apiurl + 'addProtocolParamValue'}`, protocolParamValue, httpOptions);
  }

  updateProtocolParamValue(protocolParamValue: ProtocolParamValue): Observable<ProtocolParamValue> {
    return this.http.put<ProtocolParamValue>(`${this.apiurl + 'updateProtocolParamValue'}`, protocolParamValue, httpOptions);
  }

  deleteProtocolParamValue(protocolParamValueId, userId): Observable<ProtocolParamValue> {
    return this.http.delete<ProtocolParamValue>(`${this.apiurl + 'deleteProtocolParamValue/' + protocolParamValueId + '/' + userId}`, httpOptions);
  }
}
