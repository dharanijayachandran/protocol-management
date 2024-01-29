import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamGroupFormComponent } from './protocol-param-group-form.component';

describe('ProtocolParamGroupFormComponent', () => {
  let component: ProtocolParamGroupFormComponent;
  let fixture: ComponentFixture<ProtocolParamGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
