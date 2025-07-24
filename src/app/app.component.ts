import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Earth3DComponent } from './components/earth-3d/earth-3d.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Earth3DComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Angular Portfolio';

  ngOnInit() {
    // Инициализация если нужна
  }

  ngOnDestroy() {
    // Очистка если нужна
  }
}