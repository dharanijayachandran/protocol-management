import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataProtocolTag } from '../../model/dataProtocolTag';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DataProtocolTagService {
  
  
  apiurl = environment.baseUrl_gatewayManagement;
  constructor(private http: HttpClient) { }

  getDataProtocolTagsByDataProtocolId(dataProtocolId: number){
    return this.http.get<DataProtocolTag[]>(this.apiurl + 'dataProtocolTagsByDataProtocolId/'+dataProtocolId)
  }

  saveDataProtocolTag(dataProtocolTag: DataProtocolTag){
    return this.http.post<any>(this.apiurl + 'dataProtocolTag', dataProtocolTag);
  }

  updateDataProtocolTag(dataProtocolTag: DataProtocolTag){
    return this.http.put<any>(this.apiurl + 'dataProtocolTag', dataProtocolTag);
  }

  getDataProtocolTagById(dataProtocolTagId: number) {
    return this.http.get<DataProtocolTag>(this.apiurl + 'dataProtocolTagById/'+dataProtocolTagId)
  }

  deletDtataProtocolTag(dataProtocolTagId: number, userId: number) {
    return this.http.delete<any>(this.apiurl + 'dataProtocolTag/'+ dataProtocolTagId +'/'+ userId);
  }

}
