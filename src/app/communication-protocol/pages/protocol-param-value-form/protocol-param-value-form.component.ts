import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProtocolService } from '../../services/protocol.service';
import { ProtocolParamValue } from '../../model/protocol-param-value';
import { Observable } from 'rxjs';
import { DialogService } from 'global';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from '../globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
@Component({
  selector: 'app-protocol-param-value-form',
  templateUrl: './protocol-param-value-form.component.html',
  styleUrls: ['./protocol-param-value-form.component.css']
})
export class ProtocolParamValueFormComponent implements OnInit {
  showLoaderImage: boolean;
  addEditText: string;
  isEditable: boolean = false;
  protocolParameterValue: String;



  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('protocolParamValueForm')) {
      if (this.protocolParamValueForm.dirty) {
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

  ProtocolparamValueFormView = true;
  protocolParamValueReadModeView = false;
  protocolParamValueViewMode = false;
  dynamicRedirection: string;
  protocolParamValueForm: FormGroup;
  protocolParamValue: ProtocolParamValue = new ProtocolParamValue();
  allProtocolParamValues: any;
  refProtocolParamValues: any = [];
  protocolName: string;
  protocolGroupName: string;
  protocolParamId: number;
  protocolParamDisplayName: string;
  protocolParamLevel: any;
  protocolParamValueId: number;
  refCommProtocolParamId: number;
  protocolGroupTabLevel: any;
  isDefaultValue: string;
  warningFlag: string;
  dataTypeName: string;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private globalService: globalShareServices,
    private protocolService: ProtocolService,
    private globalSharedService: globalSharedService,
    private dialogService: DialogService,
    private route: ActivatedRoute) { }
  ngOnDestroy() {
    delete this.isEditable
  }
  ngOnInit() {
    this.getProtocolParamData();
    this.loadFormData();
  }

  loadFormData() {
    this.protocolParamId = JSON.parse(sessionStorage.getItem('protocolParamId'));
    this.protocolParamValueId = Number(this.globalService.assignId);
    let operation = this.globalService.name;
    this.protocolGroupTabLevel = this.protocolService.tabLevel;
    if (this.protocolParamValueId != 0 && operation === 'View') {
      this.getParamValueByParamValueIdForView(this.protocolParamValueId);
      this.ProtocolparamValueFormView = false;
      this.protocolParamValueReadModeView = false;
      this.protocolParamValueViewMode = true;
    }
    else if (this.protocolParamValueId != 0 && operation === 'Edit') {
      this.addEditText = "Edit"
      this.protocolParamValueFormValidation()
      this.getParamValueByParamValueIdForEdit(this.protocolParamValueId);
      this.ProtocolparamValueFormView = true;
      this.protocolParamValueReadModeView = false;
      this.protocolParamValueViewMode = false;
    }
    else {
      this.addEditText = "Add"
      this.protocolParamValueFormValidation()
      this.ProtocolparamValueFormView = true;
      this.protocolParamValueReadModeView = false;
      this.protocolParamValueViewMode = false;
    }
    this.getRefProtocolParamValues();
  }
  protocolParamValueFormValidation() {
    this.protocolParamValueForm = this.formBuilder.group({
      id: [null],
      value: [null, [Validators.required, Validators.pattern(this.checkDataTypeName(this.dataTypeName))]],
      isDefaultValue: [],
      refCommProtocolParamValueId: [null],
      status: []
    });
    this.displayValueChange();
    this.defaultValueCheck();
  }

  getRefProtocolParamValues() {
    this.protocolService.getProtocolParamByProtocolParamId(this.protocolParamId)
      .subscribe(
        res => {
          this.refCommProtocolParamId = res.refCommProtocolParamId;
          //this.dataType = res.dataTypeName
         let checkNaN= isNaN(this.refCommProtocolParamId)
          if (!checkNaN) {
            this.protocolService.getAllProtocolParamValueByProtocolParamId(this.refCommProtocolParamId)
              .subscribe(
                res1 => {
                  this.refProtocolParamValues = res1;
                },
                error => {
                  //
                  // If the service is not available
                  this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
                });
          }
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getParamValueByParamValueIdForView(paramValueId) {
    this.protocolService.getProtocolParamValueByProtocolParamValueId(paramValueId)
      .subscribe(
        res => {
          this.protocolParamValue = res;
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getParamValueByParamValueIdForEdit(paramValueId) {
    this.protocolService.getProtocolParamValueByProtocolParamValueId(paramValueId)
      .subscribe(
        res => {
          console.log(res);
          this.protocolParameterValue = res.value;
          this.protocolParamValueForm.patchValue({
            id: res.id,
            value: res.value,
            isDefaultValue: res.isDefaultValue,
            status: res.status,
            refCommProtocolParamValueId: res.refCommProtocolParamValueId
          });
          if (res.isDefaultValue) {
            this.isEditable = false;
          }
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  previewProtocolParamValue() {
    Object.keys(this.protocolParamValueForm.controls).forEach((key) => {
      if (this.protocolParamValueForm.get(key).value != null) {
        let value = "" + this.protocolParamValueForm.get(key).value;
        this.protocolParamValueForm.get(key).setValue(value.trim());
      }
    });
    this.protocolParamValue = <ProtocolParamValue>this.protocolParamValueForm.value;
    let isPresent=this.protocolParamValue.isDefaultValue;
    let isPresentString=isPresent.toString();
    if (isPresentString=="true") {
      this.isDefaultValue = 'Yes';
    }
    else {
      this.isDefaultValue = 'No';
    }
    this.ProtocolparamValueFormView = false;
    this.protocolParamValueReadModeView = true;
    this.protocolParamValueViewMode = false;
  }

  createOrUpdateProtocolParamValue(): void {
    this.showLoaderImage = true;
    this.protocolParamValue.commProtocolParamId = this.protocolParamId;
    if (this.protocolParamValue.id === null) {
      this.protocolParamValue.createdBy = +sessionStorage.getItem('userId');
      this.protocolParamValue.status = "A";
      this.protocolService.addProtocolParamValue(this.protocolParamValue).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        }
      );
    }
    else {
      this.protocolParamValue.updatedBy = +sessionStorage.getItem('userId');
      this.protocolService.updateProtocolParamValue(this.protocolParamValue).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        }
      );
    }
  }

  // redirect To
  redirectTo() {
    this.globalService.GettingId(this.protocolParamId);
    this.globalService.GettingString('mngprotocolParamValueView');
    this.protocolService.setTabLevel(this.protocolGroupTabLevel);
    this.router.navigate(['../'], { relativeTo: this.route });
    this.protocolParamValueForm.reset();
  }

  getProtocolParamData() {
    this.protocolParamId = JSON.parse(sessionStorage.getItem('protocolParamId'));
    this.protocolName = sessionStorage.getItem('protocolName');
    this.protocolGroupName = sessionStorage.getItem('protocolParamGroupName');
    this.protocolParamLevel = sessionStorage.getItem('protocolParamLevel');
    this.protocolService.getProtocolParamByProtocolParamId(this.protocolParamId)
      .subscribe(
        res => {
          this.dataTypeName = res.dataTypeName;
          this.protocolParamDisplayName = res.name;
          sessionStorage.setItem('protocolParamName', res.name);

        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  resetParamValueForm() {
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.protocolParamValue = <ProtocolParamValue>this.protocolParamValueForm.value;
    if (this.protocolParamValue.id === null) {
      this.protocolParamValueFormValidation();
    }
    else {
      this.protocolParamValueFormValidation();
      this.getParamValueByParamValueIdForEdit(this.protocolParamValue.id);
    }
  }

  backButton(elementId) {
    this.ProtocolparamValueFormView = true;
    this.protocolParamValueReadModeView = false;
    this.protocolParamValueViewMode = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
    this.formResetConfirm();
  }

  parseInt(id) {
    return parseInt(id);
  }

  cancelProtocolParamValueForm(event: Event) {
    this.globalService.GettingId(this.protocolParamId);
    this.globalService.GettingString('mngprotocolParamValueView');
    this.protocolService.setTabLevel(this.protocolGroupTabLevel);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cancelProtocolParamValueView(event: Event) {
    this.globalService.GettingId(this.protocolParamId);
    this.globalService.GettingString('mngprotocolParamValueView');
    this.protocolService.setTabLevel(this.protocolGroupTabLevel);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  defaultValueCheck() {
    if (this.globalService.isDefaultValue == true) {
      this.isEditable = true;
    }
    else {
      this.isEditable = false;
    }
  }
  displayValueChange() {
    this.protocolParamValueForm.controls['value'].valueChanges.subscribe(data => {
      let value = data.trim();
      if (value && this.protocolParameterValue != value) {
        if (this.checkProtocolParamValue(value)) {
          this.protocolParamValueForm.get('value').setErrors({ 'validateProtocolParamValue': true });
        }
        else {
          this.protocolParamValueForm.get('value').clearValidators();
          this.protocolParamValueForm.get('value').setValidators([Validators.required, Validators.pattern(this.checkDataTypeName(this.dataTypeName))]);
        }
      }
      else {
        this.protocolParamValueForm.get('value').clearValidators();
        this.protocolParamValueForm.get('value').setValidators([Validators.required, Validators.pattern(this.checkDataTypeName(this.dataTypeName))]);
      }
    });
  }
  checkProtocolParamValue(protocolParamValue) {
    return this.globalService.checkDuplcateName(this.globalService.protocolParamValues, protocolParamValue);
  }



  checkDataTypeName(dataTypeName) {
    if (dataTypeName != null && dataTypeName != undefined) {
      return this.globalSharedService.getPatternForCommunication(dataTypeName);
    }
  }

}
