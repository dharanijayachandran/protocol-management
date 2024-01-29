import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamValueFormComponent } from './protocol-param-value-form.component';

describe('ProtocolParamValueFormComponent', () => {
  let component: ProtocolParamValueFormComponent;
  let fixture: ComponentFixture<ProtocolParamValueFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamValueFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamValueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
