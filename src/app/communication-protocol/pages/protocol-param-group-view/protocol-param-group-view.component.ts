import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProtocolParamGroup } from '../../model/protocol-param-group';
import { ProtocolService } from '../../services/protocol.service';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from '../globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
@Component({
  selector: 'app-protocol-param-group-view',
  templateUrl: './protocol-param-group-view.component.html',
  styleUrls: ['./protocol-param-group-view.component.css']
})
export class ProtocolParamGroupViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  NoRecordsFound = false;
  protocolGroupTableView: boolean;
  jsonArray: Array<ProtocolParamGroup> = [];
  paramGroupData: any;
  dataSource: any;
  paramGroupForm: FormGroup;
  paramGroupListView = true;
  protocolName: String = null;
  displayedColumns: string[] = ['sNo', 'name', 'displayOrder', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  protocolParamGroupId: number;
  showLoaderImage = true;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  // pageSettings = pageSettings;
  private protocolParamGroup: ProtocolParamGroup = new ProtocolParamGroup();
  protocolDisplayName: string;
  protocolId: number;
  protocolParamLevel: string;

  constructor(private protocolService: ProtocolService, private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private globalService: globalShareServices, private globalSharedService: globalSharedService) { }

  setParamGroupLevel() {
    this.protocolService.setTabLevel(this.protocolParamLevel);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) ||
        data.displayOrder.toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter);
    };
    this.NoRecordsFound = false;
    this.showLoaderImage = true;
    this.protocolParamTabLevel();
  }

  protocolParamTabLevel() {
    this.getProtocolData();
    if (this.protocolService.tabLevel != null) {
      this.protocolParamLevel = this.protocolService.tabLevel;
      this.getParamGroup(this.protocolId, false);
    }
    else {
      this.getParamGroup(this.protocolId, true);
    }
  }

  // Refresh table
  refreshTableListFunction() {
    this.setParamGroupLevel();
    this.protocolParamTabLevel();
  }

  ngAfterViewInit() { }

  viewParamGroup(id) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('View');
  }

  updateParamGroup(id) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('Edit');
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
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getParamGroup(protocolId: number, onLoad: boolean) {
    this.protocolService.getAllProtocolParamGroupByProtocolId(protocolId)
      .subscribe(
        res => {
          res.forEach(protocolGroup => {
            if (protocolGroup.status === 'A') {
              protocolGroup.status = 'Active'
            }
            else if (protocolGroup.status === 'D') {
              protocolGroup.status = 'In-Active'
            }
          })
          res = res.sort((a, b) => b.id - a.id);
          if (Array.isArray(res) && res.length) {
            this.globalService.listOfRowDetail(res, "ProtocolParamGroup");
            this.paramGroupListView = true;
            this.protocolGroupTableView = true;
            this.paramGroupData = res;
            this.dataSource = new MatTableDataSource();
            if (onLoad) {
              this.getParamGroupByParamLevel("CH");
            } else {
              this.getParamGroupByParamLevel(this.protocolParamLevel);
            }
          }
          else {
            this.NoRecordsFound = true;
            this.protocolGroupTableView = false;
            if (onLoad) {
              this.getParamGroupByParamLevel("CH");
            } else {
              this.getParamGroupByParamLevel(this.protocolParamLevel);
            }
          }
        },
        error => {
          this.showLoaderImage = false;
          this.NoRecordsFound = true;
          this.protocolGroupTableView = false;
          //
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getParamGroupByParamLevel(labelTabId) {
    this.showLoaderImage = true;
    this.jsonArray = [];
    let commProtocolParamLevelForSession = "";
    this.protocolParamLevel = labelTabId;
    this.dataSource = new MatTableDataSource();
    if (this.paramGroupData != "" && this.paramGroupData != undefined) {
      for (let paramGroup of this.paramGroupData) {
        let level = paramGroup.commProtocolParamLevel;
        //
        if (level == "CH" && labelTabId == "CH") {
          this.globalService.setChannelParamName(paramGroup.name);
          this.globalService.channelDisplayOrder(paramGroup.displayOrder);
          this.jsonArray.push(paramGroup);
          commProtocolParamLevelForSession = "Channel";
        } else if (level == "NC" && labelTabId == "NC") {
          this.globalService.setNodeComponentParamName(paramGroup.name);
          this.globalService.nodeComponentDisplayOrder(paramGroup.displayOrder);
          this.jsonArray.push(paramGroup);
          commProtocolParamLevelForSession = "Node Component";
        } else if (level == "NCDH" && labelTabId == "NCDH") {
          this.globalService.setDataHandlerParamName(paramGroup.name);
          this.globalService.nodeDataHandlerDisplayOrder(paramGroup.displayOrder);
          this.jsonArray.push(paramGroup);
          commProtocolParamLevelForSession = "NC Data Model";
        }
      }
    }
    document.getElementById(this.protocolParamLevel).click();
    sessionStorage.setItem('protocolParamLevel', commProtocolParamLevelForSession);
    if (this.jsonArray.length != 0 && this.jsonArray != undefined) {
      this.showLoaderImage = false;
      this.dataSource.data = this.jsonArray;
    }
    else {
      this.showLoaderImage = false;
      this.dataSource.data = this.jsonArray;

    }
    // this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.jsonArray;

    // To get paginator events from child mat-table-paginator to access its properties
    this.myPaginator = this.myPaginatorChildComponent.getDatasource();
    this.matTablePaginator(this.myPaginator);

    this.dataSource.paginator = this.myPaginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() { }

  deleteProtocolParamGroup(id: number) {
    this.protocolParamGroupId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Param Group!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.protocolService.deleteProtocolParamGroup(this.protocolParamGroupId, userId).subscribe(res => {
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
    this.getParamGroup(this.protocolId, false);
  }

  // Dynamic click
  @Output() tabName = new EventEmitter<string>();

  showManageParameter(paramGroupId: number) {
    this.tabName.emit('mngProtocolParam');
    sessionStorage.setItem('paramGroupId', JSON.stringify(paramGroupId));
    this.protocolService.setTabLevel(this.protocolParamLevel);
    let myTab = document.getElementById('mngProtocolParam');
    myTab.click();
  }

  backToProtocol() {
    // this.router.navigate(['protocol'], { relativeTo: this.route });
    let getProtocol = document.getElementById('ManageProtocol');
    getProtocol.click();
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
