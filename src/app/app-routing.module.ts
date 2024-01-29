import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtocolFormComponent } from './communication-protocol/pages/protocol-form/protocol-form.component';
import { ProtocolParamFormComponent } from './communication-protocol/pages/protocol-param-form/protocol-param-form.component';
import { ProtocolParamGroupFormComponent } from './communication-protocol/pages/protocol-param-group-form/protocol-param-group-form.component';
import { ProtocolParamGroupViewComponent } from './communication-protocol/pages/protocol-param-group-view/protocol-param-group-view.component';
import { ProtocolParamGroupComponent } from './communication-protocol/pages/protocol-param-group/protocol-param-group.component';
import { ProtocolParamValueFormComponent } from './communication-protocol/pages/protocol-param-value-form/protocol-param-value-form.component';
import { ProtocolParamValueViewComponent } from './communication-protocol/pages/protocol-param-value-view/protocol-param-value-view.component';
import { ProtocolParamValueComponent } from './communication-protocol/pages/protocol-param-value/protocol-param-value.component';
import { ProtocolParamViewComponent } from './communication-protocol/pages/protocol-param-view/protocol-param-view.component';
import { ProtocolParamComponent } from './communication-protocol/pages/protocol-param/protocol-param.component';
import { ProtocolViewComponent } from './communication-protocol/pages/protocol-view/protocol-view.component';
import { ProtocolComponent } from './communication-protocol/pages/protocol/protocol.component';
import { DataProtocolCommTagComponent } from './data-protocol/pages/data-protocol-comm-tag/data-protocol-comm-tag.component';
import { DataProtocolCommunicationComponent } from './data-protocol/pages/data-protocol-communication/data-protocol-communication.component';
import { DataProtocolFormComponent } from './data-protocol/pages/data-protocol-form/data-protocol-form.component';
import { DataProtocolListComponent } from './data-protocol/pages/data-protocol-list/data-protocol-list.component';
import { DataProtocolTagFormComponent } from './data-protocol/pages/data-protocol-tag-form/data-protocol-tag-form.component';
import { DataProtocolTagListComponent } from './data-protocol/pages/data-protocol-tag-list/data-protocol-tag-list.component';
import { DataProtocolComponent } from './data-protocol/pages/data-protocol/data-protocol.component';
import { DataSubProtocolDhResponseTagComponent } from './data-protocol/pages/data-sub-protocol-dh-response-tag/data-sub-protocol-dh-response-tag.component';
import { DataSubProtocolDhTagComponent } from './data-protocol/pages/data-sub-protocol-dh-tag/data-sub-protocol-dh-tag.component';
import { DataSubProtocolDhComponent } from './data-protocol/pages/data-sub-protocol-dh/data-sub-protocol-dh.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { PendingChangesGuard } from 'global';


const routes: Routes = [
  {
    path: 'protocol',
    children: [
      {
        path: '',
        component: ProtocolComponent,
        data: { title: 'Protocol' }
      },
      {
        path: 'protocol-form',
        component: ProtocolFormComponent,
         canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'protocol-param-group-form',
        component: ProtocolParamGroupFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'protocol-param-form',
        component: ProtocolParamFormComponent,
         canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'protocol-param-value-form',
        component: ProtocolParamValueFormComponent,
         canDeactivate: [PendingChangesGuard]
      },
    ]
  },
  {
    path: 'data-protocol',
    children: [
      {
        path: '',
        component: DataProtocolComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'data-protocol-list',
        component: DataProtocolListComponent,
         canDeactivate: [PendingChangesGuard]

      },
      {
        path: 'data-protocol-form',
        component: DataProtocolFormComponent,
         canDeactivate: [PendingChangesGuard]

      },
      {
        path: 'data-protocol-tag-list',
        component: DataProtocolTagListComponent,
         canDeactivate: [PendingChangesGuard]

      },
      {
        path: 'data-protocol-tag-form',
        component: DataProtocolTagFormComponent,
        canDeactivate: [PendingChangesGuard]

      },
      {
        path: 'data-protocol-comm-tag',
        component: DataProtocolCommTagComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'data-sub-protocol-dh',
        component: DataSubProtocolDhComponent,
         canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'data-sub-protocol-dh-response-tag',
        component: DataSubProtocolDhResponseTagComponent,
         canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'data-sub-protocol-dh-tag',
        component: DataSubProtocolDhTagComponent,
         canDeactivate: [PendingChangesGuard]
      }
    ]
  },
  {
    path: '**',
    component: EmptyRouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/protocol-config' },
  ],
})
export class AppRoutingModule { }
export const protocolManagement = [
  ProtocolComponent,
  ProtocolFormComponent,
  ProtocolParamComponent,
  ProtocolParamFormComponent,
  ProtocolParamGroupComponent,
  ProtocolParamGroupFormComponent,
  ProtocolParamGroupViewComponent,
  ProtocolParamValueComponent,
  ProtocolParamValueFormComponent,
  ProtocolParamValueViewComponent,
  ProtocolParamViewComponent,
  ProtocolViewComponent,
  DataProtocolComponent,
  DataProtocolCommTagComponent,
  DataProtocolCommunicationComponent,
  DataProtocolFormComponent,
  DataProtocolListComponent,
  DataProtocolTagFormComponent,
  DataProtocolTagListComponent,
  DataSubProtocolDhComponent,
  DataSubProtocolDhResponseTagComponent,
  DataSubProtocolDhTagComponent
];
