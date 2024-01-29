import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtocolFormComponent } from './data-protocol-form.component';

describe('DataProtocolFormComponent', () => {
  let component: DataProtocolFormComponent;
  let fixture: ComponentFixture<DataProtocolFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtocolFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtocolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
