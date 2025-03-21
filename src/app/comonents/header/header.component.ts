import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  navigateToHome(): void {
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']);
    }
  }
  navigateToNewTask(): void {
    this.router.navigate(['/new-task']);
  }
}
