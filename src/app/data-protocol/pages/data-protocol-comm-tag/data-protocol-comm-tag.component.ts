import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DataProtocolTag } from '../../model/dataProtocolTag';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { DataSubProtocolTag } from '../../model/dataSubProtocolTag';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DataSubProtocolTagService } from '../../services/DataSubProtocolTag/data-sub-protocol-tag.service';
import { DialogService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from 'src/app/communication-protocol/pages/globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-data-protocol-comm-tag',
  templateUrl: './data-protocol-comm-tag.component.html',
  styleUrls: ['./data-protocol-comm-tag.component.css']
})
export class DataProtocolCommTagComponent implements OnInit {
  dataSubProtocolFormatNameValue: string;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty("dataSubProtocolForm")) {
      if (this.dataSubProtocolForm.dirty) {
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
        // returning false will show a confirm dialog before navigating away
      } else {
        return true; // returning true will navigate without confirmation
      }
      return this.dialogService.navigateAwaySelection$;
    } else {
      return true;
    }
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  dataSubProtocol: DataSubProtocol;
  dataProtocolTags: DataProtocolTag[];
  allDataProtocolTags: DataProtocolTag[];
  dataSubProtocolForm: FormGroup;
  dataFormats: any[];
  dataSubProtocolTagFormPreview = false;
  dataSubProtocolFormView = false;
  dataSubProtocolTagsView = false;
  dataSubProtocolChildTagsView = false;
  dataSubProtocolTagForm = true;
  dataSubProtocolTag: DataSubProtocolTag = new DataSubProtocolTag();
  dataSubProtocolTagVIew: DataSubProtocolTag = new DataSubProtocolTag();
  dataSubProtocolDisplayedColumns: string[] = ['id', 'ioTag', 'index', 'length', 'lengthUnit', 'tagKeyName', 'dataFormat', 'parentTag'];
  dataSubProtocolDataSource: any;
  @ViewChild(MatPaginator) paginatorForIOTags: MatPaginator;
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSubProtocolDataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================
  NoRecordsFound: boolean;
  dataSubProtocolTags: DataSubProtocolTag[];
  parentDataProtocolTag:any[]=[];
  dataSubProtocolTagView = false;
  dataSubProtocolChildTagView = false;
  dataSubProtocolChildTagEdit = false;
  allDataSubProtocolTags: DataSubProtocolTag[];
  tagId: number;
  viewIOTag: string;
  alertSuccess = false;
  alertDelete = false;
  saveSuccess = false;
  updateSucess = false;
  serviceMessage: string;
  dataSubProtocolTagAdd = true;
  dataSubProtocolTagEdit = false;
  tableView = false;
  tagLengthUnits: any[];
  successFlag: string;
  warningFlag: string;
  parentTagId: any;
  showLoaderImage : boolean;

  public dataProtocolTagTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public dataSubProtocolTagFields: Object = {
    text: 'name',
    value: 'id'
  };
  public tagLengthUnitFields: Object = {
    text: 'value',
    value: 'id'
  };
  public dataFormatFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  // public onFilteringDataProtocolTag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
  //   this.filterData(e,this.dataProtocolTags);

  // }

  // public onFilteringDataSubProtocolTags: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
  //   this.filterData(e,this.parentDataProtocolTag);
  // }
  public onFilteringTagLengthUnits: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.tagLengthUnits);

  }

  public onFilteringDataFormat: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataFormats);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown:string ='Ascending';
  tagLengthUnit:any;
  dataSubProtocolTagFormatId:any;
  parentDataSubProtocolTagId:any;
  dataProtocolTagId:any;
  // set the placeholder to DropDownList input element
  public dataSubProtocolTagWaterMark: string = 'Select Parenet Tag';
  public dataProtocolTagWaterMark: string = 'Select Tag Name';
  public tagLengthUnitWaterMark: string = 'Select Tag Length Unit';
  public dataFormatsWaterMark: string = 'Select Data Format';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;
  ngOnInit() {
    this.loadFormData();
    if (this.parentTagId) {
      this.getDataSubProtocolTagByIDForVIew(this.parentTagId);
    }
  }

  // Refersh
  refreshTableListFunction() {
    this.loadFormData();
  }

  loadFormData() {
    this.validateTheForm();
    this.NoRecordsFound = false;
    this.dataSubProtocol = this.commService.dataSubProtocol;
    this.tagId = this.globalShareService.assignId;
    this.getDataSubProtocolTagsByDataSubProtocolId(this.dataSubProtocol.id);
    this.viewIOTag = this.globalShareService.name;
    if (this.tagId != null && this.viewIOTag === 'edit') {
      this.dataSubProtocolTagAdd = false;
      this.dataSubProtocolTagEdit = true;
      this.dataSubProtocolChildTagEdit = false;
      this.dataSubProtocolTagForm = true;
      this.dataSubProtocolChildTagView = false;
      this.dataSubProtocolChildTagsView = false;
      this.dataSubProtocolTagView = false;
      this.dataSubProtocolTagFormPreview = false;
      this.dataSubProtocolFormView = false;
      this.dataSubProtocolTagsView = false;
      this.getDataSubProtocolTagById(this.tagId);
      this.validateTheForm();
    }
    if (this.tagId != null && this.viewIOTag === 'view') {
      this.dataSubProtocolTagAdd = false;
      this.dataSubProtocolTagEdit = false;
      this.dataSubProtocolTagAdd = false;
      this.dataSubProtocolChildTagEdit = false;
      this.dataSubProtocolChildTagView = false;
      this.dataSubProtocolTagForm = false;
      this.dataSubProtocolTagView = true;
      this.dataSubProtocolTagFormPreview = false;
      this.dataSubProtocolFormView = false;
      this.dataSubProtocolTagsView = true;
      this.getDataSubProtocolTagByIDForVIew(this.tagId);
    }
    if (this.tagId != null && this.viewIOTag === 'childEdit') {
      this.dataSubProtocolTagAdd = false;
      this.dataSubProtocolTagEdit = true;
      this.dataSubProtocolChildTagEdit = true;
      this.dataSubProtocolChildTagView = false;
      this.dataSubProtocolTagForm = false;
      this.dataSubProtocolChildTagsView = false;
      this.dataSubProtocolTagView = false;
      this.dataSubProtocolTagFormPreview = false;
      this.dataSubProtocolFormView = false;
      this.dataSubProtocolTagsView = false;
      this.getDataSubProtocolTagById(this.tagId);
      this.validateTheForm();
    }
    if (this.tagId != null && this.viewIOTag === 'childView') {
      this.dataSubProtocolTagAdd = false;
      this.dataSubProtocolTagEdit = false;
      this.dataSubProtocolChildTagEdit = false;
      this.dataSubProtocolChildTagView = true;
      this.dataSubProtocolTagForm = false;
      this.dataSubProtocolTagView = false;
      this.dataSubProtocolTagFormPreview = false;
      this.dataSubProtocolFormView = false;
      this.dataSubProtocolTagsView = true;
      this.getDataSubProtocolTagByIDForVIew(this.tagId);
    }
    if (this.tagId != null && this.viewIOTag === undefined) {
      this.dataSubProtocolTagAdd = true;
      this.dataSubProtocolTagEdit = false;
      this.dataSubProtocolChildTagEdit = false;
      this.dataSubProtocolTagForm = true;
      this.dataSubProtocolChildTagView = false;
      this.dataSubProtocolChildTagsView = false;
      this.dataSubProtocolTagView = false;
      this.dataSubProtocolTagFormPreview = false;
      this.dataSubProtocolFormView = false;
      this.dataSubProtocolTagsView = false;
      this.getParentGatewayCommIOTagById(this.tagId);
      this.validateTheForm();
      this.dataSubProtocolForm.get('parentDataSubProtocolTagId').disable();
    }
    if (this.tagId === null || this.tagId === undefined) {
      this.dataSubProtocolTagAdd = true;
      this.dataSubProtocolTagsView = false;
      this.dataSubProtocolTagEdit = false;
      this.validateTheForm();

      this.dataSubProtocolForm.get('parentDataSubProtocolTagId').enable();
    }


    this.getDataFormats();
    this.getTagLengthUnits();
  }

  constructor(private commService: DataSubProtocolTagService, private globalShareService: globalShareServices, private router: Router, private formBuilder: FormBuilder, private service: DataSubProtocolTagService,
    private globalService: globalSharedService, private dialogService: DialogService,
    private route: ActivatedRoute) {

  }

  patchCommProtocolData() {
    this.dataSubProtocolForm.patchValue({
      templateName: this.dataSubProtocol.dataProtocol.name,
      communication: this.dataSubProtocol.commProtocol.name,
      dataHandlerFormat:  this.commService.dataSubProtocol.dataSubProtocolFormat.name,
      seperator: this.dataSubProtocol.dataProtocolTagSeparator
    })
  }


  validateTheForm() {
    this.dataSubProtocolForm = this.formBuilder.group({
      id: [null],
      templateName: [null],
      communication: [null],
      dataHandlerFormat: [null],
      seperator: [null],
      dataProtocolTagId: [null, Validators.required],
      //parentIOTagId: [null],
      tagIndex: [null, [Validators.pattern("[0-9]*")]],
      tagLength: [null, [Validators.pattern("[0-9]*")]],
      tagLengthUnit: [null],
      tagKeyName: [null],
      dataSubProtocolTagFormatId: [null],
      parentDataSubProtocolTagId: [null],
      hasChildTags: [null],
      dataProtocolTagSeparator: [null],
      status: ['Active']
    })
  }

  getDataSubProtocolTagsByDataSubProtocolId(dataSubProtrocolId) {
    this.service.getDataSubProtocolTagsByDataSubProtocolId(dataSubProtrocolId).subscribe(data => {
      this.patchCommProtocolData();
      this.dataSubProtocolTags = data;
      this.dataSubProtocolTags.forEach(dataprotocolTag => {
        dataprotocolTag.tagName=dataprotocolTag.dataProtocolTag.name;
      });
      this.allDataSubProtocolTags = data;
      this.getDataProtocolTagsByDataProtocolId();
      this.dataSubProtocolTags = this.dataSubProtocolTags.sort((a, b) => a.tagName.localeCompare(b.tagName))
      //this.setgatewayCommIOTagsDataSource(data);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  getDataProtocolTagsByDataProtocolId() {
    this.service.getDataProtocolTagsByDataProtocolId(this.dataSubProtocol.dataProtocol.id).subscribe(data => {
      this.dataProtocolTags = data.filter(dataProtocolTag => dataProtocolTag.tagIOMode === "I");
      this.allDataProtocolTags = data;
      this.removeTheItemsFromIOTagArray();

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  removeTheItemsFromIOTagArray() {
    if (null != this.dataSubProtocolTags) {
      let ids = this.dataSubProtocolTags.map(item => item.dataProtocolTagId);
      let filteredData = this.dataProtocolTags.filter(item => ids.indexOf(item.id) === -1);
      this.dataProtocolTags = filteredData;
      this.dataProtocolTags = this.dataProtocolTags.sort((a, b) => a.name.localeCompare(b.name))
    }

  }

  getDataFormats() {
    this.service.getDataFormats().subscribe(data => {
      this.dataFormats = data;
      this.dataFormats= this.globalShareService.addSelectIntoList(this.dataFormats);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  setgatewayCommIOTagsDataSource(dataSubProtocolTags: any[]) {

    if (Array.isArray(dataSubProtocolTags) && dataSubProtocolTags.length) {
      dataSubProtocolTags.forEach(subProtocolTag => {
        this.tagLengthUnits.forEach(tagLength => {
          if (tagLength.id == subProtocolTag.tagLengthUnit) {
            subProtocolTag.tagLengthUnitValue = tagLength.value;
          }
          subProtocolTag.dataProtocolName = subProtocolTag.dataProtocolTag.name;
        })
        this.dataFormats.forEach(formate => {
          if (formate.id == subProtocolTag.dataSubProtocolTagFormatId) {
            subProtocolTag.dataFormateName = formate.name;
          }
        })
        this.allDataSubProtocolTags.forEach(allData => {
          if (allData.id == subProtocolTag.parentDataSubProtocolTagId) {
            subProtocolTag.paretTagName = allData.dataProtocolTag.name;
          }
        })
      })
      dataSubProtocolTags.sort((a, b) => b.id - a.id);
      this.dataSubProtocolDataSource = new MatTableDataSource();
      this.dataSubProtocolDataSource.filterPredicate = function (data, filter: string): boolean {
        return data.dataProtocolName.toLowerCase().includes(filter)
          || data.tagIndex.toLowerCase().includes(filter)
          || data.tagLength.toLowerCase().includes(filter)
          || data.tagLengthUnitValue.toLowerCase().includes(filter)
          || data.tagKeyName.toLowerCase().includes(filter)
          || data.dataFormateName.toLowerCase().includes(filter)
          || data.paretTagName.toLowerCase().includes(filter);
      };
      this.dataSubProtocolDataSource.data = dataSubProtocolTags;

      // To get paginator events from child mat-table-paginator to access its properties
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);

      this.dataSubProtocolDataSource.paginator = this.myPaginator;
      this.dataSubProtocolDataSource.sort = this.sort;
      this.tableView = true;
      this.NoRecordsFound = false;
    }
    else {
      this.dataSubProtocolDataSource = null;
      this.NoRecordsFound = true;
      this.tableView = false;
    }
  }
  createIOTag() {
      this.dataSubProtocolTagFormPreview = true;
      this.dataSubProtocolFormView = false;
      this.dataSubProtocolTagForm = false;
      this.dataSubProtocolChildTagsView = false;
      this.dataSubProtocolTagView = false;
      this.dataSubProtocolTagAdd = false;
      this.dataSubProtocolTagEdit = false;
      this.dataSubProtocolTag = <DataSubProtocolTag>this.dataSubProtocolForm.value;
      this.dataSubProtocolFormatNameValue = this.commService.dataSubProtocol.dataSubProtocolFormat.name;
  }

  saveCommIOTagInfo() {
    this.showLoaderImage = true;
    this.dataSubProtocolTag = <DataSubProtocolTag>this.dataSubProtocolForm.value;
    let userId = sessionStorage.getItem('userId');
    this.dataSubProtocolTag.dataSubProtocolId = this.dataSubProtocol.id;
    if (this.dataSubProtocolTag.id === null || this.dataSubProtocolTag.id === this.dataSubProtocolTag.parentDataSubProtocolTagId) {
      this.dataSubProtocolTag.id = null;
      this.dataSubProtocolTag.createdBy = parseInt(userId);
      if (this.tagId != null) {
        this.dataSubProtocolTag.parentDataSubProtocolTagId = this.tagId;
      }
      this.service.saveDataSubProtocolTag(this.dataSubProtocolTag).subscribe(res => {
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);

      }, error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
    } else {
      this.dataSubProtocolTag.updatedBy = parseInt(userId);
      this.service.updateDataSubProtocolTag(this.dataSubProtocolTag).subscribe(res => {
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      }, error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
    }
  }

  // Create dataSubProtocol
  createDataSubProtocol() {
    this.dataSubProtocolTagFormPreview = false;
    this.dataSubProtocolFormView = false;
    this.dataSubProtocolTagForm = true;
    this.dataSubProtocolChildTagsView = true;
    this.dataSubProtocolTagView = false;
    this.dataSubProtocolForm.reset();
    this.saveSuccess = true;
    this.updateSucess = false;
    this.closeSavePopup();
  }


  getParentGatewayCommIOTagById(id) {
    this.service.getDataSubProtocolTagById(id).subscribe(data => {
      //this.setgatewayCommIOTagsDataSource(data.gatewayCommProtocolIOTags);
      this.dataSubProtocolTag = data;
      this.dataSubProtocolForm.patchValue({
        //id: data.id,
        parentDataSubProtocolTagId: this.dataSubProtocolTag.id
        //dataProtocolTagId: data.dataProtocolTagId
      });

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )

  }

  getDataSubProtocolTagById(id) {
    this.service.getDataSubProtocolTagById(id).subscribe(data => {
      this.dataSubProtocol = data.dataSubProtocol;
      this.dataSubProtocolTag = data;
      this.dataSubProtocolTagVIew = data;
      this.service.getDataProtocolTagsByDataProtocolId(this.dataSubProtocol.dataProtocol.id).subscribe(data => {
        this.dataProtocolTags = data
        this.dataSubProtocolTags.forEach(commIOTag => {
          this.dataProtocolTags = this.dataProtocolTags.filter(ioTag => ioTag.id !== commIOTag.dataProtocolTagId)
        })
        this.dataProtocolTags.push(this.dataSubProtocolTag.dataProtocolTag)
        //this.dataProtocolTags = data;
        this.dataProtocolTags = this.dataProtocolTags.sort((a, b) => a.name.localeCompare(b.name));
        this.dataSubProtocolTags = this.dataSubProtocolTags.filter(commIOTag => commIOTag.id !== this.dataSubProtocolTag.id);
        this.dataSubProtocolTags = this.dataSubProtocolTags.sort((a, b) => a.dataProtocolTag.name.localeCompare(b.dataProtocolTag.name))
        this.removeChildCommIOTagsFromParent(this.dataSubProtocolTags, this.dataSubProtocolTag);

      }, (error: any) => {

      })

      this.dataSubProtocolForm.patchValue({
        id: this.dataSubProtocolTagVIew.id,
        parentDataSubProtocolTagId: this.dataSubProtocolTagVIew.parentDataSubProtocolTagId,
        tagIndex: this.dataSubProtocolTagVIew.tagIndex,
        tagLength: this.dataSubProtocolTagVIew.tagLength,
        tagLengthUnit: this.dataSubProtocolTagVIew.tagLengthUnit,
        tagKeyName: this.dataSubProtocolTagVIew.tagKeyName,
        dataSubProtocolTagFormatId: this.dataSubProtocolTagVIew.dataSubProtocolTagFormatId,
        dataProtocolTagSeparator: this.dataSubProtocolTagVIew.dataProtocolTagSeparator,
        status: this.dataSubProtocolTagVIew.status,
        dataProtocolTagId: this.dataSubProtocolTagVIew.dataProtocolTagId
      });
      this.setgatewayCommIOTagsDataSource(data.dataSubProtocolTags);

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  removeChildCommIOTagsFromParent(commIOTags: DataSubProtocolTag[], commIOTag: DataSubProtocolTag) {
    if (commIOTags != null && commIOTags.length != 0) {
      commIOTags.forEach(ioTag => {
        if (ioTag.parentDataSubProtocolTagId === commIOTag.id) {
          let tempTag = ioTag;
          this.dataSubProtocolTags = commIOTags.filter(tag => tag.parentDataSubProtocolTagId != commIOTag.id);
          this.removeChildCommIOTagsFromParent(this.dataSubProtocolTags, tempTag);
        }
      })
    }
  }

  // back Button
  backButton(elementId) {
    if (this.tagId != null) {
      this.dataSubProtocolTag = this.dataSubProtocolTagVIew;
      this.dataSubProtocolChildTagsView = true;
      this.dataSubProtocolTagView = false;
      this.dataSubProtocolTagFormPreview = false;
      this.dataSubProtocolFormView = false;
    }
    this.dataSubProtocolTagForm = true;
    this.dataSubProtocolTagFormPreview = false;

    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  resetCommIOTagForm() {
    if (this.dataSubProtocolForm.dirty) {
      this.warningFlag = "resetcommIOTagForm";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }

  // Form reset  confirm CommIOTagForm
  formResetConfirmCommIOTagForm() {
    this.dataSubProtocolTag = <DataSubProtocolTag>this.dataSubProtocolForm.value;
    if (this.dataSubProtocolTag.id == null) {
      this.validateTheForm();
    } else {
      this.validateTheForm();
      this.getDataSubProtocolTagById(this.dataSubProtocolTag.id);
    }
  }


  alertRedirection() {
    if (this.warningFlag == "resetcommIOTagForm") {
      this.formResetConfirmCommIOTagForm();
    } else if (this.warningFlag == "cancelDataSubProtocolTagForm") {
      this.formCancelConfirmDataSubProtocolTagForm();
    } else if (this.warningFlag == 'cancelGatewayCommIOTagChildForm') {
      this.formCancelConfirmGatewayCommIOTagChildForm();
    }
    this.warningFlag = "";
  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  cancelDataSubProtocolTagForm() {
  //  this.parentTagId = parentTagId;
    if (this.hasOwnProperty("dataSubProtocolForm")) {
      if (this.dataSubProtocolForm.dirty) {
        this.warningFlag = "cancelDataSubProtocolTagForm";
        this.globalShareService.setGlobalId(this.dataSubProtocol.dataProtocol.id);
        this.globalShareService.setGlobalName('communication');
        this.router.navigate(['../'], { relativeTo: this.route });
        // this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
      } else {
        this.formCancelConfirmDataSubProtocolTagForm();
      }
    } else if (null != this.parentTagId) {
      this.getDataSubProtocolTagByIDForVIew(this.parentTagId);
      this.dataSubProtocolChildTagView = true;
      this.dataSubProtocolTagView = false;
      this.dataSubProtocolChildTagsView = true;
    } else {
      this.globalShareService.GettingId(this.dataSubProtocol.dataProtocol.id);
      this.globalShareService.GettingString('communication');
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  // Confirm redirect to
  formCancelConfirmDataSubProtocolTagForm() {
    if (this.parentTagId === null || this.parentTagId === undefined) {
      //this.dataSubProtocolForm.reset();
      this.globalShareService.setGlobalId(this.dataSubProtocol.dataProtocol.id);
      this.globalShareService.setGlobalName('communication');
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.globalShareService.setGlobalId(this.parentTagId);
      this.globalShareService.setGlobalName('edit');
      this.loadFormData();
    }
  }

  getCommIOTagDataForView() {
    this.dataSubProtocolTagView = true;
  }

  getDataSubProtocolTagByIDForVIew(id) {
    this.service.getDataSubProtocolTagById(id).subscribe(data => {
      let dataFormatsMAp=new Map();
      if(this.dataFormats && this.dataFormats.length){
        this.dataFormats.forEach(format =>{
          dataFormatsMAp.set(format.id,format);
        })
      }
      if(data.dataSubProtocolTagFormatId !=null){
        data.dataSubProtocolTagFormat=dataFormatsMAp.get(data.dataSubProtocolTagFormatId)
      }
      this.dataSubProtocolTagVIew = data;
      this.setgatewayCommIOTagsDataSource(data.dataSubProtocolTags);
      this.dataSubProtocolChildTagsView = true;
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  cancelGatewayCommIOTagView() {
    this.globalShareService.GettingId(this.dataSubProtocol.dataProtocol.id);
    this.globalShareService.GettingString('communication');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  viewParentGatewayIOTag(id: number, msg: string) {
    this.commService.dataSubProtocol = this.dataSubProtocol
    this.globalShareService.GettingId(id);
    this.globalShareService.GettingString(msg);
    this.loadFormData();
  }

  viewChildIOTag(id: number, msg: string) {
    this.commService.dataSubProtocol = this.dataSubProtocol
    this.globalShareService.GettingId(id);
    this.globalShareService.GettingString(msg);
    this.loadFormData();
  }

  cancelGatewayCommIOTagChildForm(parentTagId) {
    this.parentTagId = parentTagId;
    if (this.dataSubProtocolForm.dirty) {
      this.warningFlag = "cancelGatewayCommIOTagChildForm";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirmGatewayCommIOTagChildForm();
    }
  }

  // Confirm redirect to CancelConfirmGatewayCommIOTagChildForm
  formCancelConfirmGatewayCommIOTagChildForm() {
    this.globalShareService.setGlobalId(this.parentTagId);
    this.globalShareService.setGlobalName('edit');
    this.loadFormData();
  }

  deleteChildIOTag(dataSubProtocolTag: DataSubProtocolTag) {
    this.dataSubProtocolTagVIew = dataSubProtocolTag;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Fail, 'You will not be able to recover this Gateway Comm IO Tag!');
  }

  ConfirmDeleteCommIOTag() {
    //this.dataSubProtocolTagVIew.status
    let userId = sessionStorage.getItem('userId');
    this.dataSubProtocolTagVIew.updatedBy = parseInt(userId);
    this.dataSubProtocolTagVIew.dataSubProtocolId = this.dataSubProtocolTagVIew.dataSubProtocol.id
    this.dataSubProtocolTagVIew.dataProtocolTagId = this.dataSubProtocolTagVIew.dataProtocolTag.id;
    this.service.deleteGatewayCommIOTag(this.dataSubProtocolTagVIew.id, parseInt(userId)).subscribe(res => {
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, (error) => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })

  }

  // Delete confirm
  confirmDelete() {
    this.commService.setDataSubProtocol(this.dataSubProtocol);
    this.globalShareService.GettingId(this.tagId);
    this.globalShareService.GettingString(this.viewIOTag);
    this.loadFormData();
  }

  // cancelDelete() {
  //   $(".bd-example-modal-sm").modal('hide');
  // }


  closeSavePopup() {
    this.globalShareService.GettingId(this.dataSubProtocol.dataProtocol.id);
    this.globalShareService.GettingString('communication');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getTagLengthUnits() {
    this.service.getTagLengthUnits().subscribe(data => {
      this.tagLengthUnits = data;
      if (this.tagLengthUnits) {
        let Obj = {
          "value": "--Select--",
          "id":0
        }
        this.tagLengthUnits.push(Obj);
      }
    })
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
    dataFormatsOnChange($event){
      if ($event.value) {
        this.dataSubProtocolForm.controls['dataSubProtocolTagFormatId'].setValue($event.itemData.id);
      }else{
        this.dataSubProtocolForm.controls['dataSubProtocolTagFormatId'].setValue(null);
      }
    }
    tagLengthUnitsOnChange($event){
      if ($event.value) {
        this.dataSubProtocolForm.controls['tagLengthUnit'].setValue($event.itemData.id);
      }else{
        this.dataSubProtocolForm.controls['tagLengthUnit'].setValue(null);
      }
    }
}
