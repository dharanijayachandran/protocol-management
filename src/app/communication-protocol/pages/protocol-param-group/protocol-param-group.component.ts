import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProtocolService } from '../../services/protocol.service';

@Component({
  selector: 'app-protocol-param-group',
  templateUrl: './protocol-param-group.component.html',
  styleUrls: ['./protocol-param-group.component.css']
})
export class ProtocolParamGroupComponent implements OnInit {

  protocolId: number;

  constructor(private route: ActivatedRoute, private protocolService: ProtocolService) { }

  ngOnInit() {

    /* this.route.params.subscribe(params => {
      this.protocolId = params['protocolId'];
    });
    

    this.getProtocolData(this.protocolId); */
  }

  /* getProtocolData(protocolId: number) {

    
    this.protocolService.getProtocolByProtocolId(protocolId)
      .subscribe(
        res => {

          
          sessionStorage.setItem('protocolName', res.name);
        },
        error => {
          
        });
  } */

}
