import {Component} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';

/**
 * @title Paginator
 */
@Component({
  selector: 'paginator',
  templateUrl: 'paginator.component.html',
  imports: [MatPaginatorModule],
  standalone: true,
})
export class Paginator {}