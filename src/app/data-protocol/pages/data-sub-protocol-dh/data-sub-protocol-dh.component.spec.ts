import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubProtocolDhComponent } from './data-sub-protocol-dh.component';

describe('DataSubProtocolDhComponent', () => {
  let component: DataSubProtocolDhComponent;
  let fixture: ComponentFixture<DataSubProtocolDhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubProtocolDhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubProtocolDhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
