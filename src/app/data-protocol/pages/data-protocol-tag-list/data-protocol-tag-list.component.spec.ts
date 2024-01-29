import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtocolTagListComponent } from './data-protocol-tag-list.component';

describe('DataProtocolTagListComponent', () => {
  let component: DataProtocolTagListComponent;
  let fixture: ComponentFixture<DataProtocolTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtocolTagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtocolTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
