import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerService } from '../../services/tracker.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  tracker = inject(TrackerService);

  buys  = computed(() => this.tracker.assets().filter(a => a.signal === 'BUY' || a.signal === 'STRONG_BUY'));
  sells = computed(() => this.tracker.assets().filter(a => a.signal === 'SELL' || a.signal === 'STRONG_SELL'));
  holds = computed(() => this.tracker.assets().filter(a => a.signal === 'HOLD'));

  ngOnInit() {
    this.tracker.loadAll();
  }

  formatPrice(p: number): string {
    if (p >= 1000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (p >= 1)    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return p.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }

  signalClass(signal: string): string {
    return signal.toLowerCase().replace('_', '-');
  }
}
