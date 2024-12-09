import {EventData} from './event-data';

export interface RecordData {
  event?: EventData[];
  audio?: any;
  canvasSize?: {
	  w: number,
	  h: number
  };
  showBg?: boolean;
}
