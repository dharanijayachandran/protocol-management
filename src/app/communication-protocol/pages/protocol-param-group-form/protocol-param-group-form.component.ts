import { Component, OnInit, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProtocolParamGroup } from '../../model/protocol-param-group';
import { Router, ActivatedRoute } from '@angular/router';
import { ProtocolService } from '../../services/protocol.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { DialogService, UIModalNotificationPage } from 'global';
import { globalShareServices } from '../globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';

@Component({
  selector: 'app-protocol-param-group-form',
  templateUrl: './protocol-param-group-form.component.html',
  styleUrls: ['./protocol-param-group-form.component.css']
})
export class ProtocolParamGroupFormComponent implements OnInit {
  isDisplayOrder: boolean = false;
  ParamGroupIdData: ProtocolParamGroup;
  protocolParamGroupName: string;
  displayOrder: number;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('paramGroupForm')) {
      if (this.paramGroupForm.dirty) {
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paramGroupForm: FormGroup;
  protocolParamGroup: ProtocolParamGroup = new ProtocolParamGroup();
  paramGroupFormView = true;
  paramGroupReadModeView = false;
  paramGroupView = false;
  dynamicRedirection: string;
  protocolId: number;
  protocolParamLevel: string;
  protocolDisplayName: string;
  serviceMessage: string;
  warningFlag: string;
  showLoaderImage = false;
  addEditText: string;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private globalService: globalShareServices,
    private protocolService: ProtocolService,
    private globalShareSevice: globalSharedService,
    private dialogService: DialogService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.protocolService.tabLevel != null) {
      this.protocolParamLevel = this.protocolService.tabLevel;
    }
    this.getProtocolData();
    this.paramGroupFormValidation();
    let id = Number(this.globalService.assignId);
    let operation = this.globalService.name;
    if (id != 0 && operation == 'View') {
      this.getParamGroupByParamGroupIdForView(id);
      this.paramGroupFormView = false;
      this.paramGroupReadModeView = false;
      this.paramGroupView = true;
    }
    else if (id != 0 && operation == 'Edit') {
      this.addEditText = "Edit"
      this.getParamGroupByParamGroupIdForEdit(id);
      this.paramGroupFormView = true;
      this.paramGroupReadModeView = false;
      this.paramGroupView = false;
    }
    else {
      this.addEditText = "Add"
      this.paramGroupFormView = true;
      this.paramGroupReadModeView = false;
      this.paramGroupView = false;
    }
  }

  paramGroupFormValidation() {
    this.paramGroupForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalShareSevice.getNamePattern())]],
      description: [],
      displayOrder: [null, [Validators.pattern("[0-9]*")]],
      commProtocolId: [],
      commProtocolParamLevel: [],
      status: []
    });
    this.paramGroupForm.controls['name'].valueChanges.subscribe(data => {
      let value=data.trim();
      if (value && this.protocolParamGroupName != value) {
        if (this.checkProtocolParamGroupName(value)) {
          this.paramGroupForm.get('name').setErrors({ 'validateProtocolParamGroupName': true });
        }
        else {
          this.paramGroupForm.get('name').clearValidators();
          this.paramGroupForm.get('name').setValidators([Validators.required,
          Validators.pattern(this.globalShareSevice.getNamePattern())]);
        }
      }
      else {
        this.paramGroupForm.get('name').clearValidators();
        this.paramGroupForm.get('name').setValidators([Validators.required,
        Validators.pattern(this.globalShareSevice.getNamePattern())]);
      }
    });
    this.displayOrderChange();
  }

  getProtocolData() {
    this.protocolId = JSON.parse(sessionStorage.getItem('protocolId'));
    this.protocolService.getProtocolByProtocolId(this.protocolId)
      .subscribe(
        res => {
          this.protocolDisplayName = res.name;
          sessionStorage.setItem('protocolName', res.name);
        },
        error => {
          //
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
  }

  getParamGroupByParamGroupIdForEdit(paramGroupId) {
    this.protocolService.getProtocolParamGroupByProtocolParamGroupId(paramGroupId)
      .subscribe(
        res => {
          this.protocolParamGroupName = res.name;
          this.displayOrder = parseInt(res.displayOrder);
          this.ParamGroupIdData = res;
          this.paramGroupForm.patchValue({
            id: res.id,
            name: res.name,
            description: res.description,
            displayOrder: res.displayOrder,
            status: res.status,
            commProtocolId: res.commProtocolId,
            commProtocolParamLevel: res.commProtocolParamLevel
          });
          this.protocolParamLevel = res.commProtocolParamLevel;
        },
        error => {
          //
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });

  }

  createParamGroup(): void {
    this.paramGroupFormView = false;
    this.paramGroupReadModeView = true;
    this.paramGroupView = false;
    Object.keys(this.paramGroupForm.controls).forEach((key) => {
      let value = "" + this.paramGroupForm.get(key).value;
      if (this.paramGroupForm.get(key).value != null) {
        this.paramGroupForm.get(key).setValue(value.trim())
      }
    });
    this.protocolParamGroup = <ProtocolParamGroup>this.paramGroupForm.value;
  }

  createOrUpdateProtocolGroup(): void {
    this.showLoaderImage = true;
    if (this.protocolParamGroup.id === null) {
      this.protocolParamGroup.commProtocolId = this.protocolId;
      this.protocolParamGroup.commProtocolParamLevel = this.protocolParamLevel;

      this.protocolService.addProtocolParamGroup(this.protocolParamGroup).subscribe((res) => {
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
       this.protocolService.updateProtocolParamGroup(this.protocolParamGroup).subscribe((res) => {
         this.showLoaderImage = false;
         this.modelNotification.alertMessage(res['messageType'], res['message']);
       },
         (error: any) => {
           this.showLoaderImage = false;
           this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
         }
       );
    }
  }

  // redirectTo
  redirectTo() {
    this.paramGroupForm.reset();
    // this.router.navigate(['/protocol-config']);
    this.router.navigate(['../'], { relativeTo: this.route });
    this.globalService.GettingId(this.protocolId);
    this.globalService.GettingString('mngProtocolParamGroup');
    this.protocolService.setTabLevel(this.protocolParamGroup.commProtocolParamLevel);
  }

  resetParamGroupForm() {
    this.modelNotification.alertMessage(this.globalShareSevice.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.protocolParamGroup = <ProtocolParamGroup>this.paramGroupForm.value;
    if (this.protocolParamGroup.id === null) {
      this.paramGroupFormValidation();
    }
    else {
      this.paramGroupFormValidation();
      this.getParamGroupByParamGroupIdForEdit(this.protocolParamGroup.id);
    }
  }

  backButton(elementId) {
    this.paramGroupFormView = true;
    this.paramGroupReadModeView = false;
    this.paramGroupView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  gotoParamGroupList() {
    this.router.navigate([this.dynamicRedirection]);
  }

  // Current tab
  @Output() tabName = new EventEmitter<string>();

  cancelParamGroupView(event: Event) {
    this.globalService.GettingId(this.protocolId);
    this.tabName.emit('mngProtocolParamGroup');
    this.globalService.GettingString('mngProtocolParamGroup');
    this.protocolService.setTabLevel(this.protocolParamGroup.commProtocolParamLevel);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getParamGroupByParamGroupIdForView(paramGroupId) {
    this.protocolService.getProtocolParamGroupByProtocolParamGroupId(paramGroupId)
      .subscribe(data => {
        this.protocolParamGroup = data;
        if (data.status === 'A') {
          this.protocolParamGroup.status = 'Active';
        }
      });
  }

  cancelProtocolParamGroupForm(event: Event) {
    this.formCancelConfirm();
  }
  onKey(event: any) {
    let isDH = this.globalShareSevice.doubleHyphen(event);
    if (isDH) {
      this.paramGroupForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  // Confirm redirect to
  formCancelConfirm() {
    // this.tabName.emit('mngProtocolParamGroup');
    this.globalService.GettingId(this.protocolId);
    this.globalService.GettingString('mngProtocolParamGroup');
    this.protocolService.setTabLevel(this.protocolParamLevel);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  displayOrderChange() {
    this.paramGroupForm.controls['displayOrder'].valueChanges.subscribe(data => {
      if (data && this.displayOrder != Number(data)) {
        if (this.displayOrderCheck(data)) {
          this.paramGroupForm.get('displayOrder').setErrors({ 'validateDisplayOrder': true });
        }
        else {
          this.paramGroupForm.get('displayOrder').clearValidators();
          this.paramGroupForm.get('displayOrder').setValidators([Validators.pattern("[0-9]*")]);
        }
      }
      else {
        this.paramGroupForm.get('displayOrder').clearValidators();
        this.paramGroupForm.get('displayOrder').setValidators([Validators.pattern("[0-9]*")]);
      }
    });
  }

  displayOrderCheck(data) {
    if (this.protocolParamLevel == "CH") {
      return this.globalService.checkDisplayOrder(this.globalService.channelDisplayOrderData, Number(data))
    }
    else if (this.protocolParamLevel == "NC") {
      return this.globalService.checkDisplayOrder(this.globalService.nodeComponentDisplayOrderdata, Number(data));
    }
    else if (this.protocolParamLevel == "NCDH") {
      return this.globalService.checkDisplayOrder(this.globalService.nodeDataHandlerDisplayOrderdata, Number(data));
    }
  }

  checkProtocolParamGroupName(protocolParamGroupName) {

    if (this.protocolParamLevel == "CH") {
      return this.globalService.checkDuplcateName(this.globalService.channelParamGroupNames, protocolParamGroupName);
    }
    else if (this.protocolParamLevel == "NC") {
      return this.globalService.checkDuplcateName(this.globalService.nodeComponentParamGroupNames, protocolParamGroupName);
    }
    else if (this.protocolParamLevel == "NCDH") {
      return this.globalService.checkDuplcateName(this.globalService.dataHandlerParamGroupNames, protocolParamGroupName);
    }
  }
}
