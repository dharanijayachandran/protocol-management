import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubProtocolDhResponseTagComponent } from './data-sub-protocol-dh-response-tag.component';

describe('DataSubProtocolDhResponseTagComponent', () => {
  let component: DataSubProtocolDhResponseTagComponent;
  let fixture: ComponentFixture<DataSubProtocolDhResponseTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubProtocolDhResponseTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubProtocolDhResponseTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
