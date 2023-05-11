import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddConversationComponent } from '../add-conversation/add-conversation.component';
import { ConversationMessageDto } from 'src/app/openapi/model/models';

@Component({
  selector: 'app-edit-message',
  templateUrl: './edit-message.component.html',
  styleUrls: ['./edit-message.component.scss'],
})
export class EditMessageComponent {

  text: string;

  constructor(
    public dialogRef: MatDialogRef<AddConversationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: ConversationMessageDto }
  ) {

    this.text = this.data.message.text;
  }

  confirm(): void {
    this.dialogRef.close(this.text);
  }
}
