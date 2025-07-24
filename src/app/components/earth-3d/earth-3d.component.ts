import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import World from './world/world';

@Component({
  selector: 'app-earth-3d',
  standalone: true,
  template: `
    <div class="earth-container" #earthContainer>
      <canvas #earthCanvas class="earth-canvas"></canvas>
    </div>
  `,
  styleUrls: ['./earth-3d.component.scss']
})
export class Earth3DComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('earthContainer', { static: true }) earthContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('earthCanvas', { static: true }) earthCanvas!: ElementRef<HTMLCanvasElement>;
  
  private world?: World;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initEarth();
  }

  ngOnDestroy(): void {
    // Cleanup если необходимо
    if (this.world) {
      // Очистка ресурсов
    }
  }

  private initEarth(): void {
    if (this.earthContainer?.nativeElement && this.earthCanvas?.nativeElement) {
      this.world = new World({
        dom: this.earthContainer.nativeElement,
        canvas: this.earthCanvas.nativeElement
      });
    }
  }
}
