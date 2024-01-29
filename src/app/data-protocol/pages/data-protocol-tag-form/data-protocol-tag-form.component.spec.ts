import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtocolTagFormComponent } from './data-protocol-tag-form.component';

describe('DataProtocolTagFormComponent', () => {
  let component: DataProtocolTagFormComponent;
  let fixture: ComponentFixture<DataProtocolTagFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtocolTagFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtocolTagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
