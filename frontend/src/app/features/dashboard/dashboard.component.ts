import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardComponent implements OnInit {
    private router = inject(Router);

    ngOnInit(): void {
        console.log('Dashboard initialized');
    }

    navigateToApplication(): void {
        this.router.navigate(['/app/application/register']);
    }
}
