import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtocolCommTagComponent } from './data-protocol-comm-tag.component';

describe('DataProtocolCommTagComponent', () => {
  let component: DataProtocolCommTagComponent;
  let fixture: ComponentFixture<DataProtocolCommTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtocolCommTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtocolCommTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
