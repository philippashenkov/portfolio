import { Component, AfterViewInit, NgZone, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, Color, Mesh, Object3D, Material } from '../../../shared/three-utils';
import Earth from './earth';

// Add ResizeObserver type for TypeScript if not present
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

@Component({
  selector: 'app-earth',
  standalone: true,
  template: '<div class="earth-container"><canvas #canvas style="border: 2px solid red; background: #001122;"></canvas></div>',
  styles: [`.earth-container { width: 100%; height: 100%; overflow: hidden; background: #000; }`],
  changeDetection: ChangeDetectionStrategy.OnPush // Reduce Angular checks
})
export class EarthComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private earth!: Earth;
  private isDestroyed = false;
  private visibilityObserver: IntersectionObserver | null = null;
  private isVisible = false;
  private isInitialized = false;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.setupVisibilityObserver();
    
    this.ngZone.runOutsideAngular(() => {
        this.initThreeJS();
        this.initEarth();
    });
  }
  
  private animate(): void {
    if (this.isDestroyed || !this.isVisible) {
      return;
    }
    
    this.renderEarth();
    
    requestAnimationFrame(() => this.animate());
  }
  
  /**
   * Метод рендеринга с обновлением вращения
   */
  private renderEarth(): void {
    if (!this.renderer || !this.scene || !this.camera || this.isDestroyed) return;
    
    try {
      if (this.earth) {
        this.earth.render();
      }
      
      this.renderer.render(this.scene, this.camera);

    } catch (error) {
      console.warn('Render error:', error);
    }
  }

  private initThreeJS(): void {
    // Создаем минимальную сцену
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);
    
    // Setup camera с минимальными настройками
    this.camera = new PerspectiveCamera(
      45, // Увеличиваем поле зрения для лучшего обзора
      this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight,
      1, // Ближняя плоскость
      1000 // Дальняя плоскость
    );
    this.camera.position.set(10, 5, 15); // Измененная позиция под углом для лучшего обзора вращения
    this.camera.lookAt(0, 0, 0); // Убеждаемся, что камера смотрит на центр
    
    // Создаем максимально оптимизированный рендерер
    this.renderer = new WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true, // Включаем для лучшего качества
      powerPreference: 'default', // Используем нормальную мощность
      alpha: false, // Отключаем прозрачность для ускорения
      precision: 'mediump',
      depth: true,
      stencil: false,
      logarithmicDepthBuffer: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });
    
    // Устанавливаем нормальное разрешение
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 1);
    
    // Устанавливаем нормальный размер канваса
    const width = Math.max(600, this.canvasRef.nativeElement.clientWidth);
    const height = Math.max(600, this.canvasRef.nativeElement.clientHeight);
    this.renderer.setSize(width, height);
    
    console.log(`Canvas size set to: ${width}x${height}`);
    
    // Применяем дополнительные оптимизации
    // EarthOptimizer.optimizeRenderer(this.renderer); // ВРЕМЕННО ОТКЛЮЧАЕМ
    // EarthOptimizer.optimizeCamera(this.camera); // ВРЕМЕННО ОТКЛЮЧАЕМ 
    // EarthOptimizer.optimizeScene(this.scene); // ВРЕМЕННО ОТКЛЮЧАЕМ
  }
  
  private initEarth(): void {
    this.ngZone.runOutsideAngular(async () => {
      try {
        this.earth = new Earth({
          dom: this.canvasRef.nativeElement,
          earth: {
            radius: 10,
            rotateSpeed: 0.002,
            isRotation: true
          },
          satellite: {
            show: true,
            rotateSpeed: 0.01,
            size: 0.1,
            number: 20
          }
        });
        await this.earth.init();
        this.scene.add(this.earth.group);
        this.isInitialized = true;
        if (this.isVisible) {
          this.animate();
        }
      } catch (error) {
        console.error('Error initializing Earth:', error);
      }
    });
  }
  
  private setupVisibilityObserver(): void {
    if ('IntersectionObserver' in window) {
      this.ngZone.runOutsideAngular(() => {
        this.visibilityObserver = new IntersectionObserver(
          (entries) => {
            this.isVisible = entries[0].isIntersecting;
            console.log('Visibility changed:', this.isVisible);
            
            if (this.isVisible && this.isInitialized) {
              this.animate();
            }
          },
          { 
            threshold: 0.1,
            rootMargin: '100px'
          }
        );
        
        const container = this.canvasRef.nativeElement.parentElement;
        if (container) {
          this.visibilityObserver.observe(container);
        }
      });
    } else {
      this.isVisible = true;
      this.isInitialized = true;
      this.animate();
    }
  }
  
  ngOnDestroy(): void {
    this.isDestroyed = true;
    
    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
      this.visibilityObserver = null;
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.scene) {
      this.scene.traverse((object: Object3D) => {
        if (object instanceof Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => {
                this.disposeMaterial(material);
              });
            } else {
              this.disposeMaterial(object.material);
            }
          }
        }
      });
    }
  }
  
  private disposeMaterial(material: Material): void {
    // Освобождаем текстуры из памяти
    Object.keys(material).forEach(key => {
      const value = (material as any)[key];
      if (value && typeof value === 'object' && 'isTexture' in value) {
        value.dispose();
      }
    });
    
    material.dispose();
  }
}