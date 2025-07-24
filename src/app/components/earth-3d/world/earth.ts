import * as THREE from 'three';

interface IEarthOption {
  data: any;
  dom: HTMLElement;
  textures: { [key: string]: THREE.Texture };
  earth: {
    radius: number;
    rotateSpeed: number;
    isRotation: boolean;
  };
  satellite: {
    show: boolean;
    rotateSpeed: number;
    size: number;
    number: number;
  };
  punctuation: {
    circleColor: number;
    lightColumn: {
      startColor: number;
      endColor: number;
    };
  };
  flyLine: {
    color: number;
    flyLineColor: number;
    speed: number;
  };
}

export default class Earth {
  public group: THREE.Group;
  private options: IEarthOption;
  private earthMesh?: THREE.Mesh;
  private gridGroup?: THREE.Group;
  
  constructor(options: IEarthOption) {
    console.log('Earth constructor called with options:', options);
    this.options = options;
    this.group = new THREE.Group();
  }

  async init(): Promise<void> {
    console.log('Earth init called...');
    
    try {
      this.createEarthSphere();
      this.createGeographicGrid();
      this.createLights();
      
      console.log('Earth initialization completed');
    } catch (error) {
      console.error('Error in Earth init:', error);
    }
  }

  private createEarthSphere(): void {
    console.log('Creating Earth sphere...');
    
    const geometry = new THREE.SphereGeometry(this.options.earth.radius, 64, 64);
    
    // Темно-синий материал для основы сферы
    const material = new THREE.MeshBasicMaterial({
      color: 0x0a1428, // Темно-синий цвет
      transparent: true,
      opacity: 0.8,
      wireframe: false
    });
    
    this.earthMesh = new THREE.Mesh(geometry, material);
    this.group.add(this.earthMesh);
    
    console.log('Earth sphere created');
  }

  private createGeographicGrid(): void {
    console.log('Creating geographic grid...');
    
    this.gridGroup = new THREE.Group();
    
    // Создаем линии широт (параллели)
    this.createLatitudeLines();
    
    // Создаем линии долгот (меридианы)
    this.createLongitudeLines();
    
    this.group.add(this.gridGroup);
    
    console.log('Geographic grid created');
  }

  private createLatitudeLines(): void {
    const radius = this.options.earth.radius + 0.5; // Чуть больше радиуса сферы
    
    // Основные параллели (каждые 30 градусов)
    const majorLatitudes = [-60, -30, 0, 30, 60]; // Экватор и тропики
    
    // Дополнительные параллели (каждые 15 градусов)
    const minorLatitudes = [-75, -45, -15, 15, 45, 75];
    
    // Создаем основные линии широт (ярче)
    majorLatitudes.forEach(lat => {
      const curve = this.createLatitudeCurve(lat, radius);
      const material = new THREE.LineBasicMaterial({
        color: lat === 0 ? 0x00ffff : 0x0099cc, // Экватор ярче
        transparent: true,
        opacity: lat === 0 ? 1.0 : 0.8,
        linewidth: lat === 0 ? 3 : 2
      });
      
      const line = new THREE.Line(curve, material);
      this.gridGroup!.add(line);
    });
    
    // Создаем дополнительные линии широт (тусклее)
    minorLatitudes.forEach(lat => {
      const curve = this.createLatitudeCurve(lat, radius);
      const material = new THREE.LineBasicMaterial({
        color: 0x006699,
        transparent: true,
        opacity: 0.4,
        linewidth: 1
      });
      
      const line = new THREE.Line(curve, material);
      this.gridGroup!.add(line);
    });
  }

  private createLongitudeLines(): void {
    const radius = this.options.earth.radius + 0.5;
    
    // Основные меридианы (каждые 30 градусов)
    const majorLongitudes = [0, 30, 60, 90, 120, 150, 180, -150, -120, -90, -60, -30];
    
    // Дополнительные меридианы (каждые 15 градусов)
    const minorLongitudes = [15, 45, 75, 105, 135, 165, -165, -135, -105, -75, -45, -15];
    
    // Создаем основные линии долгот (ярче)
    majorLongitudes.forEach(lng => {
      const curve = this.createLongitudeCurve(lng, radius);
      const material = new THREE.LineBasicMaterial({
        color: lng === 0 ? 0x00ffff : 0x0099cc, // Гринвичский меридиан ярче
        transparent: true,
        opacity: lng === 0 || lng === 180 ? 1.0 : 0.8,
        linewidth: lng === 0 || lng === 180 ? 3 : 2
      });
      
      const line = new THREE.Line(curve, material);
      this.gridGroup!.add(line);
    });
    
    // Создаем дополнительные линии долгот (тусклее)
    minorLongitudes.forEach(lng => {
      const curve = this.createLongitudeCurve(lng, radius);
      const material = new THREE.LineBasicMaterial({
        color: 0x006699,
        transparent: true,
        opacity: 0.4,
        linewidth: 1
      });
      
      const line = new THREE.Line(curve, material);
      this.gridGroup!.add(line);
    });
  }

  private createLatitudeCurve(latitude: number, radius: number): THREE.BufferGeometry {
    const points: THREE.Vector3[] = [];
    const latRad = (latitude * Math.PI) / 180;
    const circleRadius = radius * Math.cos(latRad);
    const y = radius * Math.sin(latRad);
    
    // Создаем полный круг на заданной широте
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const x = circleRadius * Math.cos(angle);
      const z = circleRadius * Math.sin(angle);
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }

  private createLongitudeCurve(longitude: number, radius: number): THREE.BufferGeometry {
    const points: THREE.Vector3[] = [];
    const lngRad = (longitude * Math.PI) / 180;
    
    // Создаем полукруг от полюса до полюса
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * Math.PI; // От 0 до π (полукруг)
      const y = radius * Math.cos(angle);
      const tempRadius = radius * Math.sin(angle);
      const x = tempRadius * Math.cos(lngRad);
      const z = tempRadius * Math.sin(lngRad);
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }

  private createLights(): void {
    console.log('Creating lights...');
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.group.add(ambientLight);
    
    // Добавляем точечный свет для подсветки сетки
    const pointLight = new THREE.PointLight(0x00ffff, 1, 200);
    pointLight.position.set(50, 50, 50);
    this.group.add(pointLight);
    
    console.log('Lights created');
  }

  public render(): void {
    if (this.options.earth.isRotation && this.earthMesh) {
      this.earthMesh.rotation.y += this.options.earth.rotateSpeed;
      if (this.gridGroup) {
        this.gridGroup.rotation.y += this.options.earth.rotateSpeed;
      }
    }
  }
}
