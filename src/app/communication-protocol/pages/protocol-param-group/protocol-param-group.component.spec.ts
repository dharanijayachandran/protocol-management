import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamGroupComponent } from './protocol-param-group.component';

describe('ProtocolParamGroupComponent', () => {
  let component: ProtocolParamGroupComponent;
  let fixture: ComponentFixture<ProtocolParamGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
