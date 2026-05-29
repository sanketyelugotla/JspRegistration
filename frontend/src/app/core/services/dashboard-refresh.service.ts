import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DashboardRefreshService {
    private refreshTickSignal = signal(0);

    readonly refreshTick = this.refreshTickSignal.asReadonly();

    triggerRefresh(): void {
        this.refreshTickSignal.update((value) => value + 1);
    }
}
