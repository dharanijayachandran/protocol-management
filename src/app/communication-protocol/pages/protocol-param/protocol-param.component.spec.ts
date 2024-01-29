import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamComponent } from './protocol-param.component';

describe('ProtocolParamComponent', () => {
  let component: ProtocolParamComponent;
  let fixture: ComponentFixture<ProtocolParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
