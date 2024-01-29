import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSubProtocolDH } from '../../model/dataSubProtocolDH';
import { DataProtocol } from '../../model/dataProtocol';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { DataSubProtocolDHService } from '../../services/DataSubProtocolDH/data-sub-protocol-dh.service';
import { DialogService, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { globalShareServices } from 'src/app/communication-protocol/pages/globalShareServices';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-data-sub-protocol-dh',
  templateUrl: './data-sub-protocol-dh.component.html',
  styleUrls: ['./data-sub-protocol-dh.component.css']
})
export class DataSubProtocolDhComponent implements OnInit {
  showLoaderImage: boolean;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('dataSubProtocolDHForm')) {
      if (this.dataSubProtocolDHForm.dirty) {
        this.dialogService.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
        // returning false will show a confirm dialog before navigating away
      } else {
        return true; // returning true will navigate without confirmation
      }
      return this.dialogService.navigateAwaySelection$;
    } else return true;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  dataSubProtocolDHFormView = true;
  dataSubProtocolDHReadModeView = false;
  dataSubProtocolDHViewMode = true;
  dataSubProtocolDHForm: FormGroup;
  dataSubProtocolDH: DataSubProtocolDH = new DataSubProtocolDH();
  dataProtocolFormats: any[];
  selectedValue: any;
  dataProtocol: DataProtocol;
  datasubProtocol: DataSubProtocol;
  templateName: string;
  communication: string;
  warningFlag: string;
  dataSubProtocolDHFormViewEdit = false;
  dataSubProtocolDHFormAdd = false;

  public dataProtocolFormatsFields: Object = {
    text: 'name',
    value: 'id'
  };
  public onFilteringDataProtocolFormats: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataProtocolFormats);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown:string ='Ascending';
  responseFormatId:any;
  public dataProtocolFormatsWaterMark: string = 'Select Data Format';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;
  constructor(private globalService: globalSharedService,
    private globalShareService: globalShareServices,
    private dataSubProtocolDHService: DataSubProtocolDHService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getDataProtocolFormats();
    this.datasubProtocol = this.dataSubProtocolDHService.dataSubProtocol;
    this.templateName = this.datasubProtocol.dataProtocol.name;
    this.communication = this.datasubProtocol.commProtocol.name;
    let id = this.globalShareService.assignId;
    let operation = this.globalShareService.name;
    if (id != null && operation === 'view') {
      this.getDataSUbProtocolDHByIdForVIew(id);
      this.dataSubProtocolDHFormView = false;
      this.dataSubProtocolDHReadModeView = false;
      this.dataSubProtocolDHViewMode = true;
      this.dataSubProtocolDHFormAdd = false;
    }
    else if (id != null && operation === 'edit') {
      this.validateDataSubProtocolDHForm();
      this.getDataSubProtocolDHForEdit(id);
      this.dataSubProtocolDHFormView = true;
      this.dataSubProtocolDHReadModeView = false;
      this.dataSubProtocolDHViewMode = false;
      this.dataSubProtocolDHFormViewEdit = true;
      this.dataSubProtocolDHFormAdd = false;
    }
    else {
      this.validateDataSubProtocolDHForm();
      this.dataSubProtocolDHFormView = true;
      this.dataSubProtocolDHReadModeView = false;
      this.dataSubProtocolDHViewMode = false;
      this.dataSubProtocolDHFormViewEdit = false;
      this.dataSubProtocolDHFormAdd = true;
    }
  }

  validateDataSubProtocolDHForm() {
    this.dataSubProtocolDHForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
      dhCode: [null, [Validators.required]],
      description: [null],
      operatioMode: [null, [Validators.required]],
      sendResponse: false,
      responseFormat: [null],
      responseFormatId: [null],
      responseTagSeperator: [null],
      status: ['Active'],
      isEndValidatorCheckEnabled: this.datasubProtocol.isEndValidatorCheckEnabled,
      isStartValidatorCheckEnabled: this.datasubProtocol.isStartValidatorCheckEnabled,
      isErrorCheckEnabled: this.datasubProtocol.isErrorCheckEnabled,
      isLengthCheckEnabled: this.datasubProtocol.isLengthCheckEnabled
    });
  }

  getDataProtocolFormats() {
    this.dataSubProtocolDHService.getDataProtocolFormats().subscribe(res => {
      this.dataProtocolFormats = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Warning, error);
      })
  }

  cancelGatewayIODHForm(event: Event) {
    // this.dataSubProtocolDHForm.reset();
    this.globalShareService.setGlobalId(this.datasubProtocol.dataProtocol.id);
    this.globalShareService.setGlobalName('communication');
    this.router.navigate(['../'], { relativeTo: this.route })
  }

  //Review and Save method
  createGatewayIODataHandler(): void {
    this.dataSubProtocolDHFormView = false;
    this.dataSubProtocolDHFormViewEdit = false;
    this.dataSubProtocolDHReadModeView = true;
    this.dataSubProtocolDH = <DataSubProtocolDH>this.dataSubProtocolDHForm.value;
  }

  // back Button
  backButton(elementId) {
    this.dataSubProtocolDHFormView = true;
    this.dataSubProtocolDHFormViewEdit = true;
    this.dataSubProtocolDHReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  createOrUpdateGatewayIODataHandler(): void {
    this.showLoaderImage = true;
    let userId = sessionStorage.getItem('userId');
    if (this.dataSubProtocolDH.id === null) {
      this.dataSubProtocolDH.createdBy = parseInt(userId);
      this.dataSubProtocolDH.dataSubProtocolId = this.datasubProtocol.id;
      this.dataSubProtocolDHService.saveDataSubProtocolDH(this.dataSubProtocolDH).subscribe((res) => {
        this.globalShareService.GettingId(this.datasubProtocol.dataProtocol.id);
        this.globalShareService.GettingString('communication');
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.dataSubProtocolDH.updatedBy = parseInt(userId);
      this.dataSubProtocolDH.dataSubProtocolId = this.datasubProtocol.id;
      this.dataSubProtocolDHService.updateDataSubProtocolDH(this.dataSubProtocolDH).subscribe((res) => {
        this.globalShareService.GettingId(this.datasubProtocol.dataProtocol.id);
        this.globalShareService.GettingString('communication');
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // Redirect to
  redirectTo() {
    this.globalShareService.GettingId(this.datasubProtocol.dataProtocol.id);
    this.globalShareService.GettingString('communication');
    this.router.navigate(['../'], { relativeTo: this.route });
    this.dataSubProtocolDHForm.reset();
  }

  parseInt(id) {
    return parseInt(id);
  }

  cancelGatewayIODHView() {
    this.globalShareService.GettingId(this.datasubProtocol.dataProtocol.id);
    this.globalShareService.GettingString('communication');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getDataSUbProtocolDHByIdForVIew(id) {
    this.dataSubProtocolDHService.getDataSubProtocolDHById(id)
      .subscribe(data => {
        this.dataSubProtocolDH = data;
        if (data.status === 'A') {
          this.dataSubProtocolDH.status = 'Active';
        }else {
          this.dataSubProtocolDH.status = 'In Active'
        }
      });
  }

  getDataSubProtocolDHForEdit(id) {
    this.dataSubProtocolDHService.getDataSubProtocolDHById(id)
      .subscribe(data => {
        let formatId = null;
        if (null != data.responseFormat) {
          formatId = data.responseFormat.id
        }
        if (data.status === 'A') {
          data.status = 'Active'
        }
        else {
          data.status = 'In_Active'
        }
        this.dataSubProtocolDHForm.patchValue({
          id: data.id,
          name: data.name,
          dhCode: data.dhCode,
          description: data.description,
          operatioMode: data.operatioMode,
          sendResponse: data.sendResponse,
          responseFormatId: formatId,
          responseTagSeperator: data.responseTagSeperator,
          status: data.status,
          isEndValidatorCheckEnabled: data.isEndValidatorCheckEnabled,
          isStartValidatorCheckEnabled: data.isStartValidatorCheckEnabled,
          isErrorCheckEnabled: data.isErrorCheckEnabled,
          isLengthCheckEnabled: data.isLengthCheckEnabled
        })
      });
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.dataSubProtocolDHForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  // Reset
  resetGatewayTemplateForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.dataSubProtocolDH = <DataSubProtocolDH>this.dataSubProtocolDHForm.value;
    if (this.dataSubProtocolDH.id === null) {
      this.validateDataSubProtocolDHForm();
    }
    else {
      this.validateDataSubProtocolDHForm();
      this.getDataSubProtocolDHForEdit(this.dataSubProtocolDH.id);
    }
  }
  dataProtocolFormatsOnChange($event){
    if ($event.value) {
      this.dataSubProtocolDHForm.controls['responseFormatId'].setValue($event.itemData.id);
    }
  }

}
