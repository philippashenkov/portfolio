import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class AboutComponent {
    title = 'About';
    description = 'This is the about page of the portfolio.';
}