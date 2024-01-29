import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubProtocolDhTagComponent } from './data-sub-protocol-dh-tag.component';

describe('DataSubProtocolDhTagComponent', () => {
  let component: DataSubProtocolDhTagComponent;
  let fixture: ComponentFixture<DataSubProtocolDhTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubProtocolDhTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubProtocolDhTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
