import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-container" [ngClass]="{'image-loaded': imageLoaded}">
      <!-- Плейсхолдер до загрузки -->
      <div class="image-placeholder" *ngIf="!imageLoaded"></div>
      
      <!-- Изображение с ленивой загрузкой -->
      <picture>
        <!-- WebP версия если поддерживается -->
        <source
          [srcset]="webpSrc || src + '.webp'" 
          type="image/webp"
          [media]="media">
        <!-- Фоллбэк на обычное изображение -->
        <img
          [src]="src" 
          [alt]="alt"
          loading="lazy"
          (load)="onImageLoad()"
          [width]="width"
          [height]="height">
      </picture>
    </div>
  `,
  styles: [`
    .image-container {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    
    .image-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #f0f0f0;
      transition: opacity 0.3s ease;
    }
    
    .image-loaded .image-placeholder {
      opacity: 0;
    }
    
    img {
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedImageComponent implements OnInit {
  @Input() src!: string;
  @Input() webpSrc?: string;
  @Input() alt: string = '';
  @Input() width?: number;
  @Input() height?: number;
  @Input() media: string = '';
  
  imageLoaded: boolean = false;
  
  ngOnInit(): void {
    // Используем IntersectionObserver для отложенной загрузки
    if ('IntersectionObserver' in window) {
      this.setupLazyLoading();
    }
  }
  
  onImageLoad(): void {
    this.imageLoaded = true;
  }
  
  private setupLazyLoading(): void {
    // Будет реализовано при необходимости
  }
}
