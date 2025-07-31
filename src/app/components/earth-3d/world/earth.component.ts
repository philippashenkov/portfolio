import { Component, AfterViewInit, NgZone, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer, 
  Color, 
  Mesh, 
  Object3D, 
  Material,
  Fog,
  ShadowMapType,
  PCFSoftShadowMap,
  TextureLoader,
  Texture
} from 'three';
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
    
    // Улучшенная настройка камеры для более кинематографичного вида
    this.camera = new PerspectiveCamera(
      35, // Уменьшаем FOV для более кинематографичного вида
      this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight,
      0.1, // Уменьшаем ближнюю плоскость для лучшей детализации
      2000 // Увеличиваем дальнюю плоскость для лучшей глубины
    );
    this.camera.position.set(20, 12, 25); // Размещаем камеру дальше и под более интересным углом
    this.camera.lookAt(0, 0, 0);
    this.scene.fog = new Fog(0x000000, 50, 200); // Добавляем туман для атмосферности
    
    // Создаем высококачественный рендерер
    this.renderer = new WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true,
      alpha: true,
      precision: 'highp',
      depth: true,
      stencil: true,
      logarithmicDepthBuffer: true
    });
    
    // Включаем тени и настраиваем качество
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    
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
        const textureLoader = new TextureLoader();
        const loadTexture = (path: string): Promise<Texture> => {
            return new Promise((resolve) => {
                textureLoader.load(path, (texture) => {
                    resolve(texture);
                });
            });
        };
        
        const [earthTexture, bumpTexture, specularTexture, cloudTexture] = await Promise.all([
            loadTexture('/assets/textures/earth.jpg'),
            loadTexture('/assets/textures/bump.jpg'),
            loadTexture('/assets/textures/specular.jpg'),
            loadTexture('/assets/textures/cloud.png')
        ]) as [Texture, Texture, Texture, Texture];

        this.earth = new Earth({
          dom: this.canvasRef.nativeElement,
          earth: {
            radius: 8,
            rotateSpeed: 0.001,
            isRotation: true
          },
          data: [], // Пустой массив данных для отображения точек
          textures: {
            earth: earthTexture,
            bump: bumpTexture,
            specular: specularTexture,
            cloud: cloudTexture
          },
          satellite: {
            show: true,
            rotateSpeed: 0.005,
            size: 0.2,
            number: 8
          },
          punctuation: {
            circleColor: 0x00ffff,
            lightColumn: {
              startColor: 0x00ffff,
              endColor: 0x0066ff
            }
          },
          flyLine: {
            color: 0x00ffff,
            flyLineColor: 0x0066ff,
            speed: 0.004
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