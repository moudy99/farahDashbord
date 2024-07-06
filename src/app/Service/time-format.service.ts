import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeFormatService {
  formatingTime(postDate: Date): string {
    const currentDate = new Date();
    const postDateTime = new Date(postDate);
    const timeDifference = currentDate.getTime() - postDateTime.getTime();

    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    const hoursDifference = Math.floor(timeDifference / (1000 * 3600));
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (daysDifference < 1) {
      if (hoursDifference < 1) {
        if (minutesDifference < 1) {
          return 'الآن';
        } else if (minutesDifference === 1) {
          return '1 دقيقة';
        } else {
          return `${minutesDifference} دقائق`;
        }
      } else if (hoursDifference === 1) {
        return '1 ساعة';
      } else {
        return `${hoursDifference} ساعات`;
      }
    } else if (daysDifference === 1) {
      return '1 يوم';
    } else if (daysDifference < 7) {
      return `${daysDifference} أيام`;
    } else {
      return postDateTime.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }
}
