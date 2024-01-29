import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataProtocolService } from '../../services/DataProtocol/data-protocol.service';
import { MatTableDataSource } from '@angular/material/table';
import { DataProtocol } from '../../model/dataProtocol';
import { DataSubProtocol } from '../../model/dataSubProtocol';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalSharedService } from 'src/app/shared/globalSharedService';

@Component({
  selector: 'app-data-protocol-list',
  templateUrl: './data-protocol-list.component.html',
  styleUrls: ['./data-protocol-list.component.css']
})
export class DataProtocolListComponent implements OnInit {
 // Importing child component to
 @ViewChild(UIModalNotificationPage) modelNotification;
 @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
 @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

 NoRecordsFound = false;
 dataSource: any;
 displayedColumns: string[] = ['sNo', 'name', 'publilcAccess', 'communicationProtocol', 'action'];
 dataProtocols: DataProtocol[];

 @ViewChild(MatPaginator) paginator: MatPaginator;
 sort: any;
 dataProtocolTableView: boolean;
 dataProtocolId: number;
 showLoaderImage = true;
 businessEntityId: string;
 commProtocolMap = new Map();
 @ViewChild(MatSort) set content(content: ElementRef) {
   this.sort = content;
   if (this.sort) {
     this.dataSource.sort = this.sort;
   }
 }
 constructor(private service: DataProtocolService, private globalService: globalSharedService) { }

 ngOnInit(): void {
   this.dataSource = new MatTableDataSource();
   this.businessEntityId = sessionStorage.getItem('beId');
   this.dataSource.filterPredicate = function (data, filter: string): boolean {
     return data.name.toLowerCase().includes(filter) ||
       data.publicAccess.toLowerCase().includes(filter) ||
       data.communications.toString().toLowerCase().includes(filter);
   };
   this.loadFormData()
 }


 loadFormData() {
   this.showLoaderImage = true;
   this.getCommProtocol();

 }
 getDataProtocolsByBeId() {
   let beId = parseInt(sessionStorage.getItem('beId'));
   this.service.getDataProtocolList(beId).subscribe(data => {
     this.showLoaderImage = false;
     this.dataProtocols = data;
     if (null != this.dataProtocols && this.dataProtocols.length != 0) {
       this.dataProtocols = this.dataProtocols.sort((dp1, dp2) => dp2.id - dp1.id);
       this.dataProtocols.forEach(dp => {
         let communications = [];
         let dataSubProtocols = dp.dataSubProtocols
         for (let dsp of dataSubProtocols) {
           if(dsp.commProtocol===undefined){
            let commProtocolId=dsp.commProtocolId
           let commProtocol= this.commProtocolMap.get(commProtocolId)
           communications.push(commProtocol.name);
          }
          else{
            communications.push(dsp.commProtocol.name);
          }
         }
         dp.communications = communications;
         if (dp.isGeneric) {
           dp.publicAccess = 'Yes'
         } else {
           dp.publicAccess = 'No'
         }
       })
       this.dataProtocols.forEach(dataprot => {
         if (!dataprot.communications) {
           dataprot.communications = [];
         }
       })
       //this.dataSource = new MatTableDataSource();
       this.dataSource.data = this.dataProtocols;

       // To get paginator events from child mat-table-paginator to access its properties
       this.myPaginator = this.myPaginatorChildComponent.getDatasource();
       this.matTablePaginator(this.myPaginator);

       this.dataSource.paginator = this.myPaginator;
       this.dataSource.sort = this.sort;
       this.dataProtocolTableView = true;
     } else {
       //   this.dataSource = new MatTableDataSource();
       this.dataSource.data = [];
       this.dataProtocolTableView = false;
       this.NoRecordsFound = true;
     }
   },
     error => {

       this.showLoaderImage = false;
       this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
     })
 }

 getCommProtocol() {
  this.service.getCommprotocolList().subscribe(res => {
    res.forEach(obj => {
      this.commProtocolMap.set(obj.id, obj);
    });
    this.getDataProtocolsByBeId();

  },
    error => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    }
  );

}

 editDataProtocol(id: number) {
   this.globalService.GettingId(id);
   this.globalService.GettingString('Edit');
 }

 viewDataProtocol(id: number) {
   this.globalService.GettingId(id);
   this.globalService.GettingString('View');
 }

 refreshTableListFunction() {
   this.loadFormData();
 }

 //redirectTo
 redirectTo() {
   this.dataSource.data = []
   this.loadFormData();
 }
 @Output() tabName = new EventEmitter<string>();

 navigateToDPTagList(obj) {
   let dataProtocolId = obj.id;
   let dataProtocolName = obj.name;
   this.globalService.gettingName(dataProtocolName);
   this.tabName.emit('DPTag');
   this.globalService.setGlobalId(dataProtocolId);
   let myTab = document.getElementById('DPTag');
   myTab.click();
 }

 navigateToCommunication(obj) {
   let dataProtocolId = obj.id;
   let dataProtocolName = obj.name;
   this.globalService.gettingName(dataProtocolName);
   this.tabName.emit('communication');
   this.globalService.GettingId(dataProtocolId);
   let myTab = document.getElementById('communication');
   myTab.click();
 }

 deleteDataProtocol(id: number) {
   this.dataProtocolId = id;
   // Trigger sweet alert danger alert
   this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Data Protocol!');
 }

 // confirmDelete
 confirmDelete() {
   let beId = parseInt(sessionStorage.getItem('beId'));
   let userId = sessionStorage.getItem('userId');
   this.service.deleteDataProtocol(this.dataProtocolId, Number(userId), Number(beId)).subscribe(res => {
     // response handling
     this.modelNotification.alertMessage(res['messageType'], res['message']);
   },
     (error: any) => {
       // If the service is not available
       this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
     }
   );
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
