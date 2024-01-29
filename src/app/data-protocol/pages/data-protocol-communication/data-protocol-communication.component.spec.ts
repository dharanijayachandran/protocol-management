import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtocolCommunicationComponent } from './data-protocol-communication.component';

describe('DataProtocolCommunicationComponent', () => {
  let component: DataProtocolCommunicationComponent;
  let fixture: ComponentFixture<DataProtocolCommunicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtocolCommunicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtocolCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
