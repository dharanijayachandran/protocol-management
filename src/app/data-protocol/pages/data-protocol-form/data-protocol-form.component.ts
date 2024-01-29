import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { globalShareServices } from 'src/app/communication-protocol/pages/globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { CommProtocol } from 'src/app/shared/model/commprotocol';
import { DialogService } from 'global';
import { DataProtocol } from '../../model/dataProtocol';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { DataProtocolService } from '../../services/DataProtocol/data-protocol.service';

@Component({
  selector: 'app-data-protocol-form',
  templateUrl: './data-protocol-form.component.html',
  styleUrls: ['./data-protocol-form.component.css']
})
export class DataProtocolFormComponent implements OnInit {
  addEditText: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private globalService: globalShareServices,
    private protocolService: DataProtocolService, private dialogService: DialogService, private globalShareService: globalSharedService, private route:ActivatedRoute) { }

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('dataProtocolForm')) {
      if (this.dataProtocolForm.dirty) {
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
        // returning false will show a confirm dialog before navigating away
      } else {
        return true; // returning true will navigate without confirmation
      }
      return this.dialogService.navigateAwaySelection$;
    } else return true;
  }
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  dataProtocolForm: FormGroup;
  dataProtocolFormView = false;
  dataProtocolViewMode = false;
  dataProtocolReadModeView = false;
  protocolView = false;
  dataProtocol: DataProtocol
  enableSave = false;
  errorMessage = false;
  commProtocols: CommProtocol[];
  selectedCommProtocols: any[] = [];
  dataSubProtocol: DataSubProtocol = new DataSubProtocol;
  dataSubProtocols: DataSubProtocol[];
  savedCommProtocols: CommProtocol[];
  dataProtocolFormAdd: boolean;
  dataProtocolFormEdit: boolean;
  showLoaderImage=false;
  commProtocolsMap=new Map();

  ngOnInit(): void {
    this.loadFormData();
  }


  loadFormData() {
    this.validateForm();
    this.getCommProtocols()
    let id = Number(this.globalShareService.selectedId);
    let operation = this.globalShareService.name;
    if (id != 0 && operation === 'View') {
      // this.getGatewayTemplateByTemplateIdForView(id);
      this.getDataProtocolById(id);
      this.dataProtocolFormView = false;
      this.dataProtocolReadModeView = false;
      this.dataProtocolViewMode = true;
      this.protocolView = true;
      this.dataProtocolFormAdd = false
      this.dataProtocolFormEdit = false;
    }
    else if (id != 0 && operation === 'Edit') {
      //this.dataProtocolFormValidation();
      this.addEditText = "Edit"
      this.getDataProtocolById(id);
      this.dataProtocolFormView = true;
      this.dataProtocolReadModeView = false;
      this.dataProtocolViewMode = false;
      this.dataProtocolFormAdd = false
      this.dataProtocolFormEdit = true;
    }
    else {
      //this.dataProtocolFormValidation();
      this.addEditText = "Add"
      this.dataProtocolFormView = true;
      this.dataProtocolReadModeView = false;
      this.dataProtocolViewMode = false;
      this.dataProtocolFormAdd = true
      this.dataProtocolFormEdit = false;
    }
  }


  validateForm() {
    this.dataProtocolForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.pattern(this.globalShareService.getNamePatternForGatewayandAsset())]],
      isGeneric: false,
      description: [null],
      commProtocols: this.formBuilder.array([
        this.addcommProtocolsFormGroup()
      ]),
      status: ['Active']
    });
  }


  addcommProtocolsFormGroup(): FormGroup {
    return this.formBuilder.group({
      commProtocolId: [null],
      value: [false],
      name:[null]
    })
  }

  previewDataProtocol() {
    this.dataProtocolFormView = false;
    this.dataProtocolReadModeView = true;
    this.dataProtocolFormEdit = false;
    this.dataProtocolViewMode = false;
    this.dataProtocol = <DataProtocol>this.dataProtocolForm.value;
    for(let i=0; i< this.commProtocols.length; i++){
      this.dataProtocol.commProtocols[i].name =  this.commProtocols[i].name
      this.dataProtocol.commProtocols[i].commProtocolId =  this.commProtocols[i].id
    }
    this.selectedCommProtocols = this.dataProtocol.commProtocols.filter(comProto => comProto.value)
    //this.selectedCommProtocols = this.selectedCommProtocols.filter(commProtrocol => commProtrocol.value)
    this.dataProtocol.commProtocols = [];
    if(null != this.dataSubProtocols && this.dataSubProtocols.length != 0){
      this.dataSubProtocols.forEach(dsp => {
        for(let comprotocol of this.selectedCommProtocols){
          if(comprotocol.commProtocolId == dsp.commProtocolId){
            comprotocol.id = dsp.id;
            break;
          }
        }
      })
    }
    this.dataProtocol.dataSubProtocols = this.selectedCommProtocols;
  }

  createOrUpdateDataProtocol(){
    this.showLoaderImage=true
    let userId = sessionStorage.getItem('userId');
    let beId = sessionStorage.getItem('beId');
    if(null == this.dataProtocol.id){
      this.dataProtocol.createdBy = parseInt(userId);
      this.dataProtocol.businessEntityId = parseInt(beId);
      this.protocolService.saveDataProtocol(this.dataProtocol).subscribe(res =>{
        this.showLoaderImage=false;
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
      (error: any) => {
        this.showLoaderImage=false
        this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
      })
    }else{
      this.dataProtocol.updatedBy = parseInt(userId);
      this.dataProtocol.businessEntityId = parseInt(beId);
      this.protocolService.updateDataProtocol(this.dataProtocol).subscribe(res =>{
        this.showLoaderImage=false
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
      (error: any) => {
        this.showLoaderImage=false
        this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
      })
    }
  }

  getDataProtocolById(id: number){
    this.protocolService.getDataProtocolById(id).subscribe(data =>{
      this.dataProtocol = data;
      this.dataSubProtocols = this.dataProtocol.dataSubProtocols;
      this.dataSubProtocols.forEach(dataSubProtocol=>{
        if(dataSubProtocol.commProtocol == null || dataSubProtocol.commProtocol == undefined){
            dataSubProtocol.commProtocol=this.commProtocolsMap.get(dataSubProtocol.commProtocolId);
        }

      })
      this.savedCommProtocols = [];
      for(let dsp of this.dataSubProtocols){
        this.savedCommProtocols.push(dsp.commProtocol);
      }

      this.patchFormData();
    },error => {
      this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
    })
  }


  patchFormData() {
    this.selectedCommProtocols = this.savedCommProtocols;
    this.dataProtocolForm = this.formBuilder.group({
      id: this.dataProtocol.id,
      name: [this.dataProtocol.name, [Validators.required, Validators.pattern(this.globalShareService.getNamePatternForGatewayandAsset())]],
      isGeneric: this.dataProtocol.isGeneric,
      description: this.dataProtocol.description,
      status: this.dataProtocol.status
    });
    this.dataProtocolForm.setControl('commProtocols', this.patchFormArray());
    this.enableSave = true;
  }


  patchFormArray(): FormArray {
    const formArray = new FormArray([]);
    if (this.commProtocols != null && this.commProtocols.length != 0) {
      var tempArray = this.commProtocols;
      tempArray.forEach(cProtocol => {
        let isSelected = false;
        let index = 0;
        // this.savedCommProtocols.forEach(commmProtocol => {
        //   if (cProtocol.id === commmProtocol.id) {
        //     isSelected = true;
        //   }
        // });
        for(let commmProtocol of this.savedCommProtocols){
          if (cProtocol.id === commmProtocol.id) {
            isSelected = true;
            break;
          }
          index++;
        }
        if (isSelected) {
          formArray.push(this.formBuilder.group({
            commProtocolId: this.savedCommProtocols[index].id,
            value: true,
            name: this.savedCommProtocols[index].name
          }))
        }
        else {
          formArray.push(this.formBuilder.group({
            commProtocolId: null,
            value: false
          }))
        }
      })

    }
    return formArray;
  }

  getCommProtocols() {
    this.protocolService.getCommprotocolList().subscribe(
      res => {
        this.commProtocols = res;
        this.commProtocols.forEach(obj => {
          this.commProtocolsMap.set(obj.id, obj);
        })
        this.commProtocols = this.commProtocols.sort((a, b) => a.id - b.id);
        const control = <FormArray>this.dataProtocolForm.controls['commProtocols'];
        for (let i = control.length - 1; i >= 0; i--) {
          control.removeAt(i)
        }
        for (let commProtocol of this.commProtocols) {
          (<FormArray>this.dataProtocolForm.get('commProtocols')).push(this.addcommProtocolsFormGroup());
        }
      },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
      }
    );
  }

  isSelected(commProtocol: CommProtocol, i: number) {
    let selected = false;
    this.dataProtocol = <DataProtocol>this.dataProtocolForm.value;
    // this.dataProtocol.commProtocols[i].commProtocolId = this.commProtocols[i].id;
    // this.dataProtocol.commProtocols[i].name = this.commProtocols[i].name;
    this.selectedCommProtocols = this.dataProtocol.commProtocols;
    for (let comm of this.selectedCommProtocols) {
      if (comm.value) {
        selected = true;
        break;
      }
    }
    if (!selected) {
      this.enableSave = false;
      this.errorMessage = true;
    }
    else {
      this.enableSave = true;
      this.errorMessage = false;
    }
  }



  cancelDataProtocolForm(event: Event) {
    this.formCancelConfirm();
  }



  // Confirm redirect to
  formCancelConfirm() {
    // this.dataProtocolForm.reset();
    this.enableSave = false;
    this.errorMessage = false;
    this.makeDropdownsNUll();
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  makeDropdownsNUll() {
    this.commProtocols = null;
    this.selectedCommProtocols = [];
  }


  resetDataProtocolForm() {
    this.modelNotification.alertMessage(this.globalShareService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  formResetConfirm() {
    this.dataProtocol = <DataProtocol>this.dataProtocolForm.value;
    this.enableSave = false;
    this.errorMessage = false;
    if (this.dataProtocol.id === null) {
      this.selectedCommProtocols = [];
      this.dataProtocolForm.reset();
      this.dataProtocolForm.get('status').setValue('Active');

    }
    else {
      this.validateForm();
      this.getDataProtocolById(this.dataProtocol.id);
      //this.getGatewayTemplateByTemplateIdForEdit(this.gatewayTemplate.id);
    }
  }

  backButton(elementId) {
    this.dataProtocolFormView = true;
    this.dataProtocolFormEdit = true;
    this.dataProtocolReadModeView = false;
    this.dataProtocolViewMode = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  redirectTo(){
    this.dataProtocolForm.reset();
    this.makeDropdownsNUll();
    this.globalService.GettingString('dataProtocol');
    this.router.navigate(['../'], { relativeTo: this.route});
  }
}
