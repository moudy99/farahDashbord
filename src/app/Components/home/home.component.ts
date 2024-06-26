import { Component, OnInit } from '@angular/core';
import confetti from 'canvas-confetti'; // Import confetti correctly
import Typed from 'typed.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  UserDashboardName: string | any;

  ngOnInit(): void {
    this.UserDashboardName =
      localStorage.getItem('username') || sessionStorage.getItem('username');

    var options = {
      strings: [
        'مرحبا بك في لوحة تحكم موقع فرح',
        'نسهل عليك إدارة خدماتك، يمكنك إضافة خدمات جديدة، متابعة الطلبات التي تتلقاها، والتواصل مع الدعم الفني للحصول على المساعدة التي تحتاجها.',
      ],
      typeSpeed: 50,
      backSpeed: 40,
      backDelay: 1000,
      loop: true,
      showCursor: false,
    };

    // Initialize Typed.js
    var typed = new Typed('.typed-message', options);
    var confettiShown = sessionStorage.getItem('confettiShown');
    if (!confettiShown) {
      // Trigger confetti celebration
      this.showConfetti();
      sessionStorage.setItem('confettiShown', 'true');
    }
  }

  showConfetti(): void {
    var end = Date.now() + 3 * 1000;

    // go Buckeyes!
    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  // showConfetti(): void {
  //   var count = 900;
  //   var defaults = {
  //     origin: { y: 0.3 },
  //   };

  //   function fire(particleRatio: any, opts: any) {
  //     confetti({
  //       ...defaults,
  //       ...opts,
  //       particleCount: Math.floor(count * particleRatio),
  //     });
  //   }

  //   fire(0.25, {
  //     spread: 26,
  //     startVelocity: 55,
  //   });
  //   fire(0.2, {
  //     spread: 60,
  //   });
  //   fire(0.35, {
  //     spread: 100,
  //     decay: 0.91,
  //     scalar: 0.8,
  //   });
  //   fire(0.1, {
  //     spread: 120,
  //     startVelocity: 25,
  //     decay: 0.92,
  //     scalar: 1.2,
  //   });
  //   fire(0.1, {
  //     spread: 120,
  //     startVelocity: 45,
  //   });
  // }
}
