import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// import { globalShareServices } from '../../../services/global/globalShareServices';
// import { CommonUnitService } from '../../../services/common-unit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'global';
import { DataProtocolTag } from '../../model/dataProtocolTag';
import { DataProtocolTagService } from '../../services/DataProtocolTag/data-protocol-tag.service';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/communication-protocol/pages/globalShareServices';
import { CommonUnitService } from 'src/app/communication-protocol/pages/common-unit.service';
import { globalSharedService } from 'src/app/shared/globalSharedService';

@Component({
  selector: 'app-data-protocol-tag-form',
  templateUrl: './data-protocol-tag-form.component.html',
  styleUrls: ['./data-protocol-tag-form.component.css']
})
export class DataProtocolTagFormComponent implements OnInit {

  addEditText: string;
  addAction: boolean;
  editAction: boolean;
  isChanged: boolean = false;

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('dataProtocolIOTagForm')) {
      if (this.dataProtocolIOTagForm.dirty) {
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

  IOTagFormView;
  IOTagReadModeView = false;
  dataTypes: any[];
  standardIOTags: any[];
  tagTypes: any[];
  dataProtocolId: number;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('gatewayTemplateIOTagName') dataProtocolTagNameReset: ElementRef = null;
  @ViewChild('gatewayTemplateIOTagDecsription') gatewayTemplateIOTagDecsription: ElementRef = null;
  @ViewChild('tagKeyNameId') tagKeyNameId: ElementRef = null;
  dataProtocolIOTagForm: FormGroup;
  dataProtocolTag: DataProtocolTag = new DataProtocolTag();
  tagIOModes: any[];
  warningFlag: string;
  dataProtocolTagId: number;
  IOTagFormAdd: boolean;
  IOTagFormAddAndEdit = true;
  showLoaderImage = false;
  public standardIOTagFields: Object = {
    text: 'name',
    value: 'id'
  };
  public dataTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public sortDropDown: string = 'Ascending';
  dataProtocolStandardTagId: any;
  dataTypeId: any;
  // set the placeholder to DropDownList input element
  public dataTypeWaterMark: string = 'Select Data Type';
  public standardIOTagWaterMark: string = 'Select StandardIOTag';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;
  dataProtocolValue: any;

  constructor(
    private dataProtocolTagService: DataProtocolTagService,
    private globalShareService: globalShareServices,
    private commonUnitService: CommonUnitService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private globalService: globalSharedService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.loadFormData();
    this.addAction = this.globalService.addTag;
    this.editAction = this.globalService.editTag;
    setTimeout(() => {
      this.isChanged = false;
    }, 500);
  }

  loadFormData() {
    this.getDataTypes();
    this.getTagTypes();
    this.getTagIOMode();
    this.getStandardIOTag();
    this.dataProtocolTagId = Number(this.globalService.id);
    let operation = this.globalService.name;
    if (this.dataProtocolTagId != 0 && operation === 'Edit') {
      this.addEditText = "Edit"
      this.dpTagFormValidation();
      this.dataProtocolId = Number(this.globalService.globalId);
      this.getDataProtocolTagById(this.dataProtocolTagId);
      this.IOTagFormView = true;
      this.IOTagReadModeView = false;
    } else {
      this.addEditText = "Add"
      this.dataProtocolId = this.globalService.globalId;
      this.dpTagFormValidation();
      this.IOTagFormView = true;
      this.IOTagReadModeView = false;
    }
  }

  dpTagFormValidation() {
    this.dataProtocolIOTagForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
      description: [],
      tagKeyName: [],
      dataTypeId: [1],
      tagType: ['ANALOG'],
      dataProtocolStandardTagId: [null],
      status: ['Active'],
      tagIOMode: [1]
    });

  }

  getDataTypes(): void {
    this.commonUnitService.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  getTagTypes(): void {
    this.commonUnitService.getTagTypes()
      .subscribe(
        res => {
          this.tagTypes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  getTagIOMode(): void {
    this.commonUnitService.getTagIOMode()
      .subscribe(
        res => {
          this.tagIOModes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  getStandardIOTag(): void {
    this.commonUnitService.getStandardIOTags()
      .subscribe(
        res => {
          this.standardIOTags = res as any[];
          this.standardIOTags = this.globalShareService.addSelectIntoList(this.standardIOTags);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  createIOTag(): void {
    this.IOTagFormView = false;
    // this.IOTagFormAdd=false;
    this.IOTagFormAddAndEdit = false;
    this.IOTagReadModeView = true;
    this.dataProtocolTag = <DataProtocolTag>this.dataProtocolIOTagForm.value;
  }

  createOrUpdateGatewayTemplateIOTag(): void {
    this.showLoaderImage = true;
    this.dataProtocolTag = <DataProtocolTag>this.dataProtocolIOTagForm.value;
    if (this.dataProtocolTag.tagIOMode == '1') {
      this.dataProtocolTag.tagIOMode = 'I'
    } else {
      this.dataProtocolTag.tagIOMode = 'O'
    }

    let userId = +sessionStorage.getItem('userId');
    this.dataProtocolTag.dataProtocolId = this.dataProtocolId;
    if (this.dataProtocolTag.id === null) {
      this.dataProtocolTag.createdBy = userId;
      this.dataProtocolTagService.saveDataProtocolTag(this.dataProtocolTag).subscribe((res) => {
        this.showLoaderImage = false;
        this.dpTagFormValidation();
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
      this.dataProtocolTag.updatedBy = userId;
      this.dataProtocolTagService.updateDataProtocolTag(this.dataProtocolTag).subscribe((res) => {
        this.dpTagFormValidation();
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  getDataProtocolTagById(dataProtocolTagId: number) {
    this.dataProtocolTagService.getDataProtocolTagById(dataProtocolTagId).subscribe(data => {
      this.dataProtocolTag = data;
      if (this.dataProtocolTag.tagType == 'A') {
        this.dataProtocolTag.tagType = 'ANALOG'
      } else {
        this.dataProtocolTag.tagType = 'DISCRETE'
      }
      if (this.dataProtocolTag.tagIOMode == 'I') {
        this.dataProtocolTag.tagIOMode = '1'
      } else {
        this.dataProtocolTag.tagIOMode = '2'
      }
      this.patchFormData();
    })
  }

  patchFormData() {
    this.dataProtocolIOTagForm.patchValue({
      id: this.dataProtocolTag.id,
      name: this.dataProtocolTag.name,
      createdBy: this.dataProtocolTag.createdBy,
      description: this.dataProtocolTag.description,
      tagKeyName: this.dataProtocolTag.tagKeyName,
      tagType: this.dataProtocolTag.tagType,
      dataTypeId: this.dataProtocolTag.dataTypeId,
      dataProtocolStandardTagId: this.dataProtocolTag.dataProtocolStandardTagId,
      tagIOMode: this.dataProtocolTag.tagIOMode,
      status: this.dataProtocolTag.status
    });
    this.dataProtocolValue = this.dataProtocolTag;
  }

  resetIOTagForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.isChanged = false;
    this.dataProtocolTag = <DataProtocolTag>this.dataProtocolIOTagForm.value;
    this.dpTagFormValidation();
    if (this.dataProtocolValue.id != null){
      this.dataProtocolIOTagForm.patchValue({
        id: this.dataProtocolValue.id,
        name: this.dataProtocolValue.name,
        createdBy: this.dataProtocolValue.createdBy,
        description: this.dataProtocolValue.description,
        tagKeyName: this.dataProtocolValue.tagKeyName,
        tagType: this.dataProtocolValue.tagType,
        dataTypeId: this.dataProtocolValue.dataTypeId,
        dataProtocolStandardTagId: this.dataProtocolValue.dataProtocolStandardTagId,
        tagIOMode: this.dataProtocolValue.tagIOMode,
        status: this.dataProtocolValue.status
      });
    }
  }


  backButton(elementId) {

    this.IOTagFormView = true;
    this.IOTagFormAddAndEdit = true;
    this.IOTagReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });

  }
  cancelGatewayTemplateIOTagForm(event: Event) {
    this.isChanged = false;
    this.formCancelConfirm();
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalService.GettingId(this.dataProtocolId);
    this.globalShareService.GettingString('DPTag');
    this.router.navigate(['../'], { relativeTo: this.route });

  }

  onInputTagKeyName() {
    this.isChanged = true;
  }

  tagIoModeChange() {
    this.isChanged = true;
  }

  tagTypeChange() {
    this.isChanged = true;
  }

  parseInt(id) {
    return parseInt(id);
  }
  onKey(event: any) {
    this.isChanged = true;
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.dataProtocolIOTagForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  redirectTo() {
    this.globalService.GettingId(this.dataProtocolId);
    this.globalShareService.GettingString('DPTag');
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  dataTypeOnChange($event) {
    this.isChanged = true;
    if ($event.value) {
      this.dataProtocolIOTagForm.controls['dataTypeId'].setValue($event.itemData.id);
    }
  }
  standardIOTagOnChange($event) {
    this.isChanged = true;
    if ($event.value) {
      this.dataProtocolIOTagForm.controls['dataProtocolStandardTagId'].setValue($event.itemData.id);
    } else {
      this.dataProtocolIOTagForm.controls['dataProtocolStandardTagId'].setValue(null);
    }
  }
}
