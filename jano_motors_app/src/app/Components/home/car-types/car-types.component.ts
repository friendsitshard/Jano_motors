import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-car-types',
  standalone: true,
  imports: [],
  templateUrl: './car-types.component.html',
  styleUrl: './car-types.component.scss'
})
export class CarTypesComponent{
  @Input() carTypesInfo: any;

}
