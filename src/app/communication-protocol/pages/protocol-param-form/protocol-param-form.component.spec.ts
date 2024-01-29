import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamFormComponent } from './protocol-param-form.component';

describe('ProtocolParamFormComponent', () => {
  let component: ProtocolParamFormComponent;
  let fixture: ComponentFixture<ProtocolParamFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
