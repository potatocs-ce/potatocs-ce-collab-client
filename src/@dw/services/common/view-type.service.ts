import { Injectable } from '@angular/core';

export interface ViewType {
  annual_leave: string,
  rollover: string,
  sick_leave: string,
  replacement_leave: string
}

@Injectable({
  providedIn: 'root'
})
export abstract class ViewTypeService  {

	constructor() { }

	abstract getViewType():ViewType;
}
