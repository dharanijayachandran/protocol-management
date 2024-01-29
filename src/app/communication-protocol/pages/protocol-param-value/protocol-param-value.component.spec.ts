import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamValueComponent } from './protocol-param-value.component';

describe('ProtocolParamValueComponent', () => {
  let component: ProtocolParamValueComponent;
  let fixture: ComponentFixture<ProtocolParamValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
