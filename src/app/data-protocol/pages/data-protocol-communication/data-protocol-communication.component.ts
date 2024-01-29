import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DataSubProtocolDH } from '../../model/dataSubProtocolDH';
import { DataSubProtocolTag } from '../../model/dataSubProtocolTag';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSubProtocolDHService } from '../../services/DataSubProtocolDH/data-sub-protocol-dh.service';
import { DataSubProtocolService } from '../../services/DataSubProtocol/data-sub-protocol.service';
import { DataSubProtocolTagService } from '../../services/DataSubProtocolTag/data-sub-protocol-tag.service';
import { Observable } from 'rxjs';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { DataProtocolFormat } from 'src/app/shared/model/DataProtocolFormat';
import { DialogService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/communication-protocol/pages/globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { CommunicationService } from 'src/app/shared/services/communication/communication.service';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-data-protocol-communication',
  templateUrl: './data-protocol-communication.component.html',
  styleUrls: ['./data-protocol-communication.component.css']
})
export class DataProtocolCommunicationComponent implements OnInit {

  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild('myPaginatorChildComponentDH') myPaginatorChildComponentDH: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  dataSource: any;
  dataSubProtocol: DataSubProtocol = new DataSubProtocol();
  communicationReadModeView = false;
  communicationWriteModeView = true;
  dataSubProtocolTagsListView = true;
  dataSubProtocolDHListView = true;
  errorCheckTypes: any[];
  errorCheckAlgorithms: any[];
  dataSubProtocols: DataSubProtocol[];
  dataHandlerFormats: any[];
  dataSubProtocolTagsDataSource: any;
  dataSubProtocolDHDataSource: any;
  dataSubProtocolTagsDisplayedColumns: string[] = ['id', 'name', 'index', 'length', 'lengthUnit', 'tagKeyName', 'dataFormat', 'parentTag', 'action'];
  dataSubProtocolDHdisplayedColumns: string[] = ['id', 'name', 'dhCode', 'operationMode', 'responseRequired', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorForDataSubProtocolTags: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSubProtocolForm: FormGroup;
  NoRecordsFoundDataSubProtocolTag: boolean = false;
  NoRecordsFoundDataSubProtocolDH: boolean = false;
  dataSubProtocolDataHandler: DataSubProtocolDH;
  dataSubProtocolViewMode = false;
  dataProtocolId: number;
  serviceMessage: string;
  alertSuccess = false;
  alertDelete = false;
  dataSubProtocolTag: DataSubProtocolTag;
  dataSubProtocolModel: DataSubProtocol = new DataSubProtocol();
  @ViewChild(UIModalNotificationPage) modelNotification;
  dataSubProtocolTags: DataSubProtocolTag[];
  confirmDeleteMessage: string;
  dataSubProtocolDH: DataSubProtocolDH;
  showLoaderImage = false;
  warningFlag: string;
  resetDataSubProtocol: DataSubProtocol;
  dataProtocolCommForm: FormGroup;
  myPaginator1: any;
  public dataHandlerFormatFields: Object = {
    text: 'name',
    value: 'id'
  };
  public errorCheckTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public errorCheckAlgorithmFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringDataHandlerFormat: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataHandlerFormats);

  }

  public onFilteringErrorCheckType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.errorCheckTypes);
  }
  public onFilteringErrorCheckAlgorithm: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.errorCheckAlgorithms);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown:string ='Ascending';
  errorCheckTypeId:any;
  errorCheckAlgorithmId:any;
  dataSubProtocolFormatID:any;
  // set the placeholder to DropDownList input element
  public errorCheckAlgorithmWaterMark: string = 'Select Error Check Algorith';
  public errorCheckTypeWaterMark: string = 'Select Error Check Type';
  public dataHandlerFormatWaterMark: string = 'Select Data Handler Format';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;
  constructor(private globalService: globalSharedService,
    private communicationService: CommunicationService,
    private dataSubProtocolDHService: DataSubProtocolDHService,
    private globalSharedService: globalShareServices,
    private router: Router, private formBuilder: FormBuilder,
    private dataSubProtocolService: DataSubProtocolService,
    private route: ActivatedRoute,
    private dataSubProtocolTagService: DataSubProtocolTagService,
    private dialogService: DialogService) { }


  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('dataSubProtocolForm')) {
      if (this.dataSubProtocolForm.dirty) {
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
        // returning false will show a confirm dialog before navigating away
      } else {
        return true; // returning true will navigate without confirmation
      }
      return this.dialogService.navigateAwaySelection$;
    } else return true;
  }

  ngOnInit() {
    this.dataProtocolId = this.globalService.selectedId;
    this.loadFormData();
  }

  // Refresh table
  refreshTableListFunction() {
    this.getDataHandlerFormats();
    this.getErrorCheckTypes();
    this.getDataSubProtocols(this.dataProtocolId);
  }

  loadFormData() {
    this.showLoaderImage = true;
    this.dataProtocolCommForm = this.formBuilder.group({
      dataProtocolName: [''],
    })
    this.dataProtocolCommForm.patchValue({
      dataProtocolName: this.globalService.parentName
    })
    if (this.dataProtocolId == null || this.dataProtocolId == undefined) {
      this.dataProtocolId = this.globalSharedService.assignId;
    }
    this.validateDataSubProtocolForm();
    this.getDataHandlerFormats();
    this.getErrorCheckTypes();
    this.getDataSubProtocols(this.dataProtocolId);
  }

  validateDataSubProtocolForm() {
    this.dataSubProtocolForm = this.formBuilder.group({
      id: [null],
      dataSubProtocolFormatID: [null, Validators.required],
      dataProtocolTagSeparator: [null],
      errorCheckTypeId: [null],
      errorCheckAlgorithmId: [null],
      commProtocolId: [null],
      startValidator: [null],
      endValidator: [null],
      isEndValidatorCheckEnabled: [false],
      isStartValidatorCheckEnabled: [false],
      isErrorCheckEnabled: [false],
      isLengthCheckEnabled: [false]
    });
  }


  previewDataSubProtocolForm() {
    this.communicationWriteModeView = false;
    this.communicationReadModeView = true;
    this.dataSubProtocolTagsListView = false;
    this.dataSubProtocolDHListView = false;
    this.dataSubProtocolModel = <DataSubProtocol>this.dataSubProtocolForm.value;
  }

  createDataSubProtocol() {
    this.communicationReadModeView = false;
    let userId = sessionStorage.getItem('userId');
    this.dataSubProtocolModel.createdBy = parseInt(userId);
    this.dataSubProtocolModel.dataProtocolId = this.dataProtocolId;
    this.dataSubProtocolService.saveDataSubProtocol(this.dataSubProtocolModel).subscribe(res => {
      this.communicationWriteModeView = true;
      this.dataSubProtocolTagsListView = true;
      this.dataSubProtocolDHListView = true;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  public onChange(dataSubProtocol: DataSubProtocol): void {
    if (this.dataSubProtocolDHDataSource) {
      this.dataSubProtocolDHDataSource.data = []
    }
    if (this.dataSubProtocolTagsDataSource) {
      this.dataSubProtocolTagsDataSource.data = []
    }
    this.getDataSubProtocolTagsByDataSubProtocolId(dataSubProtocol.id);
    this.getDataSubProtocolDHsByDataSubProtocolId(dataSubProtocol.id);
    if (dataSubProtocol.commProtocol.name == "TCP_IP") {
      this.dataSubProtocolForm.addControl("commProtocolIdentifierOne", new FormControl(null, [Validators.required, Validators.pattern("[0-9]*")]));
      this.dataSubProtocolForm.patchValue({
        commProtocolIdentifierOne: dataSubProtocol.commProtocolIdentifierOne
      });
    }
    this.dataSubProtocolForm.patchValue({
      id: dataSubProtocol.id,
      dataSubProtocolFormatID: dataSubProtocol.dataSubProtocolFormat.id,
      dataProtocolTagSeparator: dataSubProtocol.dataProtocolTagSeparator,
      // errorCheckTypeId: errorCheckTypeId,
      errorCheckAlgorithmId: dataSubProtocol.errorCheckAlgorithmId,
      startValidator: dataSubProtocol.startValidator,
      endValidator: dataSubProtocol.endValidator,
      commProtocolId: dataSubProtocol.commProtocol.id,
      isEndValidatorCheckEnabled: dataSubProtocol.isEndValidatorCheckEnabled,
      isStartValidatorCheckEnabled: dataSubProtocol.isStartValidatorCheckEnabled,
      isErrorCheckEnabled: dataSubProtocol.isErrorCheckEnabled,
      isLengthCheckEnabled: dataSubProtocol.isLengthCheckEnabled
    });
    if (dataSubProtocol.errorCheckAlgorithmId !== null) {
      if (dataSubProtocol.errorCheckAlgorithm.errorCheckTypeId != null) {
        this.getErrorCheckAlgorithmOnPageLoad(dataSubProtocol.errorCheckAlgorithm.errorCheckTypeId)
      }
    }
    let errorCheckTypeId = null;
    if (dataSubProtocol.errorCheckAlgorithm != null) {
      errorCheckTypeId = dataSubProtocol.errorCheckAlgorithm.errorCheckTypeId
      this.getErrorCheckAlgorithm(errorCheckTypeId);
    }
  }

  getDataSubProtocols(dataProtocolId) {
    this.dataSubProtocolService.getDataSubProtocolsByDataProtocolId(dataProtocolId).subscribe(data => {
      this.showLoaderImage = false;
      this.dataSubProtocols = data;
      this.dataSubProtocols = this.dataSubProtocols.sort((a, b) => a.id - b.id);
      this.getDataSubProtocolTagsByDataSubProtocolId(this.dataSubProtocols[0].id);
      this.getDataSubProtocolDHsByDataSubProtocolId(this.dataSubProtocols[0].id);
      if (this.dataSubProtocols[0].errorCheckAlgorithmId != undefined) {
        if (this.dataSubProtocols[0].errorCheckAlgorithm.errorCheckTypeId != null) {
          this.getErrorCheckAlgorithmOnPageLoad(this.dataSubProtocols[0].errorCheckAlgorithm.errorCheckTypeId)
        }
      }
      let errorCheckTypeId = null;
      if (this.dataSubProtocols[0].errorCheckAlgorithm != null) {
        errorCheckTypeId = this.dataSubProtocols[0].errorCheckAlgorithm.errorCheckTypeId
        this.getErrorCheckAlgorithm(errorCheckTypeId);
      }
      if (this.dataSubProtocols[0].commProtocol.name == "TCP_IP") {
        this.dataSubProtocolForm.addControl("commProtocolIdentifierOne", new FormControl(null, [Validators.required, Validators.pattern("[0-9]*")]));
        this.dataSubProtocolForm.patchValue({
          commProtocolIdentifierOne: this.dataSubProtocols[0].commProtocolIdentifierOne
        });
      }
      this.dataSubProtocolForm.patchValue({
        id: this.dataSubProtocols[0].id,
        dataSubProtocolFormatID: this.dataSubProtocols[0].dataSubProtocolFormat.id,
        dataProtocolTagSeparator: this.dataSubProtocols[0].dataProtocolTagSeparator,
        errorCheckTypeId: errorCheckTypeId,
        errorCheckAlgorithmId: this.dataSubProtocols[0].errorCheckAlgorithmId,
        startValidator: this.dataSubProtocols[0].startValidator,
        endValidator: this.dataSubProtocols[0].endValidator,
        commProtocolId: this.dataSubProtocols[0].commProtocol.id,
        isEndValidatorCheckEnabled: this.dataSubProtocols[0].isEndValidatorCheckEnabled,
        isStartValidatorCheckEnabled: this.dataSubProtocols[0].isStartValidatorCheckEnabled,
        isErrorCheckEnabled: this.dataSubProtocols[0].isErrorCheckEnabled,
        isLengthCheckEnabled: this.dataSubProtocols[0].isLengthCheckEnabled
      });
    })
  }

  getDataSubProtocolTagsByDataSubProtocolId(dataSubProtocolId) {
    this.dataSubProtocolService.getDataSubProtocolTagsByDataSubProtocolId(dataSubProtocolId).subscribe(data => {
      this.dataSubProtocolTags = data;
      this.setDataSubProtocolTagsDataSource(data);
    })
  }

  getDataSubProtocolDHsByDataSubProtocolId(dataSubProtocolId) {
    this.dataSubProtocolDHService.getDataSubProtocolDHsByDataSubProtocolId(dataSubProtocolId).subscribe(data => {
      this.setDataSUbProtocolDHDataSource(data);
    })
  }

  setDataSubProtocolTagsDataSource(dataSubProtocolTags: any[]) {
    if (Array.isArray(dataSubProtocolTags) && dataSubProtocolTags.length) {
      dataSubProtocolTags.forEach(dataSubProtocolTag => {
        if (dataSubProtocolTag.dataSubProtocolTagFormat === null) {
          dataSubProtocolTag.dataSubProtocolTagFormat = new DataProtocolFormat();
        }
        this.dataHandlerFormats.forEach(formate => {
          if (formate.id == dataSubProtocolTag.dataSubProtocolTagFormatId) {
            dataSubProtocolTag.dataSubProtocolTagFormatName = formate.name;
          }
        })
        if (dataSubProtocolTag.parentNodeCommProtocolIoTagId) {
          dataSubProtocolTags.forEach(parentIoTag => {
            if (dataSubProtocolTag.parentNodeCommProtocolIoTagId == parentIoTag.id) {
              dataSubProtocolTag.parentTagName = parentIoTag.gatewayIOTag.name
            }
          })
        }
        if (!dataSubProtocolTag.dataSubProtocolTagFormatName) {
          dataSubProtocolTag.dataSubProtocolTagFormatName = ''
        }
        if (!dataSubProtocolTag.parentTagName) {
          dataSubProtocolTag.parentTagName = ''
        }
        if (dataSubProtocolTag.tagIndex==null) {
          dataSubProtocolTag.tagIndex = ''
        }

        if (!dataSubProtocolTag.tagLength) {
          dataSubProtocolTag.tagLength = ''
        }
        if (!dataSubProtocolTag.tagLengthUnit) {
          dataSubProtocolTag.tagLengthUnit = ''
        } if (!dataSubProtocolTag.tagKeyName) {
          dataSubProtocolTag.tagKeyName = ''
        }
        dataSubProtocolTag.tagIndex = dataSubProtocolTag.tagIndex + ''
      })
      dataSubProtocolTags.sort((a, b) => b.id - a.id);
      this.dataSubProtocolTagsDataSource = new MatTableDataSource();
      // Filter the datasource if it has multi level
      this.dataSubProtocolTagsDataSource.filterPredicate = function (data, filter: string): boolean {
        return data.dataProtocolTag.name.toLowerCase().includes(filter)
          || data.tagIndex.toLowerCase().includes(filter)
          || data.tagLength.toLowerCase().includes(filter)
          || data.tagLengthUnit.toLowerCase().includes(filter)
          || data.tagKeyName.toLowerCase().includes(filter)
          || data.dataSubProtocolTagFormatName.toLowerCase().includes(filter)
          || data.parentTagName.toLowerCase().includes(filter);
      };
      let dataSubProtocolTagsMap=new Map();
      dataSubProtocolTags.forEach(tag => {
        dataSubProtocolTagsMap.set(tag.id, tag)
      })
      dataSubProtocolTags.forEach(tag => {
        if(tag.parentDataSubProtocolTagId !=null && tag.parentTagName==""){
         let dataSubProtocolTag=dataSubProtocolTagsMap.get(tag.parentDataSubProtocolTagId)
         if (dataSubProtocolTag != undefined) {
          tag.parentTagName=dataSubProtocolTag.dataProtocolTag.name
         }
        }
      })
      this.dataSubProtocolTagsDataSource.data = dataSubProtocolTags


      // To get paginator events from child mat-table-paginator to access its properties
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);

      this.dataSubProtocolTagsDataSource.paginator = this.myPaginator;
      this.dataSubProtocolTagsDataSource.sort = this.sort;
      this.NoRecordsFoundDataSubProtocolTag = false;
    }
    else {
      this.NoRecordsFoundDataSubProtocolTag = true;
    }
  }

  setDataSUbProtocolDHDataSource(dataSubProtocolDHs: DataSubProtocolDH[]) {
    this.prepareDataSubProtocolDHs(dataSubProtocolDHs);
    dataSubProtocolDHs = dataSubProtocolDHs.sort((a, b) => b.id - a.id);
    if (Array.isArray(dataSubProtocolDHs) && dataSubProtocolDHs.length) {
      this.dataSubProtocolDHDataSource = new MatTableDataSource();
      this.dataSubProtocolDHDataSource.filterPredicate = function (data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter)
          || data.dhCode.toLowerCase().includes(filter)
          || data.operatioMode.toLowerCase().includes(filter)
          || data.sendResponseStr.toLowerCase().includes(filter);
      };
      this.dataSubProtocolDHDataSource.data = dataSubProtocolDHs;

      // To get paginator events from child mat-table-paginator to access its properties
      this.myPaginator1 = this.myPaginatorChildComponentDH.getDatasource();
      this.matTablePaginator(this.myPaginator1);

      this.dataSubProtocolDHDataSource.paginator = this.myPaginator1;
      this.dataSubProtocolDHDataSource.sort = this.sort;
      this.NoRecordsFoundDataSubProtocolDH = false;
    }
    else {
      this.NoRecordsFoundDataSubProtocolDH = true;
    }
  }

  prepareDataSubProtocolDHs(dataSubProtocolDHs: DataSubProtocolDH[]) {
    dataSubProtocolDHs.forEach(dataSubProtocolDH => {
      if (dataSubProtocolDH.operatioMode === 'R') {
        dataSubProtocolDH.operatioMode = 'Read'
      }
      else if (dataSubProtocolDH.operatioMode === 'W') {
        dataSubProtocolDH.operatioMode = 'Write'
      }

      if (dataSubProtocolDH.sendResponse === true) {
        dataSubProtocolDH.sendResponseStr = 'Yes'
      }
      else if (dataSubProtocolDH.sendResponse === false) {
        dataSubProtocolDH.sendResponseStr = 'No'
      }
    })
  }

  getDataHandlerFormats() {
    this.communicationService.getDataHandlerFormats().subscribe(data => {
      this.dataHandlerFormats = data;
    })
  }

  getErrorCheckTypes() {
    this.communicationService.getErrorCheckTypes().subscribe(data => {
      this.errorCheckTypes = data;
      this.errorCheckTypes= this.globalSharedService.addSelectIntoList(this.errorCheckTypes);
    })
  }

  getErrorCheckAlgorithm(errorCheckTypeId) {
    this.communicationService.getErrorCheckAlgorithmByErrorCheckTypeId(errorCheckTypeId).subscribe(data => {
      this.errorCheckAlgorithms = data;
    })
  }
  getErrorCheckAlgorithmOnPageLoad(errorCheckTypeId) {
    this.communicationService.getErrorCheckAlgorithmByErrorCheckTypeId(errorCheckTypeId).subscribe(data => {
      this.errorCheckAlgorithms = data;
    })
  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  backButton(elementId) {
    this.communicationWriteModeView = true;
    this.communicationReadModeView = false;
    this.dataSubProtocolTagsListView = true;
    this.dataSubProtocolDHListView = true;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  resetDataSubProtocolForm(dataSubProtocol: DataSubProtocol) {
    this.resetDataSubProtocol = dataSubProtocol
    if (dataSubProtocol.errorCheckAlgorithmId === null) {
      this.errorCheckAlgorithms = [];
    }
    if (this.dataSubProtocolForm.dirty) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }

  }


  // Form reset  confirm
  formResetConfirm() {
    this.dataSubProtocol = <DataSubProtocol>this.dataSubProtocolForm.value;
    if (this.dataSubProtocol.id === null) {
      this.validateDataSubProtocolForm();
    }
    else {
      this.validateDataSubProtocolForm();
      this.onChange(this.resetDataSubProtocol);
    }
  }

  setDataSubProtocolData(dataSubProtocol: DataSubProtocol, id, operation) {
    this.dataSubProtocolService.setDataSubProtocol(dataSubProtocol);
    this.globalService.GettingId(id);
    this.globalSharedService.GettingString(operation);
  }

  confirmDeleteDataSubProtocolDH() {
    let userId = sessionStorage.getItem('userId');
    this.dataSubProtocolDHService.deleteDataSubProtocolDH(this.dataSubProtocolDH.id, Number(userId)).subscribe(res => {
      dataSubProtocol: DataSubProtocol;
      //this.globalService.GettingId(this.dataSubProtocolDH.dataSubProtocol.dataProtocolId);
      this.dataProtocolId = this.dataSubProtocolDH.dataSubProtocol.dataProtocolId
      //  this.loadFormData();
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );

  }

  deleteDataProtocolCommDataHandler(dataSubProtocolDH) {
    this.confirmDeleteMessage = 'deleteDH';
    this.dataSubProtocolDH = dataSubProtocolDH;
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Data Protocol Data Handler!');
  }

  addChildDataSubProtocolTagData(dataSubProtocol: DataSubProtocol, id, view: String) {
    this.dataSubProtocolTagService.setDataSubProtocol(dataSubProtocol);
    this.globalSharedService.GettingId(id);
    this.globalSharedService.GettingString(view);
  }

  cancelCommunicationTab() {
    let myTab = document.getElementById('dataProtocol');
    myTab.click();
  }

  deleteDataSubProtocolTag(dataSubProtocolTag: DataSubProtocolTag) {
    this.confirmDeleteMessage = 'deleteTag';
    this.dataSubProtocolTag = dataSubProtocolTag
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Data Protocol Communication Tag!');
  }


  confirmDeleteDataSubProtocolTag() {
    let userId = sessionStorage.getItem('userId');
    //this.dataSubProtocolTag.updatedBy = parseInt(userId);
    this.dataSubProtocolService.deleteDataSubProtocolTag(this.dataSubProtocolTag.id, parseInt(userId)).subscribe(res => {
      this.dataProtocolId = this.dataSubProtocolTag.dataSubProtocol.dataProtocolId;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  confirmDelete() {
    if (this.confirmDeleteMessage == 'deleteTag') {
      this.confirmDeleteDataSubProtocolTag();
    } else {
      this.confirmDeleteDataSubProtocolDH();
    }
  }

  closeDelete() {
    $(".bd-example-modal-sm1").modal('hide');
    this.globalSharedService.GettingId(this.dataSubProtocol.dataProtocolId);
    this.globalSharedService.GettingString('communication');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cancelDelete() {
    $(".bd-example-modal-sm1").modal('hide');
  }

  closeSavePopup() {
    this.globalService.GettingId(this.dataProtocolId);
    this.loadFormData();
    $(".bd-example-modal-sm").modal('hide');
  }

  searchButton() {
    let x = <HTMLInputElement>document.getElementById("dataSubProtocolDHDataSource");
    if (x.style.display === "none") {
      x.style.display = "inline-block";
    } else {
      x.style.display = "none";
      // x.value = "";
    }
  }

  errorCheckTypeChange(errorCheckTypeId) {

    this.errorCheckAlgorithms = [];
    this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].setValidators([Validators.required]);
    this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].setValue(null);
    this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].markAsTouched();
    this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].updateValueAndValidity();
    this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].setErrors({
      'required': true
    })

    if (isNaN(errorCheckTypeId)) {
      this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].clearValidators();
      this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].updateValueAndValidity();
    }
    else {
      this.getErrorCheckAlgorithm(errorCheckTypeId);
    }
  }

  cancelDataSubProtocolForm() {
    if (this.dataSubProtocolForm.dirty) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }

  formCancelConfirm() {
    let myTab = document.getElementById('dataProtocol');
    myTab.click();
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  compareIds(id1, id2) {
    if (id1 === id2) {
      return true;
    }
    else {
      return false;
    }
  }

  redirectTo() {

    //this.dataProtocolId = this.dataSubProtocol.dataProtocolId;
    this.globalService.GettingId(this.dataProtocolId);
    if (this.confirmDeleteMessage == 'deleteTag') {
      if (this.dataSubProtocolTagsDataSource) {
        this.dataSubProtocolTagsDataSource.data = [];
      }
      this.getDataSubProtocolTagsByDataSubProtocolId(this.dataSubProtocolTag.dataSubProtocolId);
    } else if (this.confirmDeleteMessage == 'deleteDH') {
      if (this.dataSubProtocolDHDataSource) {
        this.dataSubProtocolDHDataSource.data = [];
      }
      this.getDataSubProtocolDHsByDataSubProtocolId(this.dataSubProtocolDH.dataSubProtocolId);
    } else {
      this.loadFormData();
      // this.globalSharedService.GettingString('communication');
      // this.router.navigate(['../'],{relativeTo:this.route});
    }
    // this.loadFormData();

  }


  setDataProtocolCommData(dataSubProtocol: DataSubProtocol) {
    this.dataSubProtocolTagService.setDataSubProtocol(dataSubProtocol);
    // this.globalSharedService.setGlobalObject(dataSubProtocol);
  }

  setDataSubProtocolDataForDH(dataSubProtocol: DataSubProtocol, id: number, operation: string) {
    this.globalSharedService.GettingId(id);
    this.globalSharedService.GettingString(operation);
    this.dataSubProtocolDHService.setDataSubProtocol(dataSubProtocol);
  }


  /*
  Material table paginator code starts here
*/
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }


  /* Load table data always to the Top of the table
  when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */

    validateStartValidator(event) {
      if (event.checked) {
        if (!this.dataSubProtocolForm.controls['startValidator'].value) {
          this.assignErrorToEStartValidator();
        }
      }
      else {
        this.dataSubProtocolForm.controls['startValidator'].clearValidators();
        this.dataSubProtocolForm.controls['startValidator'].updateValueAndValidity();
      }
    }

    validateEndValidator(event) {
      if (event.checked) {
        if (!this.dataSubProtocolForm.controls['endValidator'].value) {
          this.assignErrorToEndValidator()
        }
      }
      else {
        this.dataSubProtocolForm.controls['endValidator'].clearValidators();
        this.dataSubProtocolForm.controls['endValidator'].updateValueAndValidity();
      }
    }

    validateStartValidatorText(value) {
      if (!value) {
        if (this.dataSubProtocolForm.controls['isStartValidatorCheckEnabled'].value) {
          this.assignErrorToEStartValidator();
        } else {
          this.dataSubProtocolForm.controls['startValidator'].clearValidators();
          this.dataSubProtocolForm.controls['startValidator'].updateValueAndValidity();
        }
      }
    }


    assignErrorToEStartValidator() {
      this.dataSubProtocolForm.controls['startValidator'].setValidators([Validators.required]);
      // this.dataSubProtocolForm.controls['startValidator'].setValue(null);
      this.dataSubProtocolForm.controls['startValidator'].markAsTouched();
      this.dataSubProtocolForm.controls['startValidator'].updateValueAndValidity();
      this.dataSubProtocolForm.controls['startValidator'].setErrors({
        'required': true
      })
    }


    validateEndValidatorText(value) {
      if (!value) {
        if (this.dataSubProtocolForm.controls['isEndValidatorCheckEnabled'].value) {
          this.assignErrorToEndValidator();
        } else {
          this.dataSubProtocolForm.controls['endValidator'].clearValidators();
          this.dataSubProtocolForm.controls['endValidator'].updateValueAndValidity();
        }
      }
    }

    assignErrorToEndValidator() {
      this.dataSubProtocolForm.controls['endValidator'].setValidators([Validators.required]);
      // this.dataSubProtocolForm.controls['startValidator'].setValue(null);
      this.dataSubProtocolForm.controls['endValidator'].markAsTouched();
      this.dataSubProtocolForm.controls['endValidator'].updateValueAndValidity();
      this.dataSubProtocolForm.controls['endValidator'].setErrors({
        'required': true
      })
    }

    validateErrorCheck(event){
      if (event.checked) {
        if (!this.dataSubProtocolForm.controls['errorCheckTypeId'].value) {
          this.assignErrorToErrorCheckType()
        }
      }
      else {
        this.dataSubProtocolForm.controls['errorCheckTypeId'].clearValidators();
        this.dataSubProtocolForm.controls['errorCheckTypeId'].updateValueAndValidity();
      }
    }


    assignErrorToErrorCheckType() {
      this.dataSubProtocolForm.controls['errorCheckTypeId'].setValidators([Validators.required]);
      // this.dataSubProtocolForm.controls['startValidator'].setValue(null);
      this.dataSubProtocolForm.controls['errorCheckTypeId'].markAsTouched();
      this.dataSubProtocolForm.controls['errorCheckTypeId'].updateValueAndValidity();
      this.dataSubProtocolForm.controls['errorCheckTypeId'].setErrors({
        'required': true
      })
    }

    validateErrorCheckType(value) {
      if (!value) {
        if (this.dataSubProtocolForm.controls['isErrorCheckEnabled'].value) {
          this.assignErrorToErrorCheckType();
        } else {
          this.dataSubProtocolForm.controls['errorCheckTypeId'].clearValidators();
          this.dataSubProtocolForm.controls['errorCheckTypeId'].updateValueAndValidity();
        }
      }
    }
    dataHandlerFormatOnChange($event){
      if ($event.value) {
        this.dataSubProtocolForm.controls['dataSubProtocolFormatID'].setValue(Number($event.itemData.id));
      }
    }
    errorCheckTypeOnChange($event){
      if ($event.value) {
        this.errorCheckTypeChange(Number($event.itemData.id));
        this.dataSubProtocolForm.controls['errorCheckTypeId'].setValue(Number($event.itemData.id));
      }else{
        this.errorCheckAlgorithms = [];
        this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].clearValidators();
        this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].updateValueAndValidity();
        this.dataSubProtocolForm.controls['errorCheckTypeId'].setValue(null);
      }
    }
    errorCheckAlgorithmOnChange($event){
      if ($event.value) {
        this.dataSubProtocolForm.controls['errorCheckAlgorithmId'].setValue(Number($event.itemData.id));
      }
    }
}
