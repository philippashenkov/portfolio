import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemoizationService {
  private cache = new Map<string, any>();
  
  /**
   * Кэширует результат функции по ключу
   * @param key - Уникальный ключ для кэширования
   * @param fn - Функция, результат которой нужно кэшировать
   * @param ttl - Время жизни кэша в миллисекундах (опционально)
   */
  memoize<T>(key: string, fn: () => T, ttl?: number): T {
    if (this.cache.has(key)) {
      return this.cache.get(key).value;
    }
    
    const result = fn();
    const cacheEntry = { value: result, timestamp: Date.now() };
    this.cache.set(key, cacheEntry);
    
    // Если установлено время жизни кэша, создаем таймер для его очистки
    if (ttl) {
      setTimeout(() => {
        this.cache.delete(key);
      }, ttl);
    }
    
    return result;
  }
  
  /**
   * Очищает кэш по ключу или весь кэш
   * @param key - Ключ для очистки кэша (если не указан, очищается весь кэш)
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  /**
   * Создает мемоизированную версию функции
   * @param fn - Функция для мемоизации
   */
  createMemoizedFunction<T, Args extends any[]>(
    fn: (...args: Args) => T
  ): (...args: Args) => T {
    const cache = new Map<string, T>();
    
    return (...args: Args): T => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }
}
