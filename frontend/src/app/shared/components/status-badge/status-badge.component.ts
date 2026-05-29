import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatus, STATUS_LABELS, STATUS_COLORS } from '../../../core/constants/status.constants';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './status-badge.component.html',
    styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class StatusBadgeComponent {
    @Input({ required: true }) status!: ApplicationStatus;

    getStatusLabel(): string {
        return STATUS_LABELS[this.status] || this.status;
    }

    getBadgeClass(): string {
        const color = STATUS_COLORS[this.status];
        const colorClasses: Record<string, string> = {
            'gray': 'bg-gray-100 text-gray-800',
            'blue': 'bg-blue-100 text-blue-800',
            'orange': 'bg-orange-100 text-orange-800',
            'green': 'bg-green-100 text-green-800',
            'red': 'bg-red-100 text-red-800',
            'yellow': 'bg-yellow-100 text-yellow-800',
        };
        return colorClasses[color] || colorClasses['gray'];
    }
}
