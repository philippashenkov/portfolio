import { Component, OnInit, OnDestroy } from '@angular/core';
import { Earth3DComponent } from "../../components/earth-3d/earth-3d.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root', // Или ваш селектор компонента
  templateUrl: './home.component.html', // Или ваш путь к шаблону
  styleUrls: ['./home.component.scss'] // Или ваш путь к стилям
  ,
  imports: [CommonModule, RouterModule, Earth3DComponent],
  standalone: true
})
export class HomeComponent implements OnInit, OnDestroy {

  kyivTime: string = '';
  kyivDate: string = '';
  private intervalId: any;

  ngOnInit(): void {
    this.updateKyivTime(); // Обновляем при инициализации
    // Обновляем каждую секунду для точного времени
    this.intervalId = setInterval(() => {
      this.updateKyivTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Очищаем интервал при уничтожении компонента, чтобы избежать утечек памяти
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateKyivTime(): void {
    const now = new Date(); // Получаем текущее время UTC

    // Опции для форматирования времени (часы, минуты, AM/PM)
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Для AM/PM
      timeZone: 'Europe/Kiev' // Указываем часовой пояс Киев
    };

    // Опции для форматирования даты (день недели, месяц, день, год)
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Например, "Wednesday"
      month: 'long',   // Например, "July"
      day: 'numeric',  // Например, "30"
      year: 'numeric', // Например, "2025"
      timeZone: 'Europe/Kiev' // Указываем часовой пояс Киев
    };

    // Форматируем время
    this.kyivTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
    // Форматируем дату
    this.kyivDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
  }
}