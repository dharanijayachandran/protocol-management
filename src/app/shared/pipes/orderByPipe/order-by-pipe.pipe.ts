import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByPipe'
})
export class OrderByPipePipe implements PipeTransform {

  transform(value: any[], property: string): any[] {
    if (property && value){
      return value.sort((a: any, b: any) => a[property].localeCompare(b[property]));
  }else{
      return value;
  }
  }

}
