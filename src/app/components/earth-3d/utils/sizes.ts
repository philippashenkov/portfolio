import { EventEmitter } from 'pietile-eventemitter';

interface ISizesOption {
  dom: HTMLElement;
}

// Define event types for the EventEmitter
interface SizesEvents {
  resize: (data: { width: number; height: number }) => void;
}

export default class Sizes extends EventEmitter<SizesEvents> {
  public width!: number;
  public height!: number;
  public viewport: {
    width: number;
    height: number;
  };
  public option: ISizesOption;

  constructor(option: ISizesOption) {
    super();
    
    this.option = option;
    this.viewport = {
      width: 0,
      height: 0
    };
    
    this.init();
    this.bindEvents();
  }

  private init(): void {
    this.updateSizes();
  }

  private updateSizes(): void {
    // Get container dimensions
    const rect = this.option.dom.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    // Update viewport
    this.viewport.width = this.width;
    this.viewport.height = this.height;
  }

  private bindEvents(): void {
    // Listen for window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Listen for container resize (using ResizeObserver if available)
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(this.handleResize.bind(this));
      resizeObserver.observe(this.option.dom);
    }
  }

  private handleResize(): void {
    this.updateSizes();
    this.emit('resize', {
      width: this.width,
      height: this.height
    });
  }

  public destroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.offAll(); // Use offAll() to remove all listeners
  }
}