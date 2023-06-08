import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  @Input() isVisible: boolean = false;
  @Input() btnClose: string = 'Cerrar';
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  closePopup(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
