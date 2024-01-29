import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Protocol } from '../../model/protocol';
import { ProtocolService } from '../../services/protocol.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { UIModalNotificationPage,DialogService} from 'global';
import { globalShareServices } from '../globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';

@Component({
  selector: 'app-protocol-form',
  templateUrl: './protocol-form.component.html',
  styleUrls: ['./protocol-form.component.css']
})
export class ProtocolFormComponent implements OnInit {
  addEditText: string;
  protocolCode: string;
  protocolName: string;
  nameCase: any;


  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('protocolForm')) {
      if (this.protocolForm.dirty) {
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

  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  protocolForm: FormGroup;
  protocol: Protocol = new Protocol();
  protocolFormView = true;
  protocolReadModeView = false;
  protocolView = false;
  serviceMessage = '';
  dynamicRedirection: string;
  commProtocolLevels: any[]
  protocolParamLevel: string;
  warningFlag: string;
  showLoaderImage = false;
  // checkProtocolCodeValue = false;
  constructor(private protocolService: ProtocolService,
    private formBuilder: FormBuilder,
    private router: Router,
    private globalService: globalShareServices,
    private globalShareSevice: globalSharedService,
    private dialogService: DialogService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let id = Number(this.globalService.assignId);
    let operation = this.globalService.name;
    if (id != 0 && operation === 'View') {
      this.getProtocolByProtocolIdForView(id);
      this.protocolFormView = false;
      this.protocolReadModeView = false;
      this.protocolView = true;
    }
    else if (id != 0 && operation === 'Edit') {
      this.addEditText = "Edit"
      this.protocolFormValidation();
      this.getProtocolByProtocolIdForEdit(id);
      this.protocolFormView = true;
      this.protocolReadModeView = false;
      this.protocolView = false;
    }
    else {
      this.addEditText = "Add"
      this.protocolFormValidation();
      this.protocolFormView = true;
      this.protocolReadModeView = false;
      this.protocolView = false;
    }
  }

  protocolFormValidation() {
    this.protocolForm = this.formBuilder.group({
      id: [null],
      name: [, [
        Validators.required,
        Validators.pattern(this.globalShareSevice.getNamePattern())
      ]],
      description: [],
      commProtocolLevel: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern("^[a-zA-Z_]*")]],
      status: []
    });
    this.protocolForm.controls['code'].valueChanges.subscribe(data => {
      let str = data.toUpperCase().trim();
      this.protocolForm.controls['code'].patchValue(this.protocolForm.controls['code'].value.toUpperCase(), { emitEvent: false });
      if (str && this.protocolCode != str) {
        if (this.checkProtocolCode(str)) {
          this.protocolForm.get('code').setErrors({ 'checkProtocolCodeValue': true });
        }
        else {
          this.protocolForm.get('code').clearValidators();
          this.protocolForm.get('code').setValidators([Validators.required, Validators.pattern("^[a-zA-Z_]*")]);
        }
      }
      else {
        // this.checkProtocolCodeValue = false;
        this.protocolForm.get('code').clearValidators();
        this.protocolForm.get('code').setValidators([Validators.required, Validators.pattern("^[a-zA-Z_]*")]);
      }
    });
    this.protocolForm.controls['name'].valueChanges.subscribe(data => {
      let value = data.trim();
      if (value && this.protocolName != value) {
        if (this.checkProtocolName(value)) {
          this.protocolForm.get('name').setErrors({ 'validateProtocolName': true });
        }
        else {
          this.protocolForm.get('name').clearValidators();
          this.protocolForm.get('name').setValidators([Validators.required,
          Validators.pattern(this.globalShareSevice.getNamePattern())]);
        }
      }
      else {
        this.protocolForm.get('name').clearValidators();
        this.protocolForm.get('name').setValidators([Validators.required,
        Validators.pattern(this.globalShareSevice.getNamePattern())]);
      }
    });
  }

  getProtocolByProtocolIdForEdit(protocolId) {
    this.protocolService.getProtocolByProtocolId(protocolId)
      .subscribe(
        res => {
          this.protocolCode = res.code;
          this.protocolName = res.name;
          this.protocolForm.patchValue({
            id: res.id,
            name: res.name,
            description: res.description,
            commProtocolLevel: res.commProtocolLevel,
            code: res.code,
            status: res.status
          });
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        });
  }

  createProtocol(): void {
    this.protocolFormView = false;
    this.protocolReadModeView = true;
    this.protocolView = false;
    Object.keys(this.protocolForm.controls).forEach((key) => {
      let value = "" + this.protocolForm.get(key).value;
      if (this.protocolForm.get(key).value != null) {
        this.protocolForm.get(key).setValue(value.trim())
      }
    });
    this.protocol = <Protocol>this.protocolForm.value;
    if (this.protocol.commProtocolLevel === 'N2D') {
      this.protocolParamLevel = 'Node to Device'
    }
    else if (this.protocol.commProtocolLevel === 'N2P') {
      this.protocolParamLevel = 'Node to Platform'
    }
    else if (this.protocol.commProtocolLevel === 'SMS') {
      this.protocolParamLevel = 'SMS'
    }
  }

  // cancelButton
  cancelButton() {
    this.formCancelConfirm();
  }


  // Confirm redirect to
  formCancelConfirm() {
    // this.router.navigate(['/protocol-config']);
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  resetProtocolForm() {
    this.modelNotification.alertMessage(this.globalShareSevice.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.protocol = <Protocol>this.protocolForm.value;
    if (this.protocol.id === null) {
      this.protocolFormValidation();
    }
    else {
      this.protocolFormValidation();
      this.getProtocolByProtocolIdForEdit(this.protocol.id);
    }
  }


  backButton(elementId) {
    this.protocolFormView = true;
    this.protocolReadModeView = false;
    this.protocolView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  createOrUpdateProtocol(): void {
    this.showLoaderImage = true;
    if (this.protocol.id === null) {
      this.protocolService.addProtocol(this.protocol).subscribe((res) => {
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
      this.protocolService.updateProtocol(this.protocol).subscribe((res) => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalShareSevice.messageType_Fail, error);
        }
      );
    }
    this.protocolForm.reset();
  }

  // redirectTo
  redirectTo() {
    this.gotoProtocolList();
  }

  gotoProtocolList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  /* get data for view */
  getProtocolByProtocolIdForView(protocolId) {
    this.protocolService.getProtocolByProtocolId(protocolId)
      .subscribe(data => {
        this.protocol = data;
        if (data.commProtocolLevel === 'N2D') {
          this.protocol.commProtocolLevel = 'Node to Device'
        }
        else if (data.commProtocolLevel === 'N2P') {
          this.protocol.commProtocolLevel = 'Node to Platform'
        }
        else if (data.commProtocolLevel === 'SMS') {
          this.protocol.commProtocolLevel = 'SMS'
        }
        if (data.status === 'A') {
          this.protocol.status = 'Active';
        }
      });
  }

  //protocol view cancle
  cancelProtocolView(event: Event) {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onKey(event: any) {
    let isDH = this.globalShareSevice.doubleHyphen(event);
    if (isDH) {
      this.protocolForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  checkProtocolCode(protocolCode) {
    if (this.globalService.protocolCodeData.has(protocolCode)) {
      return true;
    }
    else {
      return false;
    }
  }
  protocolNamesCase = new Set();
  checkProtocolName(protocolName) {
    for (let item of Array.from(this.globalService.protocolNames.values())) {

      this.nameCase=item.toString().toUpperCase();
      this.protocolNamesCase.add(this.nameCase);
    }

    if (this.protocolNamesCase.has(protocolName.toUpperCase())) {
      return true;
    }
    else {
      return false;
    }
  }
}
