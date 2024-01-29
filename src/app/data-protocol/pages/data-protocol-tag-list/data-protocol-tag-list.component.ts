import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataProtocolTagService } from '../../services/DataProtocolTag/data-protocol-tag.service';
import { DataProtocolTag } from '../../model/dataProtocolTag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { CommonUnitService } from 'src/app/communication-protocol/pages/common-unit.service';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-data-protocol-tag-list',
  templateUrl: './data-protocol-tag-list.component.html',
  styleUrls: ['./data-protocol-tag-list.component.css']
})
export class DataProtocolTagListComponent implements OnInit {
  constructor(private globalService: globalSharedService, private dataProtocolTagService: DataProtocolTagService, private commonUnitService: CommonUnitService, private formBuilder: FormBuilder, private router: Router) { }
  dataProtocolId: number;
  dataProtocolTags: DataProtocolTag[];
  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'tagType', 'dataType', 'ioMode', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sort: any;
  dataTypes: any[];
  dataProtocolTagListView = true;
  dataProtocolTagViewMode = false;
  dataProtocolTag: DataProtocolTag;
  standardIOTags: any[];
  dataProtocolTagId: number;
  showLoaderImage = true;
  dataProtocolIOTagForm: FormGroup;

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) ||
        data.tagType.toLowerCase().includes(filter) ||
        data.dataTypeName.toLowerCase().includes(filter) ||
        data.tagIOMode.toLowerCase().includes(filter);
    };
    this.dataProtocolIOTagForm = this.formBuilder.group({
      dataProtocolName: [''],
    })
    this.dataProtocolIOTagForm.patchValue({
      dataProtocolName: this.globalService.parentName
    })
    this.loadFormData();
  }


  loadFormData() {
    this.showLoaderImage = true;
    this.getDataTypes();
    this.dataProtocolId = this.globalService.globalId;
    this.getDataProtocolTagsByDataProtocolId(this.dataProtocolId);
    this.getStandardIOTag();
  }

  getDataProtocolTagsByDataProtocolId(dataProtocolId: number) {
    this.dataProtocolTagListView = true;
    this.dataProtocolTagViewMode = false;
    this.dataProtocolTagService.getDataProtocolTagsByDataProtocolId(dataProtocolId).subscribe(data => {
      this.showLoaderImage = false;
      this.dataProtocolTags = data;
      if (null !== this.dataProtocolTags && this.dataProtocolTags.length != 0) {
        this.dataProtocolTags = this.dataProtocolTags.sort((tag1, tag2) => tag2.id - tag1.id);
        this.dataProtocolTags.forEach(tag => {
          if (this.dataTypes) {
            for (let dataType of this.dataTypes) {
              if (dataType.id == tag.dataTypeId) {
                tag.dataTypeName = dataType.name;
                break;
              }
            }
          }
          if (tag.tagIOMode == 'I') {
            tag.tagIOMode = 'Input'
          } else {
            tag.tagIOMode = 'Output'
          }
          if (tag.tagType == 'A') {
            tag.tagType = 'Analog'
          } else {
            tag.tagType = 'Discrete'
          }
        })
        // this.dataSource = new MatTableDataSource();
        this.dataSource.data = this.dataProtocolTags;

        // To get paginator events from child mat-table-paginator to access its properties
        this.myPaginator = this.myPaginatorChildComponent.getDatasource();
        this.matTablePaginator(this.myPaginator);

        this.dataSource.paginator = this.myPaginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = [];
      }

    }, error => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
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

  getDataTypesNameById(id) {
    for (let i = 0; i < this.dataTypes.length; i++) {
      if (id == this.dataTypes[i]['id']) {
        return this.dataTypes[i]['name'];
      }
    }
  }

  getStandardIOTag(): void {
    this.commonUnitService.getStandardIOTags()
      .subscribe(
        res => {
          this.standardIOTags = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  backToDataProtocol() {
    let myTab = document.getElementById('dataProtocol');
    myTab.click();
  }

  addDataProtocolTag() {
    this.globalService.addTag = true;
    this.globalService.editTag = false;
    this.globalService.setGlobalId(this.dataProtocolId);
  }

  updateDataProtocolTag(id: number) {
    this.globalService.addTag = false;
    this.globalService.editTag = true;
    this.globalService.setId(id);
    this.globalService.GettingString('Edit');
    this.globalService.setGlobalId(this.dataProtocolId);
  }

  refreshTableListFunction() {
    this.getDataProtocolTagsByDataProtocolId(this.dataProtocolId);
  }

  viewDataProtocolTag(id) {
    this.getDataProtocolTagById(id);
    this.dataProtocolTagListView = false;
    this.dataProtocolTagViewMode = true;
  }

  getDataProtocolTagById(id) {
    this.dataProtocolTagService.getDataProtocolTagById(id).subscribe(data => {
      this.dataProtocolTag = data;
      if (this.dataProtocolTag.tagType == 'A') {
        this.dataProtocolTag.tagType = 'ANALOG'
      } else {
        this.dataProtocolTag.tagType = 'DISCRETE'
      }
      if (this.dataProtocolTag.tagIOMode == 'I') {
        this.dataProtocolTag.tagIOMode = 'Input'
      } else {
        this.dataProtocolTag.tagIOMode = 'Output'
      }
    })
  }

  parseInt(id) {
    return parseInt(id);
  }
  cancelDPTagView() {
    this.dataProtocolTagListView = true;
    this.dataProtocolTagViewMode = false;
  }

  deleteDataProtocolTag(id: number) {
    this.dataProtocolTagId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Data Protocol Tag!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.dataProtocolTagService.deletDtataProtocolTag(this.dataProtocolTagId, Number(userId)).subscribe(res => {
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  redirectTo() {
    //  this.dataSource = [];
    this.globalService.GettingId(this.dataProtocolId)
    this.loadFormData()
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

}
