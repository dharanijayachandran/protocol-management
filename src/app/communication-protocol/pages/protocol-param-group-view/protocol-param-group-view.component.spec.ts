import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamGroupViewComponent } from './protocol-param-group-view.component';

describe('ProtocolParamGroupViewComponent', () => {
  let component: ProtocolParamGroupViewComponent;
  let fixture: ComponentFixture<ProtocolParamGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
