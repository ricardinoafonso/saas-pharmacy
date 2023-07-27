import  Dayjs  from "dayjs";
import  utc from 'dayjs/plugin/utc'
import { IDateProvider } from "../dto";  
import { injectable } from "tsyringe";


Dayjs.extend(utc)

@injectable()
export class DaysjsProvider  implements IDateProvider{
    compareInHours(start_date: Date, end_date: Date): number {
       const end_date_utc = this.convertToUTC(end_date)
       const start_date_utc = this.convertToUTC(start_date)

       return Dayjs(end_date_utc).diff(start_date_utc,'hours')
    }
    convertToUTC(date: Date): string {
        return Dayjs(date).local().format()
    }
    dateNow(): Date {
       return Dayjs().toDate()
    }
    compareInDays(start_date: Date, end_date: Date): number {
       const end_date_utc = this.convertToUTC(end_date)
       const start_date_utc = this.convertToUTC(start_date)
       return Dayjs(end_date_utc).diff(start_date_utc,'days')
    }
    addDays(days: number): Date {
       return Dayjs().add(days, 'days').toDate()
    }
    addHours(hours: number): Date {
       return Dayjs().add(hours, 'hours').toDate()
    }
    compareIfBefore(start_date: Date, end_date: Date): boolean {
        return Dayjs(start_date).isBefore(end_date)
    }

}