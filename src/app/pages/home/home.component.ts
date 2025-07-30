import { Component } from '@angular/core';
import { Earth3DComponent } from '../../components/earth-3d/earth-3d.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, Earth3DComponent]
})
export class HomeComponent {

}
