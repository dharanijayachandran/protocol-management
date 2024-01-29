import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { globalShareServices } from '../globalShareServices';

@Component({
  selector: 'app-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class ProtocolComponent implements OnInit {

  constructor(private globalService: globalShareServices) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.globalService.name != null) {
      this.tabNameMessage();
      let myTab = document.getElementById(this.globalService.name);
      myTab.click();
    }
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
    if ($event.nextId === 'mngProtocolParamGroup' && !this.isEnableSwitchTab ||
      $event.nextId === 'mngProtocolParam' && !this.isEnableSwitchTab ||
      $event.nextId === 'mngprotocolParamValueView' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    }
  }

}
