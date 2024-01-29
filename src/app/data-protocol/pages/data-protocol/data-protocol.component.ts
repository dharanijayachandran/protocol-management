import { Component, OnInit } from '@angular/core';
// import { globalShareServices } from '../../../services/global/globalShareServices';
import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { globalShareServices } from 'src/app/communication-protocol/pages/globalShareServices';

@Component({
  selector: 'app-data-protocol',
  templateUrl: './data-protocol.component.html',
  styleUrls: ['./data-protocol.component.css'],
  providers: [
    NgbTabset
  ]
})
export class DataProtocolComponent implements OnInit {

  constructor(private globalSharedService: globalShareServices, public tabset: NgbTabset) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.globalSharedService.name != null) {
      this.tabNameMessage();
      let myTab = document.getElementById(this.globalSharedService.name);
      myTab.click();
    }
  }

  gettingGatewayTemplateDetail = {};

  receiveMessage($event) {
    this.gettingGatewayTemplateDetail = $event
  }


   // To navigate based on click form tab or action place
   isEnableSwitchTab = false;
   tabNameMessage() {
     this.isEnableSwitchTab = true;
     this.isEnableSwitchTabStatus();
   }
 
   // isEnableSwitch status false after one second
   isEnableSwitchTabStatus() {
     setTimeout(() => {
       this.isEnableSwitchTab = false;
     }, 500);
   }
 
   public beforeChange($event: NgbTabChangeEvent) {
     if ($event.nextId === 'DPTag' && !this.isEnableSwitchTab ||
        $event.nextId === 'communication' && !this.isEnableSwitchTab) {
       $event.preventDefault();
     }
   }

}
