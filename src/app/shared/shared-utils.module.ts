import { NgModule } from '@angular/core';
import { OptimizedImageComponent } from './components/optimized-image/optimized-image.component';
import { TrackByForDirective } from './directives/track-by-for.directive';

@NgModule({
  imports: [
    OptimizedImageComponent,
    TrackByForDirective
  ],
  exports: [
    OptimizedImageComponent,
    TrackByForDirective
  ]
})
export class SharedUtilsModule {}
