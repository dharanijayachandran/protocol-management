import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormArray, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DataSubProtocolDH } from '../../model/dataSubProtocolDH';
import { DataProtocolTag } from '../../model/dataProtocolTag';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSubProtocolDHService } from '../../services/DataSubProtocolDH/data-sub-protocol-dh.service';
import { DataSubProtocolDhTagService } from '../../services/DataSubProtocolDHTag/data-sub-protocol-dh-tag.service';
import { MatTableDataSource } from '@angular/material/table';
// import { DataProtocolFormat } from '../../../gateway-template/model/DataProtocolFormat';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { DataSubProtocolDHTag } from '../../model/dataSubProtocolDHTag';
// import { TagLengthUnit } from '../../../gateway-template/model/tagLengthUnit';
import { DataSubProtocolDHResponseTag } from '../../model/dataSubProtocolDHResponseTag';
import { DialogService, UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/communication-protocol/pages/globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';
import { TagLengthUnit } from 'src/app/shared/model/tagLengthUnit';

@Component({
  selector: 'app-data-sub-protocol-dh-response-tag',
  templateUrl: './data-sub-protocol-dh-response-tag.component.html',
  styleUrls: ['./data-sub-protocol-dh-response-tag.component.css']
})
export class DataSubProtocolDhResponseTagComponent implements OnInit {
  showLoaderImage: boolean;


  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('dataSubProtocolDHResponseTagForm')) {
      if (this.dataSubProtocolDHResponseTagForm.dirty) {
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

  IODHTagError: boolean;
  warningFlag: string;
  dhTagMap = new Map<number, any[]>();
  updatedTags = [];
  constructor(private globalShareService: globalShareServices,
    private router: Router, private formBuilder: FormBuilder,
    private commService: DataSubProtocolDHService, private service: DataSubProtocolDhTagService
    , private globalService: globalSharedService,
    private dialogService: DialogService,
    private route: ActivatedRoute) { }
  displayedColumns: string[] = ['select', 'name', 'configuration'];
  dataSource = new MatTableDataSource();
  dataSubProtocolDHResponseTagForm: FormGroup;
  dataProtocolTags: DataProtocolTag[];

  dataSubProtocol: DataSubProtocol;
  dataFormats: DataProtocolFormat[];
  dataSubProtocolDHTags: DataSubProtocolDHTag[];
  dataSubProtocolDH: DataSubProtocolDH;
  saveDataSubProtocolDH: DataSubProtocolDH;
  saveDataSubProtocolDHTags: DataSubProtocolDHTag[];
  patchDataProtocolIODHTags: DataSubProtocolDHTag[];
  tagLengthUnits: TagLengthUnit[];
  saveDataSubProtocolDHResponseTags: any[];
  patchDataProtocolIODHResponseTags: DataSubProtocolDHResponseTag[]=[];
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
  isAssign:boolean;
  assignedTags = new Set();;
  ngOnInit() {
    this.loadFormData();
  }

  loadFormData() {
    this.dataSubProtocol = this.commService.dataSubProtocol;
    this.dataProtocolId = this.dataSubProtocol.dataProtocol.id;
    this.ioDHId = this.globalShareService.assignId;
    //this.ioDHType = this.globalShareService.name;
    this.validateDataSubProtocolDHTagForm();
    this.getGatewayIODHByIODHId();
    this.getDataFormats();
    this.getTagLengthUnits();
  }

  validateDataSubProtocolDHTagForm() {
    this.dataSubProtocolDHResponseTagForm = this.formBuilder.group({
      id: [null],
      templateName: [''],
      communication: [''],
      name: [''],
      operationMode: [''],
      displayIOTag: ['All'],
      dataSubProtocolDHResponseTags: this.formBuilder.array([
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
      dataSubProtocolDHResponseTagFormatId: [null],
      parentDataSubProtocolDHResponseTagId: [null],
      dataProtocolTagSeparator: [null],
      isParticipantInLength: [false],
      isParticipantInErrorCheck: [false],
      dataProtocolTagId: [null],
      dataSubProtocolDHId: [null],
      defaultValue:null,
      isAssign: [false],
      status: [null]
    })
  }

  patchCommProtocolData() {
    this.dataSubProtocolDHResponseTagForm.patchValue({
      templateName: this.dataSubProtocol.dataProtocol.name,
      communication: this.dataSubProtocol.commProtocol.name,
      name: this.dataSubProtocolDH.name,
      id: this.dataSubProtocolDH.id
    })
    if (this.dataSubProtocolDH.operatioMode === 'R') {
      this.dataSubProtocolDHResponseTagForm.patchValue({
        operationMode: 'Read'
      })
    }
    else if (this.dataSubProtocolDH.operatioMode === 'W') {
      this.dataSubProtocolDHResponseTagForm.patchValue({
        operationMode: 'Write'
      })
    }
  }

  getGatewayIOTagsByTemplateId() {
    this.service.getDataProtocolTagsByProtocolId(this.dataSubProtocol.dataProtocol.id, this.operationMode).subscribe(data => {
      if (data !== null && data.length != 0) {
        this.dataProtocolTags = data;
        this.dataSource.data = this.dataProtocolTags
        if (this.patchDataProtocolIODHTags !== null && this.patchDataProtocolIODHTags.length !== 0) {
          this.dataSubProtocolDHResponseTagForm.setControl('dataSubProtocolDHResponseTags', this.patchFormArrayData());
        }
        this.noRecordsFound = false;
      } else {
        this.noRecordsFound = true;
      }

      /* this.patchDataProtocolIODHTags = this.patchDataProtocolIODHTags.filter(ioTag => {
        if (ioTag.tagIOMode === this.operationMode) {
          return ioTag;
        }
      }) */

      // this.createTheDynamicTableWithIOTags();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }


  createTheDynamicTableWithIOTags() {
    const control = <FormArray>this.dataSubProtocolDHResponseTagForm.controls['dataSubProtocolDHResponseTags'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    for (let ioTag of this.patchDataProtocolIODHTags) {
      control.push(this.addFormArray());
    }
    /* if (this.patchDataProtocolIODHTags !== null && this.patchDataProtocolIODHTags.length !== 0) {
      this.dataSubProtocolDHResponseTagForm.setControl('dataSubProtocolDHResponseTags', this.patchFormArrayData());
    }
    else {
      this.IODHTagError = true;
    } */
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
      this.saveDataSubProtocolDHTags = this.patchDataProtocolIODHTags;
      this.patchDataProtocolIODHResponseTags = this.dataSubProtocolDH.dataSubProtocolDHResponseTags;
      this.patchDataProtocolIODHResponseTags.forEach(patchDataProtocolIODHResponseTag=>{
        patchDataProtocolIODHResponseTag.tagName=patchDataProtocolIODHResponseTag.dataProtocolTag.name;
      })
      if (this.patchDataProtocolIODHTags !== null && this.patchDataProtocolIODHTags.length != 0) {
        //this.dataProtocolTags = data;
        this.dataSubProtocolDHResponseTagForm.setControl('dataSubProtocolDHResponseTags', this.patchFormArrayData());
        this.dataSource.data = this.patchDataProtocolIODHTags
        if (this.patchDataProtocolIODHResponseTags !== null && this.patchDataProtocolIODHResponseTags.length !== 0) {

        } else {
          this.IODHTagError = true;
        }
        this.noRecordsFound = false;
      } else {
        this.noRecordsFound = true;
      }
      // this.getGatewayIOTagsByTemplateId();
      this.patchCommProtocolData();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  aasignedGatewayIODHTags() {
    let fileterdArray: DataSubProtocolDHResponseTag[] = [];
    this.saveDataSubProtocolDHTags = [];
    this.patchDataProtocolIODHResponseTags.forEach(ioDhTag => {
      for (let ioTag of this.patchDataProtocolIODHTags) {
        if (ioTag.dataProtocolTagId === ioDhTag.dataProtocolTagId) {
          fileterdArray.push(ioDhTag);
          this.saveDataSubProtocolDHTags.push(ioTag)
          break;
        }
      }
    })
    this.patchDataProtocolIODHResponseTags = fileterdArray;
    if (this.patchDataProtocolIODHResponseTags.length != 0) {
      this.dataSource.data = [];
      this.dataSource.data = this.patchDataProtocolIODHResponseTags
      if (this.patchDataProtocolIODHResponseTags !== null && this.patchDataProtocolIODHResponseTags.length !== 0) {
        this.dataSubProtocolDHResponseTagForm.setControl('dataSubProtocolDHResponseTags', this.patchFormArrayData());
      } else {
        this.IODHTagError = true;
      }
      this.noRecordsFound = false;
    } else {
      this.dataSource.data = []
      this.noRecordsFound = true;
    }

    //this.createTheDynamicTableWithIOTags();
  }

  previewFormData() {

    this.saveDataSubProtocolDH = <DataSubProtocolDH>this.dataSubProtocolDHResponseTagForm.value;
    this.saveDataSubProtocolDH.dataProtocolId = this.dataSubProtocol.dataProtocol.id;
    this.saveDataSubProtocolDHResponseTags = this.saveDataSubProtocolDH.dataSubProtocolDHResponseTags;
    this.saveDataSubProtocolDHResponseTags = this.saveDataSubProtocolDHResponseTags.filter(ioDhTag => ioDhTag.isAssign);
    let tempTags =  this.patchDataProtocolIODHResponseTags ;
    this.saveDataSubProtocolDHResponseTags.forEach(ioDHTag => {
      this.patchDataProtocolIODHResponseTags = this.patchDataProtocolIODHResponseTags.filter(pIODHtag => pIODHtag.id != ioDHTag.id);
    })

    if (this.patchDataProtocolIODHResponseTags.length != 0) {
      this.patchDataProtocolIODHResponseTags.forEach(pIODHtag => {
        pIODHtag.status = 'Deleted';
        this.saveDataSubProtocolDHResponseTags.push(pIODHtag);
      })
    }
    this.patchDataProtocolIODHResponseTags = tempTags
    this.saveDataSubProtocolDHResponseTags.forEach(ioDhTag => {
      let dataFormatId = this.parseInt(ioDhTag.dataSubProtocolDHResponseTagFormatId);
      for (let dataFormat of this.dataFormats) {
        let id = this.parseInt(dataFormat.id);
        if (id === dataFormatId) {
          ioDhTag.dataFormateName = dataFormat.name;
          break;
        }
      }
    })
    let userId = sessionStorage.getItem('userId');
    this.saveDataSubProtocolDHResponseTags.forEach(ioDhTag => {
      ioDhTag.createdBy = this.parseInt(userId);
      ioDhTag.dataSubProtocolDHId = this.saveDataSubProtocolDH.id;
      ioDhTag.dataSubProtocolDHName = this.saveDataSubProtocolDH.name;
      let nodeIoTagId = this.parseInt(ioDhTag.dataProtocolTagId);
      let parentTagId = this.parseInt(ioDhTag.parentDataSubProtocolDHResponseTagId);
      for (let ioTag of this.patchDataProtocolIODHTags) {
        let id = this.parseInt(ioTag.dataProtocolTag.id);
        if (nodeIoTagId === id) {
          ioDhTag.tagName = ioTag.dataProtocolTag.name;
        }
      }
      this.saveDataSubProtocolDHResponseTags.forEach(respTag=>{
        if(respTag.id){
          if(parentTagId == respTag.id){
            this.patchDataProtocolIODHTags.forEach(ioTag=>{
              if(respTag.dataProtocolTagId==ioTag.dataProtocolTag.id){
                ioDhTag.parentTagName = ioTag.dataProtocolTag.name;
              }
            })
          }
        }
      })

    })
    this.saveDataSubProtocolDHResponseTags.forEach(ioDhTag => {
      for (let lengthUnit of this.tagLengthUnits) {
        if (lengthUnit.id === ioDhTag.tagLengthUnit) {
          ioDhTag.tagLengthUnitName = lengthUnit.value;
          break;
        }
      }
    })
    // if (this.saveDataSubProtocolDHResponseTags !== null && this.saveDataSubProtocolDHResponseTags.length !== 0) {
    this.previewIODHTagForm = true;
    this.IODHTagForm = false;
    this.saveDataSubProtocolDH.dataSubProtocolDHResponseTags = this.saveDataSubProtocolDHResponseTags;
    this.saveDataSubProtocolDHResponseTags = this.saveDataSubProtocolDHResponseTags.sort((a,b) => a.tagName.localeCompare(b.tagName))
    let tags = JSON.parse(JSON.stringify(this.saveDataSubProtocolDHResponseTags));
    this.dhTagMap.clear();
    tags.forEach(dspTag => {
      let parentId = parseInt(dspTag.parentDataSubProtocolDHResponseTagId);
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
      if(!parseInt(dspTag.parentDataSubProtocolDHResponseTagId)){
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
    const formArray = new FormArray([]);
    const control = <FormArray>this.dataSubProtocolDHResponseTagForm.controls['dataSubProtocolDHResponseTags'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    if (this.saveDataSubProtocolDHTags !== null && this.saveDataSubProtocolDHTags.length !== 0) {
      this.saveDataSubProtocolDHTags = this.saveDataSubProtocolDHTags.sort((a,b)=>a.dataProtocolTag.name.localeCompare(b.dataProtocolTag.name))
      this.saveDataSubProtocolDHTags.forEach(ioTag => {
        let matched = false;
        let index = 0;
        for (let ioDhTag of this.patchDataProtocolIODHResponseTags) {
          if (ioTag.dataProtocolTagId === ioDhTag.dataProtocolTagId) {
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
            id: this.patchDataProtocolIODHResponseTags[index].id,
            tagIndex: this.patchDataProtocolIODHResponseTags[index].tagIndex,
            tagLength: this.patchDataProtocolIODHResponseTags[index].tagLength,
            tagLengthUnit: this.patchDataProtocolIODHResponseTags[index].tagLengthUnit,
            tagKeyName: this.patchDataProtocolIODHResponseTags[index].tagKeyName,
            dataSubProtocolDHResponseTagFormatId: this.patchDataProtocolIODHResponseTags[index].dataSubProtocolDHResponseTagFormatId,
            parentDataSubProtocolDHResponseTagId: this.patchDataProtocolIODHResponseTags[index].parentDataSubProtocolDHResponseTagId,
            dataProtocolTagSeparator: this.patchDataProtocolIODHResponseTags[index].dataProtocolTagSeparator,
            isParticipantInLength: this.patchDataProtocolIODHResponseTags[index].isParticipantInLength,
            isParticipantInErrorCheck: this.patchDataProtocolIODHResponseTags[index].isParticipantInErrorCheck,
            dataProtocolTagId: this.patchDataProtocolIODHResponseTags[index].dataProtocolTagId,
            dataSubProtocolDHId: this.patchDataProtocolIODHResponseTags[index].dataSubProtocolDHId,
            status: this.patchDataProtocolIODHResponseTags[index].status,
            defaultValue:this.patchDataProtocolIODHResponseTags[index].defaultValue,
            isAssign: true
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: [null],
            tagIndex: [null],
            tagLength: [null],
            tagLengthUnit: [null],
            tagKeyName: [null],
            dataSubProtocolDHResponseTagFormatId: [null],
            parentDataSubProtocolDHResponseTagId: [null],
            dataProtocolTagSeparator: [null],
            isParticipantInLength: false,
            isParticipantInErrorCheck: false,
            dataProtocolTagId: [null],
            dataSubProtocolDHId: [null],
            status: [null],
            defaultValue:null,
            isAssign: false
          }))
        }
        this.patchDataProtocolIODHResponseTags.filter(element => {
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
    this.globalShareService.setGlobalId(this.dataProtocolId);
    // this.globalShareService.GettingString('communication');
    //this.router.navigate(['../'],{relativeTo:this.route});
    this.previewIODHTagForm = false;
    this.IODHTagForm = true;
    // this.globalShareService.GettingId(this.saveDataSubProtocolDH.dataProtocolId);
    this.globalShareService.setGlobalName('communication');
    // this.validateDataSubProtocolDHTagForm();
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  onClickSaveGatewayIODH() {
    this.showLoaderImage = true;
    this.service.saveDataSubProtocolDHResponseTags(this.saveDataSubProtocolDH).subscribe(res => {
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
    this.formResetConfirm();
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
    this.globalShareService.GettingId(this.ioDHId);
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

}
