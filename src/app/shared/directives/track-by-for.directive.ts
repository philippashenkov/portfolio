import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface TrackByContext<T> {
  $implicit: T;
  index: number;
  count: number;
}

@Directive({
  selector: '[appTrackByFor]',
  standalone: true
})
export class TrackByForDirective<T> {
  private _items: T[] = [];
  
  @Input() set appTrackByForOf(items: T[]) {
    this._items = items;
    this._update();
  }
  
  @Input() appTrackByForTrackBy: (index: number, item: T) => any = (index: number) => index;
  
  constructor(
    private templateRef: TemplateRef<TrackByContext<T>>,
    private viewContainer: ViewContainerRef
  ) {}
  
  private _update() {
    this.viewContainer.clear();
    const count = this._items.length;
    
    this._items.forEach((item, index) => {
      this.viewContainer.createEmbeddedView(
        this.templateRef, 
        { 
          $implicit: item, 
          index, 
          count 
        }
      );
    });
  }
}
