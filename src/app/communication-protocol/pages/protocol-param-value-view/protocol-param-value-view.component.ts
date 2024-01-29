import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolService } from '../../services/protocol.service';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from '../globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
@Component({
  selector: 'app-protocol-param-value-view',
  templateUrl: './protocol-param-value-view.component.html',
  styleUrls: ['./protocol-param-value-view.component.css']
})
export class ProtocolParamValueViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  NoRecordsFound = false;
  protocolParamViewTableView: boolean = false;
  dataSource: any;
  displayedColumns: string[] = ['id', 'sNo', 'value', 'refCommProtocolParamVaule', 'isDefaultValue', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  ParamValueId: number;
  showLoaderImage: boolean = true;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================


  // Current tab
  @Output() tabName = new EventEmitter<string>();

  // pageSettings = pageSettings;
  allProtocolParamValues: any;
  refProtocolParamValues: any = [];
  protocolName: string;
  protocolGroupName: string;
  protocolParamId: number;
  protocolParamDisplayName: string;
  protocolParamLevel: any;
  protocolParamValueId: number;
  refCommProtocolParamId: number;
  protocolGroupTabLevel: string;
  protocolParamValueView: boolean = true;

  constructor(private protocolService: ProtocolService, private route: ActivatedRoute, private router: Router, private globalService: globalShareServices,
    private globalSharedService: globalSharedService) {
    this.getProtocolParamData();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.value.toLowerCase().includes(filter) ||
        data.refCommProtocolParamValueName.toLowerCase().includes(filter) ||
        data.isDefalutValueString.toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.getProtocolParamGroup();
    this.protocolGroupTabLevel = this.protocolService.tabLevel;
  }

  getProtocolParamGroup() {
    this.protocolParamId = JSON.parse(sessionStorage.getItem('protocolParamId'));
    this.getProtocolParamValue(this.protocolParamId);
  }


  // Refresh table
  refreshTableListFunction() {
    this.getProtocolParamGroup();
  }

  getProtocolParamValue(protocolParamId: number) {
    this.protocolService.getProtocolParamValueWithRefValueByProtocolParamId(protocolParamId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          res.forEach(protocolParamValue => {
            this.globalService.setProtocolParamValue(protocolParamValue.value);
            if (protocolParamValue.status === 'A') {
              protocolParamValue.status = 'Active'
            }
            else if (protocolParamValue.status === 'D') {
              protocolParamValue.status = 'In-Active'
            }
            if (protocolParamValue.isDefaultValue) {
              protocolParamValue.isDefalutValueString = 'Yes'
            } else {
              protocolParamValue.isDefalutValueString = 'No'
            }
            if (!protocolParamValue.refCommProtocolParamValueId) {
              protocolParamValue.refCommProtocolParamValueName = '';
            } else {
              this.refProtocolParamValues.forEach(element => {
                if (element.id === protocolParamValue.refCommProtocolParamValueId) {
                  protocolParamValue.refCommProtocolParamValueName = element.name;
                }
              });
            }
          })
          let isDefaultValues = res.filter(protocolParamValue => {
            if (protocolParamValue.isDefaultValue === true) {
              return protocolParamValue;
            }
          })
          if (isDefaultValues.length != 0) {
            this.globalService.setIsDefaultProtocolParamValueData(true);
          }
          else {
            this.globalService.setIsDefaultProtocolParamValueData(false);
          }
          res = res.sort((a, b) => b.id - a.id);
          if (Array.isArray(res) && res.length) {
            this.protocolParamValueView = true;
            this.protocolParamViewTableView = true;
            // this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;
            this.allProtocolParamValues = res;

            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);

            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
          }
          else {
            this.NoRecordsFound = true;
            this.protocolParamViewTableView = false;
          }
        },
        error => {
          this.showLoaderImage = false;
          this.NoRecordsFound = true;
          this.protocolParamViewTableView = false;
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  deleteParamValue(id: number) {
    this.ParamValueId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Protocol Parameter Value!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.protocolService.deleteProtocolParamValue(this.ParamValueId, userId).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  // redirectTo
  redirectTo() {
    this.dataSource.data = [];
    this.getProtocolParamValue(this.protocolParamId);
  }

  getProtocolParamData() {
    this.protocolParamId = JSON.parse(sessionStorage.getItem('protocolParamId'));
    this.protocolName = sessionStorage.getItem('protocolName');
    this.protocolGroupName = sessionStorage.getItem('protocolParamGroupName');
    this.protocolParamLevel = sessionStorage.getItem('protocolParamLevel');
    this.protocolService.getProtocolParamByProtocolParamId(this.protocolParamId)
      .subscribe(
        res => {
          this.protocolParamDisplayName = res.name;
          sessionStorage.setItem('protocolParamName', res.name);
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  backToProtocolParam() {
    this.globalService.GettingId(this.protocolParamId);
    this.globalService.GettingString('mngProtocolParam');
    this.tabName.emit('mngProtocolParam');
    let getProtocol = document.getElementById('mngProtocolParam');
    getProtocol.click();

  }

  UpdateParamValue(event: Event, id: number, name: string) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('Edit');
    this.protocolService.setTabLevel(this.protocolGroupTabLevel);
  }

  viewProtocolParamValue(id) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('View');
    this.protocolService.setTabLevel(this.protocolGroupTabLevel);
  }

  parseInt(id) {
    return parseInt(id);
  }
  getRefProtocolParamValues() {
    this.protocolService.getProtocolParamByProtocolParamId(this.protocolParamId)
      .subscribe(
        res => {
          this.refCommProtocolParamId = res.refCommProtocolParamId;
          //this.dataType = res.dataTypeName

          if (this.refCommProtocolParamId != null || this.refCommProtocolParamId != undefined) {
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
