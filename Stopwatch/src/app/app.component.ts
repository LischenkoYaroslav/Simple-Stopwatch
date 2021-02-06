import { Component } from '@angular/core';
import { interval, Subscription, timer } from "rxjs";

export class Stopwatch {
  constructor(public hours: number, public minutes: number, public seconds: number) { }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stopwatch';

  //Об'єкт з значеннями секундоміра, які будуть виводитись користовачу.
  stopwatchValues: Stopwatch = {
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  //Ініціалізація потоку, на який буде здійснюватись підписка.
  private interval$ = interval(1000);
  //Властивість, в якій буде зберігатись підписка на потік.
  private subscription: Subscription | undefined;
  //Властивість, опираючись на яку користувачеві буде відображатись або кнопка start ,або кнопка stop.
  public stopWatchIsStarted: boolean = false;

  //Метод для кнопки start.
  start() {
    this.stopWatchIsStarted = true;
    this.subscription = this.interval$.subscribe(() => {
      if (this.stopwatchValues.seconds < 59) {
        this.stopwatchValues.seconds++
      } else {
        this.stopwatchValues.seconds = 0
        if (this.stopwatchValues.minutes < 59) {
          this.stopwatchValues.minutes++
        } else {
          this.stopwatchValues.minutes = 0;
          this.stopwatchValues.hours++
        }
      }
    })
  }

  //Метод для кнопки stop.
  stop() {
    this.stopWatchIsStarted = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.stopwatchValues.seconds = 0;
      this.stopwatchValues.minutes = 0;
      this.stopwatchValues.hours = 0;
    }
  }

  //Метод для кнопки reset.
  reset() {
    if (this.stopWatchIsStarted) {
      this.stop();
      this.start();
    }
  }

  //Властивість, в якій буде зберігатись затримка 300 мс для подвійного кліку.
  private delay: Subscription | null = null;

  //Метод для кнопки wait. При першому натиску створює підписку на timer і поміщає її в властивість delay, якщо за 300 мс не здійснено другий натиск на кнопку, то присвоює властивості delay значення null. Якщо ж за 300 мс здійснено подвійний клік - призупиняє таймер.
  wait() {

    if (this.delay && this.subscription) {
      this.stopWatchIsStarted = false;
      this.subscription.unsubscribe();
      this.delay.unsubscribe();
      this.delay = null;

    } else {
      this.delay = timer(300).subscribe(() => {
        this.delay = null;
      });
    }
  }
}
