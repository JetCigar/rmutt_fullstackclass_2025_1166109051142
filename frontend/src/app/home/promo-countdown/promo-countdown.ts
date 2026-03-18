import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promo-countdown',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './promo-countdown.html',
  styleUrls: ['../home.css'],
})
export class PromoCountdownComponent implements OnInit, OnDestroy {
  hours = signal('00');
  minutes = signal('00');
  seconds = signal('00');
  private timer: any;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  startCountdown() {
    const target = new Date();
    target.setHours(23, 59, 59);

    const updateTimer = () => {
      const diff = target.getTime() - new Date().getTime();
      if (diff <= 0) { clearInterval(this.timer); return; }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      this.hours.set(h.toString().padStart(2, '0'));
      this.minutes.set(m.toString().padStart(2, '0'));
      this.seconds.set(s.toString().padStart(2, '0'));
    };

    updateTimer();
    this.timer = setInterval(updateTimer, 1000);
  }
}
