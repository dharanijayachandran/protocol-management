import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolParamViewComponent } from './protocol-param-view.component';

describe('ProtocolParamViewComponent', () => {
  let component: ProtocolParamViewComponent;
  let fixture: ComponentFixture<ProtocolParamViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolParamViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolParamViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
