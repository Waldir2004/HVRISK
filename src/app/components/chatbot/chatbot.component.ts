import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  message: string = '';
  response: string = '';
  isChatOpen: boolean = false;

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    const payload = { message: this.message };
    this.http.post('http://0.0.0.0:5005/webhooks/rest/webhook', payload).subscribe(
      (res: any) => {
        this.response = res.reply;
        this.message = ''; // Clear the input field after sending the message
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}