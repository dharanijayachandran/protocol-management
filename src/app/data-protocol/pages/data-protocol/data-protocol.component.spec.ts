import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtocolComponent } from './data-protocol.component';

describe('DataProtocolComponent', () => {
  let component: DataProtocolComponent;
  let fixture: ComponentFixture<DataProtocolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtocolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
