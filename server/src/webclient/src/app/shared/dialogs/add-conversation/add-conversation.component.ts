import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-conversation',
  templateUrl: './add-conversation.component.html',
  styleUrls: ['./add-conversation.component.scss'],
})
export class AddConversationComponent implements OnInit {
  nameControl = new FormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<AddConversationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {
    this.nameControl.setValue(data.name);
  }

  ngOnInit(): void {}

  confirm(): void {
    this.dialogRef.close(this.nameControl.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
