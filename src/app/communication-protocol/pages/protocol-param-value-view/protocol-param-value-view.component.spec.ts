import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamValueViewComponent } from './protocol-param-value-view.component';

describe('ProtocolParamValueViewComponent', () => {
  let component: ProtocolParamValueViewComponent;
  let fixture: ComponentFixture<ProtocolParamValueViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamValueViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamValueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
