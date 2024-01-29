import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { ProtocolService } from '../../services/protocol.service';
import { CommonUnitService } from '../common-unit.service';
import { globalShareServices } from '../globalShareServices';
@Component({
  selector: 'app-protocol-param-view',
  templateUrl: './protocol-param-view.component.html',
  styleUrls: ['./protocol-param-view.component.css']
})
export class ProtocolParamViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;


  NoRecordsFound: boolean;
  protocolParamTableView: boolean;
  protocolParamView = true;
  dataSource: any;
  displayedColumns: string[] = ['id', 'sNo', 'name', 'description', 'dataTypeId', 'engUnitId', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  ProtocolParamId: number;
  dataTypes: any[];
  enggUnits: any[];
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  // pageSettings = pageSettings;
  paramGroupId: number;
  protocolParamGroupDisplayName: string;
  protocolName: any;
  protocolId: number;
  protocolParamGroupId: number;
  protocolParamLevel: any;
  paramGroupTabLevel: string;
  showLoaderImage = true;
  constructor(private protocolService: ProtocolService,
    private route: ActivatedRoute, private router: Router, private globalService: globalShareServices,
    private globalSharedService: globalSharedService, private commonUnitService: CommonUnitService,) { }

  ngOnInit() {
    this.getDataTypes();
    this.getEnggUnits();
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) ||
        data.description.toLowerCase().includes(filter) ||
        data.dataTypeName.toLowerCase().includes(filter) ||
        data.engUnitName.toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.NoRecordsFound = false;
    this.getProtocolParamGorupAndData();
    this.paramGroupTabLevel = this.protocolService.tabLevel;
  }

  getProtocolParamGorupAndData() {
    this.protocolParamGroupId = JSON.parse(sessionStorage.getItem('paramGroupId'));
    this.getProtocolParam(this.protocolParamGroupId);
    this.getProtocolGroupData();
  }

  // Refresh table
  refreshTableListFunction() {
    this.getProtocolParamGorupAndData();
  }

  viewProtocolParam(id) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('View');
  }

  getProtocolParam(protocolParamGroupId: number) {
    this.protocolService.getAllProtocolParamByProtocolParamGroupId(protocolParamGroupId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          res.forEach(protocolParam => {
            this.globalService.protocolParamValues.clear();
            this.globalService.setProtocolParamName(protocolParam.name);
            this.globalService.protocolParamDisplayOrder(protocolParam.displayOrder);
            if (protocolParam.status === 'A') {
              protocolParam.status = 'Active'
            }
            else if (protocolParam.status === 'D') {
              protocolParam.status = 'In-Active'
            }
            if (!protocolParam.description) {
              protocolParam.description = '';
            }
            if (!protocolParam) {
              protocolParam.dataTypeName = '';
            } else {
              if (this.dataTypes) {
                this.dataTypes.forEach(element => {
                  if (protocolParam.dataTypeId === element.id) {
                    protocolParam.dataTypeName = element.name;
                  }
                });
              }
            }
            if (!protocolParam.engUnitId) {
              protocolParam.engUnitName = '';
            } else {
              if (this.enggUnits) {
                this.enggUnits.forEach(element => {
                  if (protocolParam.engUnitId === element.id) {
                    protocolParam.engUnitName = element.name;
                  }
                })
              }
            }
          })
          res = res.sort((a, b) => b.id - a.id);
          if (Array.isArray(res) && res.length) {
            this.protocolParamView = true;
            this.protocolParamTableView = true;
            //this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;

            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);

            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
          }
          else {
            this.NoRecordsFound = true;
            this.protocolParamTableView = false;
          }
        },
        error => {
          this.showLoaderImage = false;
          this.NoRecordsFound = true;
          this.protocolParamTableView = false;
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  deleteProtocolParam(id: number) {
    this.ProtocolParamId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.swalDanger(this.globalSharedService.messageType_Error, 'You will not be able to recover this Protocol Param!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.protocolService.deleteProtocolParam(this.ProtocolParamId, userId).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  // redirect to
  redirectTo() {
    this.dataSource.data = [];
    this.getProtocolParam(this.paramGroupId);
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
          sessionStorage.setItem('protocolParamGroupName', res.name);
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  // Current tab
  @Output() tabName = new EventEmitter<string>();

  manageProtocolParamValue(protocolParamId: number) {
    sessionStorage.setItem('protocolParamId', JSON.stringify(protocolParamId));
    this.protocolService.setTabLevel(this.paramGroupTabLevel);
    this.tabName.emit('mngprotocolParamValueView');
    let myTab = document.getElementById('mngprotocolParamValueView');
    myTab.click();
  }

  backToProtocolGroup() {
    this.protocolService.setTabLevel(this.paramGroupTabLevel);
    let getParamGroup = document.getElementById('mngProtocolParamGroup');
    getParamGroup.click();
  }

  UpdateParam(id: number) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('Edit');
  }

  backToCommProtocolGroup() {

    this.globalService.GettingId(this.protocolParamGroupId);
    this.globalService.GettingString('mngProtocolParamGroup');
    this.protocolService.setTabLevel(this.paramGroupTabLevel);
    this.tabName.emit('mngProtocolParamGroup');

    let getProtocol = document.getElementById('mngProtocolParamGroup');
    getProtocol.click();
  }

  getDataTypes(): void {
    this.commonUnitService.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
        },
        error => {
          //
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getEnggUnits(): void {
    this.commonUnitService.getEnggUnits()
      .subscribe(
        res => {
          this.enggUnits = res as any[];
        },
        error => {
          //
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
