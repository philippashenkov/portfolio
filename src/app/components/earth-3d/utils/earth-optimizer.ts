import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, Material } from '../../../shared/three-utils';

/**
 * Класс для оптимизации производительности Three.js сцен
 */
export class EarthOptimizer {
  /**
   * Применяет оптимизации к рендереру для максимальной производительности
   */
  static optimizeRenderer(renderer: WebGLRenderer): void {
    if (!renderer) return;
    
    // Установка максимально низкого разрешения
    renderer.setPixelRatio(0.5);
    
    // Отключение всех необязательных функций
    renderer.shadowMap.enabled = false;
    renderer.sortObjects = false;
    //    renderer.physicallyCorrectLights = false; // Removed: property does not exist on WebGLRenderer
    
    // Сброс информации для экономии памяти
    // if (renderer.info) {
    //   renderer.info.reset();
    //   renderer.info.autoReset = false;
    // }
    
    // Отключение проверок и оптимизация контекста WebGL
    const context = renderer.getContext();
    if (context) {
      // Отключение некоторых проверок WebGL для повышения производительности
      context.getExtension('WEBGL_lose_context');
    }
  }
  
  /**
   * Применяет оптимизации к сцене
   */
  static optimizeScene(scene: Scene): void {
    if (!scene) return;
    
    // Очистка неиспользуемых объектов
    scene.traverse(object => {
      // Упрощаем все меши для повышения производительности
      if ((object as any).isMesh) {
        const mesh = object as Mesh;
        
        // Установка наименее затратных опций для материалов
        if (mesh.material) {
          this.optimizeMaterial(mesh.material);
        }
        
        // Отключение обновления матрицы для статических объектов
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
      }
    });
    
    // Принудительно запускаем сборку мусора
    setTimeout(() => {
      // Форсируем GC, если возможно
      if (typeof window.gc === 'function') {
        try {
          (window as any).gc();
        } catch (e) {}
      }
    }, 100);
  }
  
  /**
   * Оптимизирует настройки материала
   */
  static optimizeMaterial(material: Material | Material[]): void {
    const optimizeSingle = (mat: Material) => {
      // Отключение всех эффектов, требующих ресурсов
      if (mat) {
        (mat as any).precision = 'lowp';
        (mat as any).fog = false;
        
        // Отключаем все карты, кроме самых необходимых
        if ((mat as any).map) {
          // Уменьшаем качество текстур
          const map = (mat as any).map;
          if (map && map.minFilter) {
            map.minFilter = 1003; // THREE.NearestFilter
            map.magFilter = 1003; // THREE.NearestFilter
            map.anisotropy = 1; // Отключаем анизотропию
          }
        }
        
        // Отключаем ненужные карты для экономии памяти
        if ((mat as any).normalMap) (mat as any).normalMap = null;
        if ((mat as any).specularMap) (mat as any).specularMap = null;
        if ((mat as any).aoMap) (mat as any).aoMap = null;
      }
    };
    
    if (Array.isArray(material)) {
      material.forEach(optimizeSingle);
    } else {
      optimizeSingle(material);
    }
  }
  
  /**
   * Оптимизирует настройки камеры
   */
  static optimizeCamera(camera: PerspectiveCamera): void {
    if (!camera) return;
    
    // Оптимизация настроек камеры для производительности
    camera.near = Math.max(0.1, camera.near);
    camera.far = Math.min(1000, camera.far);
  }
}

// Расширяем Window для возможности вызова сборщика мусора
declare global {
  interface Window {
    gc?: () => void;
  }
}
