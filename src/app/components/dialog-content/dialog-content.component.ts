import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  templateUrl: './dialog-content.component.html',
  imports: [CommonModule],
  styleUrls: ['./dialog-content.component.scss']
})
export class DialogContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string, recomendaciones: string[] }) {}

  onClose(): void {
    this.dialogRef.close();
  }
}