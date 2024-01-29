import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { ProtocolService } from '../../services/protocol.service';
import { NgbTab } from '@ng-bootstrap/ng-bootstrap';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from '../globalShareServices';
import { globalSharedService } from 'src/app/shared/globalSharedService';
@Component({
  selector: 'app-protocol-view',
  templateUrl: './protocol-view.component.html',
  styleUrls: ['./protocol-view.component.css']
})
export class ProtocolViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;


  NoRecordsFound = false;
  protocoltableView: boolean;
  dataSource: any;
  showLoaderImage = true;
  displayedColumns: string[] = ['id', 'sNo', 'name', 'description', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  deleteProtocolId: number;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  // pageSettings = pageSettings;
  protocolListView = true;

  constructor(private protocolService: ProtocolService, private router: Router, private changeDetecterRef: ChangeDetectorRef, public tabset: NgbTab, private route: ActivatedRoute,
    private globalService: globalShareServices,
    private globalSharedService: globalSharedService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.showLoaderImage = true;
    this.NoRecordsFound = false;
    this.getProtocol();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter)
        || data.description.toLowerCase().includes(filter)
        || data.status.toLowerCase().includes(filter);
    };
  }

  // Refresh table
  refreshTableListFunction() {
    this.getProtocol();
  }


  ngAfterViewInit() { }

  //Update of protocol
  UpdateProtocol(event: Event, id: number, name: string) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('Edit');
  }

  //view of protocol
  viewProtocol(id) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('View');
  }

  getProtocol() {
    this.protocolService.getProtocolList()
      .subscribe(
        res => {
          this.showLoaderImage = false;
          if (res != null && (Array.isArray(res) && res.length)) {
            res.forEach(protocol => {
              this.globalService.setProtocolCode(protocol.code);
              this.globalService.setProtocolName(protocol.name)
              if (protocol.status === 'A') {
                protocol.status = 'Active'
              }
              else if (protocol.status === 'D') {
                protocol.status = 'In-Active'
              }
              if (!protocol.description) {
                protocol.description = '';
              }
            })
            res = res.sort((a, b) => b.id - a.id);
            this.globalService.listOfRowDetail(res, "Protocol");
            this.protocolListView = true;
            this.protocoltableView = true;
            // this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;

            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);

            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
            this.NoRecordsFound = false;
          }
          else {
            this.NoRecordsFound = true;
            this.protocoltableView = false;
          }
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  deleteProtocol(id: number) {
    this.deleteProtocolId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Protocol!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.protocolService.deleteProtocol(this.deleteProtocolId, userId).subscribe(res => {
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  // redirectTo
  redirectTo() {
    this.dataSource.data = [];
    this.getProtocol();
  }


  @Output() tabName = new EventEmitter<string>();

  showManageParameterGroup(protocolId: number) {
    this.tabName.emit('mngProtocolParamGroup');
    sessionStorage.setItem('protocolId', JSON.stringify(protocolId));
    let myTab = document.getElementById('mngProtocolParamGroup');
    myTab.click();
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
