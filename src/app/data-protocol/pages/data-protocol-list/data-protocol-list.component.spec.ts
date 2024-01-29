import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtocolListComponent } from './data-protocol-list.component';

describe('DataProtocolListComponent', () => {
  let component: DataProtocolListComponent;
  let fixture: ComponentFixture<DataProtocolListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtocolListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtocolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
