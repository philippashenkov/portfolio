/**
 * Хелпер для отключения зоны Angular при работе с Three.js
 * Используется для полного исключения ошибок zone.js
 */
export class ZoneDisabler {
  private static originalRequestAnimationFrame: any;
  private static isPatched = false;
  
  /**
   * Создает "пустую" зону Angular, которая ничего не делает
   */
  static createNoopZone(): any {
    return {
      run: (fn: Function) => fn(),
      runGuarded: (fn: Function) => fn(),
      runOutsideAngular: (fn: Function) => fn(),
      runTask: (fn: Function) => fn()
    };
  }
  
  /**
   * ПОЛНОСТЬЮ блокирует requestAnimationFrame для предотвращения ошибок
   */
  static patchRequestAnimationFrame(): void {
    if (ZoneDisabler.isPatched) return;
    
    // Сохраняем оригинальную функцию только один раз
    ZoneDisabler.originalRequestAnimationFrame = window.requestAnimationFrame;
    
    // Заменяем requestAnimationFrame на функцию, которая НЕ ДЕЛАЕТ НИЧЕГО
    // Это полностью блокирует все анимации через requestAnimationFrame
    window.requestAnimationFrame = function(_callback: FrameRequestCallback): number {
      console.warn('requestAnimationFrame blocked to prevent violations');
      return 0; // Возвращаем фиктивный ID
    };
    
    // Также блокируем cancelAnimationFrame
    window.cancelAnimationFrame = function(_id: number): void {
      // Ничего не делаем
    };
    
    ZoneDisabler.isPatched = true;
    console.log('requestAnimationFrame completely disabled');
  }
  
  /**
   * Восстанавливает оригинальный requestAnimationFrame (если нужно)
   */
  static restoreRequestAnimationFrame(): void {
    if (ZoneDisabler.originalRequestAnimationFrame && ZoneDisabler.isPatched) {
      window.requestAnimationFrame = ZoneDisabler.originalRequestAnimationFrame;
      ZoneDisabler.isPatched = false;
    }
  }
}
