import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Sizes from '../utils/sizes';

interface IBasicOption {
  dom: HTMLElement;
  canvas: HTMLCanvasElement;
  sizes: Sizes;
}

export default class Basic {
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public renderer!: THREE.WebGLRenderer;
  public controls!: OrbitControls;
  private sizes: Sizes;
  private canvas: HTMLCanvasElement;

  constructor(option: IBasicOption) {
    console.log('Basic constructor called');
    
    this.sizes = option.sizes;
    this.canvas = option.canvas;
    
    this.scene = new THREE.Scene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.bindEvents();
    
    console.log('Basic initialized successfully');
  }

  private createCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5); // Уменьшаем дистанцию для новых размеров
    console.log('Camera created:', this.camera);
  }

  private createRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    
    console.log('Renderer created:', this.renderer);
  }

  private createControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.maxDistance = 10;
    this.controls.minDistance = 3;
    
    console.log('Controls created:', this.controls);
  }

  private bindEvents(): void {
    this.sizes.on('resize', (data) => {
      console.log('Sizes changed:', data);
      this.camera.aspect = data.width / data.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(data.width, data.height);
    });
  }

  public destroy(): void {
    this.controls?.dispose();
    this.renderer?.dispose();
  }
}
