/**
 * Вспомогательный класс для мониторинга производительности requestAnimationFrame
 * и других операций рендеринга
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private frameStartTime = 0;
  private lastFrameDuration = 0;
  private frameTimes: number[] = [];
  private isMonitoring = false;
  private longFrameThreshold = 16; // 60fps = ~16ms per frame
  private throttleRatio = 1;
  
  private constructor() {
    this.setupFrameMonitoring();
  }
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * Настройка мониторинга времени выполнения requestAnimationFrame
   */
  private setupFrameMonitoring(): void {
    const originalRAF = window.requestAnimationFrame;
    
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      const wrappedCallback: FrameRequestCallback = (time) => {
        this.frameStartTime = performance.now();
        
        try {
          callback(time);
        } finally {
          const endTime = performance.now();
          this.lastFrameDuration = endTime - this.frameStartTime;
          
          if (this.isMonitoring) {
            this.frameTimes.push(this.lastFrameDuration);
            
            // Если время выполнения кадра превышает пороговое значение
            if (this.lastFrameDuration > this.longFrameThreshold) {
              // Адаптивно увеличиваем throttling
              this.throttleRatio = Math.min(4, this.throttleRatio + 0.2);
              console.debug(`Long frame: ${Math.round(this.lastFrameDuration)}ms, increasing throttle to ${this.throttleRatio.toFixed(1)}`);
            } else if (this.frameTimes.length > 10) {
              // Постепенно уменьшаем throttling, если последние кадры быстрые
              const recentFrames = this.frameTimes.slice(-10);
              const averageTime = recentFrames.reduce((sum, time) => sum + time, 0) / recentFrames.length;
              
              if (averageTime < this.longFrameThreshold / 2) {
                this.throttleRatio = Math.max(1, this.throttleRatio - 0.1);
              }
            }
          }
        }
      };
      
      return originalRAF.call(window, wrappedCallback);
    };
  }
  
  /**
   * Начать мониторинг производительности
   */
  startMonitoring(): void {
    this.isMonitoring = true;
    this.frameTimes = [];
  }
  
  /**
   * Остановить мониторинг производительности
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
  }
  
  /**
   * Получить текущий коэффициент троттлинга (для адаптивной регулировки частоты кадров)
   */
  getThrottleRatio(): number {
    return this.throttleRatio;
  }
  
  /**
   * Получить среднее время выполнения кадра
   */
  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    
    return this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
  }
  
  /**
   * Сброс накопленной статистики
   */
  reset(): void {
    this.frameTimes = [];
    this.throttleRatio = 1;
  }
}
