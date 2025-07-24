import { EventEmitter } from 'pietile-eventemitter';
import * as THREE from 'three';
import { TextureGenerator } from '../utils/texture-generator';

interface ResourceEvents {
  loaded: () => void;
  error: (error: any) => void;
}

export default class Resources extends EventEmitter<ResourceEvents> {
  public textures: { [key: string]: THREE.Texture } = {};
  private loadedCount = 0;
  private totalCount = 0;

  constructor() {
    super();
  }

  public loadTextures(): void {
    console.log('Starting to load textures programmatically...');
    
    try {
      // Создаем текстуры программно
      this.textures['earth'] = TextureGenerator.createEarthTexture();
      this.textures['latlong'] = TextureGenerator.createLatLongGridTexture();
      this.textures['gradient'] = TextureGenerator.createGradientTexture();
      this.textures['glow'] = TextureGenerator.createGlowTexture();
      this.textures['redCircle'] = TextureGenerator.createRedCircleTexture();
      this.textures['label'] = TextureGenerator.createLabelTexture();
      this.textures['aperture'] = TextureGenerator.createApertureTexture();
      this.textures['light_column'] = TextureGenerator.createLightColumnTexture();
      this.textures['aircraft'] = TextureGenerator.createAircraftTexture();

      console.log('All textures created successfully:', this.textures);
      
      // Сразу эмитим событие loaded
      setTimeout(() => {
        console.log('Emitting loaded event...');
        this.emit('loaded');
      }, 100);
      
    } catch (error) {
      console.error('Error creating textures:', error);
      this.emit('error', error);
    }
  }

  public destroy(): void {
    // Очищаем текстуры
    Object.values(this.textures).forEach(texture => {
      texture.dispose();
    });
    this.textures = {};
    this.offAll();
  }
}
