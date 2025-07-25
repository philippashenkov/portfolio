import { Component } from '@angular/core';
import { Earth3DComponent } from '../../components/earth-3d/earth-3d.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [Earth3DComponent]
})
export class HomeComponent {

}
