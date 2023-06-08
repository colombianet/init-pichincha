import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'small'
})
export class SlicePipe implements PipeTransform {
  transform(value: string, start: number, end?: number): string {
    let smallString = value.slice(start, end);
    smallString = smallString.length >= 40 ? smallString + '...' : smallString;
    return smallString;
  }
}
