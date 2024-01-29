import { Component, OnInit, HostListener, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// import { DataProtocolFormat } from '../../../gateway-template/model/DataProtocolFormat';
// import { TagLengthUnit } from '../../../gateway-template/model/tagLengthUnit';
import { DataProtocolTag } from '../../model/dataProtocolTag';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { DataSubProtocolDHTag } from '../../model/dataSubProtocolDHTag';
import { DataSubProtocolDH } from '../../model/dataSubProtocolDH';
import { DataSubProtocolDHService } from '../../services/DataSubProtocolDH/data-sub-protocol-dh.service';
import { DataSubProtocolDhTagService } from '../../services/DataSubProtocolDHTag/data-sub-protocol-dh-tag.service';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';
import { map } from 'jquery';
import { DialogService, UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/communication-protocol/pages/globalShareServices';
import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';
import { TagLengthUnit } from 'src/app/shared/model/tagLengthUnit';
import { globalSharedService } from 'src/app/shared/globalSharedService';
@Component({
  selector: 'app-data-sub-protocol-dh-tag',
  templateUrl: './data-sub-protocol-dh-tag.component.html',
  styleUrls: ['./data-sub-protocol-dh-tag.component.css']
})
export class DataSubProtocolDhTagComponent implements OnInit {
  showLoaderImage: boolean;


  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('dataSubProtocolDHTagForm')) {
      if (this.dataSubProtocolDHTagForm.dirty) {
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
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

  @Output() tabName = new EventEmitter();


  IODHTagError: boolean;
  warningFlag: string;

  constructor(private globalSharedService: globalShareServices,
    private router: Router, private formBuilder: FormBuilder,
    private commService: DataSubProtocolDHService, private service: DataSubProtocolDhTagService
    , private globalService: globalSharedService,
    private dialogService: DialogService,
    private route: ActivatedRoute) { }
  displayedColumns: string[] = ['select', 'name', 'configuration'];
  dataSource = new MatTableDataSource();
  dataSubProtocolDHTagForm: FormGroup;
  dataProtocolTags = [];

  dataSubProtocol: DataSubProtocol;
  dataFormats: DataProtocolFormat[];
  dataSubProtocolDHTags: DataSubProtocolDHTag[];
  dataSubProtocolDH: DataSubProtocolDH;
  saveDataSubProtocolDH: DataSubProtocolDH;
  saveDataSubProtocolDHTags: any[];
  patchDataProtocolIODHTags: DataSubProtocolDHTag[];
  tagLengthUnits: TagLengthUnit[];
  ioDHId: any;
  //ioDHType: string;
  operationMode: any;
  dataProtocolId: number;
  //tagIOMode: string;
  saveSuccess = false;
  updateSucess = false;
  serviceMessage: string;
  previewIODHTagForm = false;
  IODHTagForm = true;
  noRecordsFound = false;
  assignedTags = new Set();
  dhTagMap = new Map<number, any[]>();
  updatedTags = [];
  isAssign:boolean;
  ngOnInit() {
    this.loadFormData();
  }

  loadFormData() {
    this.dataSubProtocol = this.commService.dataSubProtocol;
    this.dataProtocolId = this.dataSubProtocol.dataProtocol.id;
    this.ioDHId = this.globalSharedService.assignId;
    //this.ioDHType = this.globalSharedService.name;
    this.validateDataSubProtocolDHTagForm();
    this.getGatewayIODHByIODHId();
    this.getDataFormats();
    this.getTagLengthUnits();
  }

  validateDataSubProtocolDHTagForm() {
    this.dataSubProtocolDHTagForm = this.formBuilder.group({
      id: [null],
      templateName: [''],
      communication: [''],
      name: [''],
      operationMode: [''],
      displayIOTag: ['All'],
      dataSubProtocolDHTags: this.formBuilder.array([
        this.addFormArray()
      ])
    })
  }

  addFormArray(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      tagIndex: [null, [Validators.pattern("[0-9]*")]],
      tagLength: [null, [Validators.pattern("[0-9]*")]],
      tagLengthUnit: [null],
      tagKeyName: [null],
      dataSubProtocolDHTagFormatId: [null],
      parentDataSubProtocolDHTagId: [null],
      dataProtocolTagSeperator: [null],
      isParticipantInLength: [false],
      isParticipantInErrorCheck: [false],
      dataProtocolTagId: [null],
      dataSubProtocolDHId: [null],
      dateTimeFormat: [null],
      isAssign: [false],
      defaultValue:null,
      status: [null]
    })
  }

  patchCommProtocolData() {
    this.dataSubProtocolDHTagForm.patchValue({
      templateName: this.dataSubProtocol.dataProtocol.name,
      communication: this.dataSubProtocol.commProtocol.name,
      name: this.dataSubProtocolDH.name,
      id: this.dataSubProtocolDH.id
    })
    if (this.dataSubProtocolDH.operatioMode === 'R') {
      this.dataSubProtocolDHTagForm.patchValue({
        operationMode: 'Read'
      })
    }
    else if (this.dataSubProtocolDH.operatioMode === 'W') {
      this.dataSubProtocolDHTagForm.patchValue({
        operationMode: 'Write'
      })
    }
  }

  getGatewayIOTagsByTemplateId() {
    this.service.getDataProtocolTagsByProtocolId(this.dataSubProtocol.dataProtocol.id, this.operationMode).subscribe(data => {
      if (data !== null && data.length != 0) {
        this.dataProtocolTags = data;
        this.createTheDynamicTableWithIOTags();
        //  this.dataSource.data = this.dataProtocolTags
      }
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }


  createTheDynamicTableWithIOTags() {
    const control = <FormArray>this.dataSubProtocolDHTagForm.controls['dataSubProtocolDHTags'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    for (let ioTag of this.dataProtocolTags) {
      control.push(this.addFormArray());
    }
    if (this.patchDataProtocolIODHTags !== null && this.patchDataProtocolIODHTags.length !== 0) {
      this.dataSubProtocolDHTagForm.setControl('dataSubProtocolDHTags', this.patchFormArrayData());
    }
    else {
      this.IODHTagError = true;
    }
  }

  getDataFormats() {
    this.service.getDataFormats().subscribe(data => {
      this.dataFormats = data;
    })
  }

  getGatewayIODHByIODHId() {
    this.service.getDataSubProtocolDHByDHId(this.ioDHId).subscribe(data => {
      this.dataSubProtocolDH = data;
      if (this.dataSubProtocolDH.operatioMode === 'R') {
        this.operationMode = 'I';
      }
      if (this.dataSubProtocolDH.operatioMode === 'W') {
        this.operationMode = 'O';
      }
      this.patchDataProtocolIODHTags = this.dataSubProtocolDH.dataSubProtocolDHTags;
      this.patchDataProtocolIODHTags.forEach(patchDataProtocolIODHTag=>{
        patchDataProtocolIODHTag.tagName=patchDataProtocolIODHTag.dataProtocolTag.name;
      })
      this.getGatewayIOTagsByTemplateId();
      this.patchCommProtocolData();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  aasignedGatewayIODHTags() {
    let fileterdArray: DataProtocolTag[] = [];
    this.patchDataProtocolIODHTags.forEach(ioDhTag => {
      for (let ioTag of this.dataProtocolTags) {
        if (ioTag.id === ioDhTag.dataProtocolTagId) {
          fileterdArray.push(ioTag);
          break;
        }
      }
    })
    this.dataProtocolTags = fileterdArray;
    this.createTheDynamicTableWithIOTags();
  }

  previewFormData() {

    this.saveDataSubProtocolDH = <DataSubProtocolDH>this.dataSubProtocolDHTagForm.value;
    this.saveDataSubProtocolDH.dataProtocolId = this.dataSubProtocol.dataProtocol.id;
    this.saveDataSubProtocolDHTags = this.saveDataSubProtocolDH.dataSubProtocolDHTags;
    this.saveDataSubProtocolDHTags = this.saveDataSubProtocolDHTags.filter(ioDhTag => ioDhTag.isAssign);
    let tempTags = this.patchDataProtocolIODHTags
    this.saveDataSubProtocolDHTags.forEach(ioDHTag => {
      this.patchDataProtocolIODHTags = this.patchDataProtocolIODHTags.filter(pIODHtag => pIODHtag.id != ioDHTag.id);
    })

    if (this.patchDataProtocolIODHTags.length != 0) {
      this.patchDataProtocolIODHTags.forEach(pIODHtag => {
        pIODHtag.status = 'Deleted';
        this.saveDataSubProtocolDHTags.push(pIODHtag);
      })
    }
    this.patchDataProtocolIODHTags = tempTags;
    this.saveDataSubProtocolDHTags.forEach(ioDhTag => {
      let dataFormatId = this.parseInt(ioDhTag.dataSubProtocolDHTagFormatId);
      for (let dataFormat of this.dataFormats) {
        let id = this.parseInt(dataFormat.id);
        if (id === dataFormatId) {
          ioDhTag.dataFormateName = dataFormat.name;
          break;
        }
      }
    })
    let userId = sessionStorage.getItem('userId');
    this.saveDataSubProtocolDHTags.forEach(ioDhTag => {
      ioDhTag.createdBy = this.parseInt(userId);
      ioDhTag.dataSubProtocolDHId = this.saveDataSubProtocolDH.id;
      ioDhTag.dataSubProtocolDHName = this.saveDataSubProtocolDH.name;
      let nodeIoTagId = this.parseInt(ioDhTag.dataProtocolTagId);
      for (let ioTag of this.dataProtocolTags) {
        let id = this.parseInt(ioTag.id);
        if (nodeIoTagId === id) {
          ioDhTag.tagName = ioTag.name;
        }
      }
    })
    this.saveDataSubProtocolDHTags.forEach(innerIoDhTag => {
      for (let lengthUnit of this.tagLengthUnits) {
        if (lengthUnit.id === innerIoDhTag.tagLengthUnit) {
          innerIoDhTag.tagLengthUnitName = lengthUnit.value;
          break;
        }
      }
      for (let parent of this.saveDataSubProtocolDHTags) {
        if (innerIoDhTag.id && innerIoDhTag.id == parent.parentDataSubProtocolDHTagId) {
          let nodeIoTagId = this.parseInt(innerIoDhTag.dataProtocolTagId);
          for (let ioTag of this.dataProtocolTags) {
            let id = this.parseInt(ioTag.id);
            if (nodeIoTagId === id) {
              parent.parentTagName = ioTag.name;
              break;
            }
          }
        }
      }
    })
    // if (this.saveDataSubProtocolDHTags !== null && this.saveDataSubProtocolDHTags.length !== 0) {
    this.previewIODHTagForm = true;
    this.IODHTagForm = false;
    this.saveDataSubProtocolDHTags = this.saveDataSubProtocolDHTags.sort((a,b)=>a.tagName.localeCompare(b.tagName));
    let tags = JSON.parse(JSON.stringify(this.saveDataSubProtocolDHTags));
    this.saveDataSubProtocolDH.dataSubProtocolDHTags = this.saveDataSubProtocolDHTags;

    this.dhTagMap.clear();
    tags.forEach(dspTag => {
      let parentId = parseInt(dspTag.parentDataSubProtocolDHTagId);
      if (parentId) {
        if (this.dhTagMap.has(parentId)) {
          let childTags = this.dhTagMap.get(parentId);
          childTags.push(dspTag);
          this.dhTagMap.set(parentId, childTags);
        } else {
          let childTags = [];
          childTags.push(dspTag);
          this.dhTagMap.set(parentId, childTags);
        }
      }
    })
    this.updatedTags =[];
    tags.forEach(dspTag=>{
      dspTag.childTags = [];
      if(this.dhTagMap.has(dspTag.id)){
        let childTags = this.dhTagMap.get(dspTag.id);
        childTags = this.checkChildTags(childTags);
        dspTag.childTags = childTags;
        this.dhTagMap.delete(dspTag.id);
      }
      if(!parseInt(dspTag.parentDataSubProtocolDHTagId)){
        this.updatedTags.push(dspTag);
      }

    })
  }

  checkChildTags(dspTags: any[]) {
    dspTags.forEach(dspTag => {
      if(this.dhTagMap.has(dspTag.id)){
        let childTags = this.dhTagMap.get(dspTag.id);
        childTags = this.checkChildTags(childTags);
        dspTag.childTags = childTags;
        this.dhTagMap.delete(dspTag.id);
      }
    })
    return dspTags;
  }

  patchFormArrayData(): FormArray {
    this.assignedTags.clear();
    const formArray = new FormArray([]);
    if (this.dataProtocolTags !== null && this.dataProtocolTags.length !== 0) {
      this.dataProtocolTags = this.dataProtocolTags.sort((a,b) => a.name.localeCompare(b.name))
      this.dataProtocolTags.forEach(ioTag => {
        let matched = false;
        let index = 0;
        for (let ioDhTag of this.patchDataProtocolIODHTags) {
          if (ioTag.id === ioDhTag.dataProtocolTagId) {
            matched = true;
            ioDhTag.isAssign = true;
            break;
          }
          else {
            ioDhTag.isAssign = false;
          }
          index++;
        }
        if (matched) {
          formArray.push(this.formBuilder.group({
            id: this.patchDataProtocolIODHTags[index].id,
            tagIndex: this.patchDataProtocolIODHTags[index].tagIndex,
            tagLength: this.patchDataProtocolIODHTags[index].tagLength,
            tagLengthUnit: this.patchDataProtocolIODHTags[index].tagLengthUnit,
            tagKeyName: this.patchDataProtocolIODHTags[index].tagKeyName,
            dataSubProtocolDHTagFormatId: this.patchDataProtocolIODHTags[index].dataSubProtocolDHTagFormatId,
            parentDataSubProtocolDHTagId: this.patchDataProtocolIODHTags[index].parentDataSubProtocolDHTagId,
            dataProtocolTagSeperator: this.patchDataProtocolIODHTags[index].dataProtocolTagSeperator,
            isParticipantInLength: this.patchDataProtocolIODHTags[index].isParticipantInLength,
            isParticipantInErrorCheck: this.patchDataProtocolIODHTags[index].isParticipantInErrorCheck,
            dataProtocolTagId: this.patchDataProtocolIODHTags[index].dataProtocolTagId,
            dataSubProtocolDHId: this.patchDataProtocolIODHTags[index].dataSubProtocolDHId,
            dateTimeFormat: this.patchDataProtocolIODHTags[index].dateTimeFormat,
            status: this.patchDataProtocolIODHTags[index].status,
            defaultValue:this.patchDataProtocolIODHTags[index].defaultValue,
            isAssign: true
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: null,
            tagIndex: null,
            tagLength: null,
            tagLengthUnit: null,
            tagKeyName:null,
            dataSubProtocolDHTagFormatId: null,
            parentDataSubProtocolDHTagId: [null],
            dataProtocolTagSeperator: null,
            isParticipantInLength: false,
            isParticipantInErrorCheck: false,
            dataProtocolTagId: null,
            dataSubProtocolDHId: null,
            dateTimeFormat: null,
            status: null,
            defaultValue:null,
            isAssign: false
          }))
        }
        this.patchDataProtocolIODHTags.filter(element => {
          if (element.isAssign == true) {
            this.assignedTags.add(element.dataProtocolTagId)
          }
        });
        if (this.assignedTags.size > 0) {
          this.IODHTagError = false;
        }
        else {
          this.IODHTagError = true;
        }
      })
    }
    return formArray
  }


  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  getTagLengthUnits() {
    this.service.getTagLengthUnits().subscribe(data => {
      this.tagLengthUnits = data;
    })
  }

  cancelIODHTag() {
    this.formCancelConfirm();
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalSharedService.setGlobalId(this.dataProtocolId);
    // this.globalSharedService.GettingString('communication');
    //this.router.navigate(['../'],{relativeTo:this.route});
    //this.previewIODHTagForm = false;
    //this.IODHTagForm = true;
    // this.globalSharedService.GettingId(this.saveDataSubProtocolDH.dataProtocolId);
    this.tabName.emit('communication');
    this.globalSharedService.setGlobalName('communication');
    //this.validateDataSubProtocolDHTagForm();
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  onClickSaveGatewayIODH() {
    this.showLoaderImage = true;
    this.service.saveDataSubProtocolDH(this.saveDataSubProtocolDH).subscribe(res => {
      this.saveSuccess = true;
      this.updateSucess = false;
      this.showLoaderImage = false;
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, error => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }

  // Redirect to
  redirectTo() {
    this.previewIODHTagForm = false;
    this.IODHTagForm = true;
    this.globalSharedService.GettingId(this.saveDataSubProtocolDH.dataProtocolId);
    this.commService.setDataSubProtocol(this.dataSubProtocol);
    this.globalSharedService.GettingId(this.ioDHId);
    // this.globalShareService.GettingString('communication');
    // this.validateDataSubProtocolDHTagForm();
    // this.router.navigate(['../data-sub-protocol-response-tag'], { relativeTo: this.route });
    this.loadFormData();
  }

  backButton() {
    this.previewIODHTagForm = false;
    this.IODHTagForm = true;
  }

  resetDHIOTagForm(event) {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.commService.dataSubProtocol = this.dataSubProtocol;
    this.globalSharedService.GettingId(this.ioDHId);
    this.loadFormData();
  }

  tagSelected(selectedTag, event) {
    if (event.checked === true) {
      this.assignedTags.add(selectedTag)
    }
    else {
      if (this.assignedTags.has(selectedTag)) {
        this.assignedTags.delete(selectedTag)
      }
    }
    if (this.assignedTags.size > 0) {
      this.IODHTagError = false;
    }
    else {
      this.IODHTagError = true;
    }
  }

  helpMessage() {
    let message;
    message = '<div class="sweatalert-help-block-message">' + 'It is the format in which date and/or time is coming in the data handler.' +
      'Example:<br/>' +
      '<ol>' +
      '<li>If date time is in millisecond then the format will be epochinmillis </li>' +
      '<li>If date time is in epoch then the format will be epoch </li>' +
      '<li>If date time is 1970-12-01 23:00:00.0 then the format will be yyyy-MM-dd HH:mm:ss.S </li>' +
      '<li>If date time is 1970-12-01 then the format will be yyyy-MM-dd </li>' +
      '</ol></div>'
    this.modelNotification.helpMessage(message);
  }
}
