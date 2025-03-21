import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'georgianDate',
  standalone: true,
})
export class GeorgianDatePipe implements PipeTransform {
  private days: { [key: string]: string } = {
    Monday: 'ორშ',
    Tuesday: 'სამ',
    Wednesday: 'ოთხ',
    Thursday: 'ხუთ',
    Friday: 'პარ',
    Saturday: 'შაბ',
    Sunday: 'კვი',
  };

  private months: { [key: string]: string } = {
    January: 'იანვ',
    February: 'თებ',
    March: 'მარ',
    April: 'აპრ',
    May: 'მაი',
    June: 'ივნ',
    July: 'ივლ',
    August: 'აგვ',
    September: 'სექ',
    October: 'ოქტ',
    November: 'ნოემ',
    December: 'დეკ',
  };

  transform(value: string, format: 'day' | 'month'): string {
    if (!value) return '';

    const date = new Date(value);

    if (format === 'day') {
      const dayName = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
      }).format(date);
      const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(
        date
      );
      const month = new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
      }).format(date);
      const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
        date
      );

      const georgianDay = this.days[dayName] || dayName;

      return `${georgianDay} - ${day}/${month}/${year}`;
    }

    if (format === 'month') {
      const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(
        date
      );
      const monthName = new Intl.DateTimeFormat('en-US', {
        month: 'long',
      }).format(date);
      const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
        date
      );

      const georgianMonth = this.months[monthName] || monthName;

      return `${day} ${georgianMonth}, ${year}`;
    }

    return value;
  }
}
