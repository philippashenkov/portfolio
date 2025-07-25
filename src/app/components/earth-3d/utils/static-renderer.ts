/**
 * Максимально облегченная система рендеринга
 * Использует минимальную частоту обновлений для предотвращения ошибок
 */
export class StaticRenderer {
  private intervalId: number | null = null;
  private isRunning = false;
  private frameRate = 0.5; // 0.5 FPS - обновление раз в 2 секунды
  private lastRenderTime = 0;
  
  constructor(private renderCallback: () => void) {}
  
  /**
   * Запускает статический рендеринг с минимальной частотой
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Используем очень большой интервал для минимизации нагрузки
    this.scheduleNextRender();
    
    console.log(`StaticRenderer started at ${this.frameRate} FPS`);
  }
  
  /**
   * Планирует следующий рендер с проверками производительности
   */
  private scheduleNextRender(): void {
    if (!this.isRunning) return;
    
    const intervalMs = 1000 / this.frameRate;
    
    this.intervalId = window.setTimeout(() => {
      if (!this.isRunning) return;
      
      const now = performance.now();
      
      // Рендерим только если прошло достаточно времени и документ видим
      if (now - this.lastRenderTime >= intervalMs && !document.hidden) {
        try {
          // Минимальная работа в колбэке
          this.renderCallback();
          this.lastRenderTime = now;
        } catch (error) {
          console.warn('Render error in StaticRenderer:', error);
          // При ошибке увеличиваем интервал
          this.frameRate = Math.max(0.1, this.frameRate * 0.5);
        }
      }
      
      // Планируем следующий рендер
      this.scheduleNextRender();
    }, intervalMs);
  }
  
  /**
   * Останавливает рендеринг
   */
  stop(): void {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    console.log('StaticRenderer stopped');
  }
  
  /**
   * Устанавливает частоту кадров (максимум 1 FPS для максимальной производительности)
   */
  setFrameRate(fps: number): void {
    this.frameRate = Math.min(1, Math.max(0.1, fps));
    console.log(`Frame rate set to ${this.frameRate} FPS`);
  }
  
  /**
   * Однократный рендер без запуска цикла
   */
  renderOnce(): void {
    if (!document.hidden) {
      try {
        this.renderCallback();
      } catch (error) {
        console.warn('Single render error:', error);
      }
    }
  }
  
  /**
   * Проверяет, запущен ли рендеринг
   */
  isActive(): boolean {
    return this.isRunning;
  }
}
