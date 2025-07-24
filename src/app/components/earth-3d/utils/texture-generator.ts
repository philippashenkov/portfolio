import * as THREE from 'three';

export class TextureGenerator {
  static createEarthTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Темная основа (космос/океан)
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Рисуем светящиеся контуры континентов
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 8;
    
    // Северная Америка
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.quadraticCurveTo(300, 150, 400, 200);
    ctx.quadraticCurveTo(350, 300, 250, 350);
    ctx.quadraticCurveTo(150, 280, 200, 200);
    ctx.stroke();
    
    // Южная Америка  
    ctx.beginPath();
    ctx.moveTo(350, 400);
    ctx.quadraticCurveTo(380, 450, 370, 550);
    ctx.quadraticCurveTo(340, 600, 320, 550);
    ctx.quadraticCurveTo(300, 450, 350, 400);
    ctx.stroke();
    
    // Европа
    ctx.beginPath();
    ctx.moveTo(950, 180);
    ctx.quadraticCurveTo(1000, 160, 1050, 190);
    ctx.quadraticCurveTo(1020, 220, 980, 210);
    ctx.quadraticCurveTo(950, 200, 950, 180);
    ctx.stroke();
    
    // Африка
    ctx.beginPath();
    ctx.moveTo(980, 250);
    ctx.quadraticCurveTo(1020, 300, 1000, 400);
    ctx.quadraticCurveTo(980, 500, 960, 450);
    ctx.quadraticCurveTo(940, 350, 980, 250);
    ctx.stroke();
    
    // Азия
    ctx.beginPath();
    ctx.moveTo(1100, 150);
    ctx.quadraticCurveTo(1300, 120, 1500, 180);
    ctx.quadraticCurveTo(1400, 250, 1200, 280);
    ctx.quadraticCurveTo(1100, 220, 1100, 150);
    ctx.stroke();
    
    // Китай/Индия
    ctx.beginPath();
    ctx.moveTo(1200, 300);
    ctx.quadraticCurveTo(1300, 320, 1350, 380);
    ctx.quadraticCurveTo(1300, 420, 1250, 400);
    ctx.quadraticCurveTo(1180, 350, 1200, 300);
    ctx.stroke();
    
    // Австралия
    ctx.beginPath();
    ctx.moveTo(1600, 500);
    ctx.quadraticCurveTo(1700, 480, 1750, 520);
    ctx.quadraticCurveTo(1720, 550, 1650, 540);
    ctx.quadraticCurveTo(1600, 530, 1600, 500);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
  }
  
  static createGradientTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    return new THREE.CanvasTexture(canvas);
  }
  
  static createGlowTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(100, 200, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(100, 200, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    return new THREE.CanvasTexture(canvas);
  }
  
  static createRedCircleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
  }
  
  static createLabelTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, 128, 32);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CITY', 64, 20);
    
    return new THREE.CanvasTexture(canvas);
  }
  
  static createApertureTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.stroke();
    
    // Добавляем крест
    ctx.beginPath();
    ctx.moveTo(32, 10);
    ctx.lineTo(32, 54);
    ctx.moveTo(10, 32);
    ctx.lineTo(54, 32);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
  }
  
  static createLightColumnTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, 'rgba(100, 200, 255, 0)');
    gradient.addColorStop(0.5, 'rgba(100, 200, 255, 1)');
    gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 256);
    
    return new THREE.CanvasTexture(canvas);
  }
  
  static createAircraftTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    // Простой самолет
    ctx.moveTo(16, 8);
    ctx.lineTo(24, 16);
    ctx.lineTo(16, 24);
    ctx.lineTo(8, 16);
    ctx.closePath();
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
  }
  
  static createLatLongGridTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Прозрачная основа
    ctx.clearRect(0, 0, 2048, 1024);
    
    // Настройки линий сетки
    ctx.strokeStyle = '#00ccff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    // Линии долготы (меридианы)
    for (let lng = 0; lng <= 360; lng += 30) {
      const x = (lng / 360) * 2048;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    
    // Линии широты (параллели)
    for (let lat = 0; lat <= 180; lat += 30) {
      const y = (lat / 180) * 1024;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }
    
    // Экватор (ярче)
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    const equatorY = 1024 / 2;
    ctx.beginPath();
    ctx.moveTo(0, equatorY);
    ctx.lineTo(2048, equatorY);
    ctx.stroke();
    
    // Нулевой меридиан (ярче)
    const primeMeridianX = 2048 / 2;
    ctx.beginPath();
    ctx.moveTo(primeMeridianX, 0);
    ctx.lineTo(primeMeridianX, 1024);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
  }
}