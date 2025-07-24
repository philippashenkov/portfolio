import {
  MeshBasicMaterial, 
  PerspectiveCamera,
  Scene, 
  ShaderMaterial, 
  WebGLRenderer
} from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Basic from './basic';
import Sizes from '../utils/sizes';
import Resources from './resources';
import Earth from './earth';
import Data from './data';

interface IWorld {
  dom: HTMLElement;
  canvas: HTMLCanvasElement;
}

export default class World {
  public basic: Basic;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public controls: OrbitControls;
  public sizes: Sizes;
  public material?: ShaderMaterial | MeshBasicMaterial;
  public resources: Resources;
  public option: IWorld;
  public earth?: Earth;

  constructor(option: IWorld) {
    console.log('World constructor called with:', option);
    this.option = option;

    // Initialize sizes first
    this.sizes = new Sizes({ dom: option.dom });
    
    // Initialize basic Three.js setup
    this.basic = new Basic({
      dom: option.dom,
      canvas: option.canvas,
      sizes: this.sizes
    });
    
    this.scene = this.basic.scene;
    this.renderer = this.basic.renderer;
    this.controls = this.basic.controls;
    this.camera = this.basic.camera;

    // Handle resize events
    this.sizes.on('resize', (data) => {
      this.renderer.setSize(data.width, data.height);
      this.camera.aspect = data.width / data.height;
      this.camera.updateProjectionMatrix();
    });

    // Initialize resources
    this.resources = new Resources();
    
    // Listen for resources loaded
    this.resources.on('loaded', () => {
      console.log('Resources loaded, creating Earth...');
      this.createEarth().then(() => {
        console.log('Earth created, starting render loop...');
        this.render();
      });
    });

    // Start loading resources
    this.resources.loadTextures();
  }

  async createEarth() {
    try {
      console.log('Creating Earth with resources:', this.resources.textures);
      
      this.earth = new Earth({
        data: Data,
        dom: this.option.dom,
        textures: this.resources.textures,
        earth: {
          radius: 1.2,
          rotateSpeed: 0.002,
          isRotation: true
        },
        satellite: {
          show: true,
          rotateSpeed: -0.01,
          size: 1,
          number: 2
        },
        punctuation: {
          circleColor: 0x3892ff,
          lightColumn: {
            startColor: 0xe4007f,
            endColor: 0xffffff,
          },
        },
        flyLine: {
          color: 0xf3ae76,
          flyLineColor: 0xff7714,
          speed: 0.004,
        }
      });

      if (this.earth.group) {
        this.scene.add(this.earth.group);
      }
      
      await this.earth.init();
      console.log('Earth initialized successfully');
    } catch (error) {
      console.error('Error creating Earth:', error);
    }
  }

  public render() {
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls && this.controls.update();
    this.earth && this.earth.render();
  }

  public destroy(): void {
    this.sizes?.destroy();
    this.basic?.destroy();
    this.resources?.destroy();
  }
}
