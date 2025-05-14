import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphesComponent } from './graphes.component';

describe('GraphesComponent', () => {
  let component: GraphesComponent;
  let fixture: ComponentFixture<GraphesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
