import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ProtocolParam } from '../../model/protocol-param';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProtocolService } from '../../services/protocol.service';
import { Observable } from 'rxjs';
import { DialogService, UIModalNotificationPage } from 'global';
import { globalShareServices } from '../globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { CommonUnitService } from '../common-unit.service';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';


@Component({
  selector: 'app-protocol-param-form',
  templateUrl: './protocol-param-form.component.html',
  styleUrls: ['./protocol-param-form.component.css']
})
export class ProtocolParamFormComponent implements OnInit {

  isDisplayOrder: boolean = false;
  protocolParamData: ProtocolParam;
  protocolParamName: string;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('protocolParamForm')) {
      if (this.protocolParamForm.dirty) {
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

  ProtocolparamFormView = true;
  protocolParamReadModeView = false;
  protocolParamViewMode = false;
  dynamicRedirection: string;
  dataTypes: any[];
  enggUnits: any[];
  uiComponentTypes: any[];
  refProtocolParameters: any[];
  refProtocolParamValues: any[];
  protocolParamForm: FormGroup;
  paramGroupId: number;
  protocolParamGroupDisplayName: string;
  protocolName: string;
  protocolId: number;
  //protocolParamGroupId: number;
  protocolParamLevel: any;
  isRefParamValue: boolean = false;
  resetButton: boolean = true;
  protocolParam: ProtocolParam = new ProtocolParam();
  // protocolParamId: number;
  paramLevel: string;
  isNull: string;
  protocolParamGroupId = Number(JSON.parse(sessionStorage.getItem('paramGroupId')));
  protocolParamId: number;
  warningFlag: string;
  showLoaderImage = false;
  addEditText: string;

  public dataTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public enggUnitFields: Object = {
    text: 'name',
    value: 'id'
  };
  public uiComponentTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public refProtocolParameterField: Object = {
    text: 'name',
    value: 'id'
  };
  public refProtocolParamValueFields: Object = {
    text: 'value',
    value: 'id'
  };
  dataTypeId:any;
  engUnitId:any;
  uiComponentTypeId:any;
  refCommProtocolParamVauleId:any;
  refCommProtocolParamId:any;
   // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterDropdown(e,this.dataTypes);
  }
  public onFilteringEnggUnit: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterDropdown(e,this.enggUnits);
  }

  public onFilteringUiComponentType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterDropdown(e,this.uiComponentTypes);
  }
  public onFilteringRefProtocolParamete: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterDropdown(e,this.refProtocolParameters);
  }
  public onFilteringRefProtocolParamValues: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterDropdown(e,this.refProtocolParamValues);
  }
  filterDropdown(e: FilteringEventArgs,filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sort:string ='Ascending';

  // set the placeholder to DropDownList input element
  public dataTypeWaterMark: string = 'Select Data Type';
  public enggUnitWaterMark: string = 'Select Engg Unit';
  public refProtocolParameterWaterMark: string = 'Select Ref protocol Parameter';
  public refProtocolParamValueWaterMark: string = 'Select Engg Unit';
  // set the placeholder to DropDownList input element
  public uiComponentTypeWaterMark: string = 'Select Ref protocol Parameter Value';
  // set the placeholder to filter search box input element
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private globalService: globalShareServices,
    private protocolService: ProtocolService,
    private commonUnitService: CommonUnitService,
    private globalShareSevice: globalSharedService,
    private dialogService: DialogService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getDataTypes();
    this.getEnggUnits();
    this.getUIComponentTypes();
    this.getProtocolGroupData();
    this.protocolParamGroupId = Number(JSON.parse(sessionStorage.getItem('paramGroupId')));
    this.protocolParamId = Number(this.globalService.assignId);
    this.getRefProtocolParameters(this.protocolParamGroupId, this.protocolParamId);
    let operation = this.globalService.name;
    if (this.protocolParamId != 0 && operation === 'View') {
      this.getProtocolParamByProtocolParamIdForView(this.protocolParamId);
      this.ProtocolparamFormView = false;
      this.protocolParamReadModeView = false;
      this.protocolParamViewMode = true;
    }
    else if (this.protocolParamId != 0 && operation === 'Edit') {
      this.addEditText = "Edit"
      this.protocolParamFormValidation();
      this.getProtocolParamByProtocolParamIdForEdit(this.protocolParamId);
      this.ProtocolparamFormView = true;
      this.protocolParamReadModeView = false;
      this.protocolParamViewMode = false;
    }
    else {
      this.addEditText = "Add"
      this.protocolParamFormValidation();
      this.ProtocolparamFormView = true;
      this.protocolParamReadModeView = false;
      this.protocolParamViewMode = false;
    }
  }
  getfilterdRefProtocolParameters(protocolParamId: number) {

  }

  protocolParamFormValidation() {
    this.protocolParamForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalShareSevice.getNamePattern())]],
      description: [],
      dataTypeId: [null, Validators.required],
      engUnitId: [null],
      uiComponentTypeId: [null, Validators.required],
      defaultValue: [],
      displayOrder: [null, [Validators.pattern("[0-9]*")]],
      isNull: [],
      status: [],
      refCommProtocolParamId: [null],
      refCommProtocolParamVauleId: [null],
      refProtocolParamValues:[]
    });
    this.protocolParamForm.controls['name'].valueChanges.subscribe(data => {
      let value=data.trim();
      if (value && this.protocolParamName != value) {
        if (this.checkProtocolParamName(value)) {
          this.protocolParamForm.get('name').setErrors({ 'validateProtocolParamName': true });
        }
        else {
          this.protocolParamForm.get('name').clearValidators();
          this.protocolParamForm.get('name').setValidators([Validators.required,
          Validators.pattern(this.globalShareSevice.getNamePattern())]);
        }
      }
      else {
        this.protocolParamForm.get('name').clearValidators();
        this.protocolParamForm.get('name').setValidators([Validators.required,
        Validators.pattern(this.globalShareSevice.getNamePattern())]);
      }
    });
  }

  parseInt(id) {
    return parseInt(id);
  }

  cancelProtocolParamView(event: Event) {
    this.globalService.GettingId(this.protocolParamGroupId);
    this.globalService.GettingString('mngProtocolParam');
    this.protocolService.setTabLevel(this.paramLevel);
    // this.router.navigate(['/protocol-config']);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  isProtocolParamSelected() {
    if (this.isRefParamValue) {
      this.protocolParamForm.get('refCommProtocolParamVauleId').markAsTouched();
      this.protocolParamForm.get('refCommProtocolParamVauleId').updateValueAndValidity();
      this.protocolParamForm.get('refCommProtocolParamVauleId').setErrors({
        'required': true
      })
    }
    else {
      this.protocolParamForm.get('refCommProtocolParamVauleId').clearValidators();
      this.protocolParamForm.get('refCommProtocolParamVauleId').updateValueAndValidity();
      this.protocolParamForm.get('refCommProtocolParamVauleId').setErrors(null)
    }
  }

  getProtocolParamByProtocolParamIdForView(paramId: number) {
    this.protocolService.getProtocolParamByProtocolParamId(paramId)
      .subscribe(
        res => {
          this.protocolParam = res;
          this.getRefProtocolParamValues(this.protocolParam.refCommProtocolParamId);
        },
        error => {
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
  }

  getProtocolParamByProtocolParamIdForEdit(paramId: number) {
    this.protocolService.getProtocolParamByProtocolParamId(paramId)
      .subscribe(
        res => {
          this.protocolParamData = res;
          this.protocolParamName = res.name;
          this.getRefProtocolParamValues(res.refCommProtocolParamId);
          this.protocolParamForm.patchValue({
            id: res.id,
            name: res.name,
            description: res.description,
            status: res.status,
            dataTypeId: res.dataTypeId,
            engUnitId: res.engUnitId,
            uiComponentTypeId: res.uiComponentTypeId,
            defaultValue: res.defaultValue,
            displayOrder: res.displayOrder,
            isNull: !res.isNull,
            commProtocolId: res.commProtocolId,
            commProtocolParamGroupId: res.commProtocolParamGroupId,
            refCommProtocolParamId: res.refCommProtocolParamId,
            refCommProtocolParamValueId: res.refCommProtocolParamValueId
          });
        },
        error => {
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
  }

  previewProtocolParam() {
    Object.keys(this.protocolParamForm.controls).forEach((key) => {
      let value = "" + this.protocolParamForm.get(key).value
      if (this.protocolParamForm.get(key).value != null) {
        this.protocolParamForm.get(key).setValue(value.trim())
      }
    });
    let protocolParam = this.protocolParamForm.value;
    this.protocolParam.refCommProtocolParamValueId=Number(this.protocolParamForm.get('refCommProtocolParamVauleId').value);
    this.patchData(protocolParam);
    if (this.protocolParam.isNull) {
      this.isNull = 'Yes';
    }
    else {
      this.isNull = 'No';
    }
    this.protocolParam.isNull = !this.protocolParam.isNull;
    this.ProtocolparamFormView = false;
    this.protocolParamReadModeView = true;
    this.protocolParamViewMode = false;
  }
  patchData(protocolParamForm) {
    this.protocolParam.id=protocolParamForm.id;
    this.protocolParam.name=protocolParamForm.name;
    this.protocolParam.description=protocolParamForm.description;
    this.protocolParam.status=protocolParamForm.status;
    this.protocolParam.dataTypeId=Number(protocolParamForm.dataTypeId);
    this.protocolParam.engUnitId=Number(protocolParamForm.engUnitId);
    this.protocolParam.uiComponentTypeId=Number(protocolParamForm.uiComponentTypeId);
    this.protocolParam.defaultValue=protocolParamForm.defaultValue;
    this.protocolParam.displayOrder=protocolParamForm.displayOrder;
    this.protocolParam.isNull=protocolParamForm.isNull;
    this.protocolParam.commProtocolId=Number(protocolParamForm.commProtocolId);
    this.protocolParam.commProtocolParamGroupId=Number(protocolParamForm.commProtocolParamGroupId);
    this.protocolParam.refCommProtocolParamId=Number(protocolParamForm.refCommProtocolParamId);
  }

  createOrUpdateProtocolParam(): void {
    this.showLoaderImage = true;
    this.protocolParam.commProtocolId = this.protocolId;
    this.protocolParam.commProtocolParamGroupId = this.protocolParamGroupId;
    if (this.protocolParam.id === null) {
      this.protocolService.addProtocolParam(this.protocolParam).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        }
      );
    }
    else {
      this.protocolService.updateProtocolParam(this.protocolParam).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        }
      );
    }
    this.isRefParamValue = false;
    this.isProtocolParamSelected();
  }

  // Redirect to
  redirectTo() {
    this.globalService.GettingId(this.protocolParamGroupId);
    this.globalService.GettingString('mngProtocolParam');
    this.protocolService.setTabLevel(this.paramLevel);
    this.router.navigate(['../'], { relativeTo: this.route });
    this.protocolParamForm.reset();
  }


  getDataTypes(): void {
    this.commonUnitService.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
        },
        error => {
          //
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
  }

  getEnggUnits(): void {
    this.commonUnitService.getEnggUnits()
      .subscribe(
        res => {
          this.enggUnits = res as any[];
          this.enggUnits= this.globalService.addSelectIntoList(this.enggUnits);
        },
        error => {
          //
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
  }

  getUIComponentTypes(): void {
    this.commonUnitService.getUIComponentTypes()
      .subscribe(
        res => {
          this.uiComponentTypes = res as any[];
        },
        error => {
          //
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
  }

  getRefProtocolParameters(paramGroupId, paramId): void {
    this.protocolService.getAllProtocolParamByProtocolParamGroupId(paramGroupId)
      .subscribe(
        res => {
          this.refProtocolParameters = res as any[];
          this.refProtocolParameters= this.globalService.addSelectIntoList(this.refProtocolParameters);
          if (paramId != null) {
            this.refProtocolParameters = this.refProtocolParameters.filter(param => param.id !== paramId);
          }
        },

        error => {
          //
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
    //
  }

  getRefProtocolParamValues(slectedValue): void {
    if (slectedValue === "null" || slectedValue == undefined) {
      this.refProtocolParamValues = [];
      /* this.isRefParamValue = false;
      this.isProtocolParamSelected(); */
    } else {
      this.protocolService.getAllProtocolParamValueByProtocolParamId(slectedValue)
        .subscribe(
          res => {
            if(res.length>0){
              this.isRefParamValue = true;
              this.isProtocolParamSelected();
              this.refProtocolParamValues = res as any[];
              if (this.refProtocolParamValues) {
                let Obj = {
                  "value": "--Select--",
                  "id":0
                }
                this.refProtocolParamValues.push(Obj);
              }
            }
          },
          error => {
            //
            this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
          });

    }
  }

  getProtocolGroupData() {
    this.protocolId = +sessionStorage.getItem('protocolId');
    this.paramGroupId = +sessionStorage.getItem('paramGroupId');
    this.protocolName = sessionStorage.getItem('protocolName');
    this.protocolParamLevel = sessionStorage.getItem('protocolParamLevel');
    this.protocolService.getProtocolParamGroupByProtocolParamGroupId(this.paramGroupId)
      .subscribe(
        res => {
          this.protocolParamGroupDisplayName = res.name;
          this.paramLevel = res.commProtocolParamLevel;
          sessionStorage.setItem('protocolParamGroupName', res.name);

        },
        error => {
          //
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
  }

  resetParamForm() {
    this.modelNotification.alertMessage(this.globalShareSevice.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.protocolParam = <ProtocolParam>this.protocolParamForm.value;
    if (this.protocolParam.id === null) {
      this.protocolParamFormValidation();
    }
    else {
      this.protocolParamFormValidation();
      this.getProtocolParamByProtocolParamIdForEdit(this.protocolParam.id);
    }
  }


  backButton(elementId) {
    this.ProtocolparamFormView = true;
    this.protocolParamReadModeView = false;
    this.protocolParamViewMode = false;
    this.patchDataForBack();
  }
patchDataForBack(){
  let res =this.protocolParam;
  this.protocolParamForm.patchValue({
    id: res.id,
    name: res.name,
    description: res.description,
    status: res.status,
    dataTypeId: res.dataTypeId,
    engUnitId: res.engUnitId,
    uiComponentTypeId: res.uiComponentTypeId,
    defaultValue: res.defaultValue,
    displayOrder: res.displayOrder,
    isNull: !res.isNull,
    commProtocolId: res.commProtocolId,
    commProtocolParamGroupId: res.commProtocolParamGroupId,
    refCommProtocolParamId: res.refCommProtocolParamId,
    refCommProtocolParamValueId: res.refCommProtocolParamValueId,
    refProtocolParamValues:res.refProtocolParamValues
  });
}
  gotoParamList() {
    this.router.navigate([this.dynamicRedirection]);
  }

  cancelProtocolParamForm(event: Event) {
    this.formCancelConfirm();
  }


  // Confirm redirect to
  formCancelConfirm() {
    // this.protocolParamForm.reset();
    this.globalService.GettingId(this.protocolParamGroupId);
    this.globalService.GettingString('mngProtocolParam');
    this.protocolService.setTabLevel(this.paramLevel);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onKey(event: any) {
    let isDH = this.globalShareSevice.doubleHyphen(event);
    if (isDH) {
      this.protocolParamForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  onDisplayOrderChange() {
    this.protocolParamForm.controls['displayOrder'].valueChanges.subscribe(data => {
    let dOrder=  parseInt(this.protocolParamData.displayOrder)
      if (data && dOrder != Number(data)) {
        this.isDisplayOrder = this.globalService.checkDisplayOrder(this.globalService.protocolParamDisplayOrderData, Number(data));
      }
      else {
        this.isDisplayOrder = false;
      }
    });
  }

  checkProtocolParamName(protocolParamName) {
    return this.globalService.checkDuplcateName(this.globalService.protocolParamNames, protocolParamName);
  }
  unitOnChange($event){
    if ($event.value) {
      this.protocolParamForm.controls['engUnitId'].setValue(+$event.itemData.id);
    }else{
      this.protocolParamForm.controls['engUnitId'].setValue(null);
    }
  }
  dataTypeOnChange($event){
    if ($event.value) {
      this.protocolParamForm.controls['dataTypeId'].setValue(+$event.itemData.id);
    }
  }
  uiComponentTypeOnChange($event){
    if ($event.value) {
      this.protocolParamForm.controls['uiComponentTypeId'].setValue(+$event.itemData.id);
    }
  }
  refProtocolParamValuesOnChange($event){
    if ($event.value) {
      this.protocolParamForm.controls['refCommProtocolParamVauleId'].setValue(Number($event.itemData.id));
      this.protocolParamForm.controls['refProtocolParamValues'].setValue(Number($event.itemData.value));
    }else{
      this.protocolParamForm.controls['refCommProtocolParamVauleId'].setValue(null);
      this.protocolParamForm.controls['refProtocolParamValues'].setValue(null);
    }
  }
  refProtocolParameterOnChange($event){
    if ($event.value) {
     this.protocolParamForm.controls['refCommProtocolParamId'].setValue(Number($event.itemData.id));
     this.getRefProtocolParamValues(Number($event.itemData.id));
    }else{
      this.refProtocolParamValues = [];
      this.protocolParamForm.controls['refCommProtocolParamId'].setValue(null);
    }
  }
}
