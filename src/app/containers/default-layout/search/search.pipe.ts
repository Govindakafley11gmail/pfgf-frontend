import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(list: any[], filterText: string): any {
    console.log(list);
    if (!list) {
      return [];
    }
    if (!filterText || !list) {
      return list;
    }

    return list.filter((singleItem) =>
    console.log(singleItem)
      // singleItem[field].toLowerCase().includes(value.toLowerCase())

    );
  }
}
