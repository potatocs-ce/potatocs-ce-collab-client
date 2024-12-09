import { Injectable } from '@angular/core';
import moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  dateFormatting(date: Date, mode?: string) {
    const addDay = new Date().getTimezoneOffset() < 0 ? 0 : 1;

    if (mode === 'fromNow') {
      return moment(date).fromNow();
    } else if (mode === 'dateTime') {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    } else if (mode === 'dateOnly') {
      return moment(date).format('YYYY.MM.DD');
    } else if (mode === 'dateOnlyKor') {
      return moment(date).format('ll dddd');
    } else if (mode === 'timeOnly') {
      return moment(date).locale('en').format('hh:mm a');
    } else if (mode === 'chatDate') {
      return moment(date).format('YYYY-MM-DD HH:mm');
    } else if (mode === 'timeZone') {
      return moment(date).add(addDay, 'days').format('YYYY-MM-DD');
    } else if (mode === 'searchStartDate') {
      return moment(date).startOf('month').add(addDay, 'days').format('YYYY-MM-DD');
    }

    // default: full // 세네갈 시간은 utc+0
    return moment(date).format('YYYY-MM-DD');

  }

  checkArray(data: any, arrayData: any) {
    const isInArray = arrayData.includes(data._id);
    if (isInArray) {
      return data.isAdmin = true;
    } else {
      return data.isAdmin = false;
    }
  }
}
