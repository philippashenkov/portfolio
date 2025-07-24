// Этот файл создаст заглушки для текстур Earth
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function createTexture(width, height, color, filename) {
  canvas.width = width;
  canvas.height = height;
  
  if (ctx) {
    // Заливка цветом
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Для некоторых текстур добавим паттерны
    if (filename === 'earth.jpg') {
      // Создаем простую карту мира
      ctx.fillStyle = '#0066cc'; // океаны
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#339933'; // континенты
      // Простые формы континентов
      ctx.fillRect(50, 100, 200, 150);
      ctx.fillRect(300, 80, 180, 120);
      ctx.fillRect(100, 300, 250, 100);
    } else if (filename === 'glow.png') {
      // Радиальный градиент для свечения
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (filename === 'gradient.png') {
      // Простой градиент для точек
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  }
  
  return canvas.toDataURL();
}
