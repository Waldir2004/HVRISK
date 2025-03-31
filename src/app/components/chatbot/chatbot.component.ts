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
  chatHistory: { sender: string; text: string }[] = [];
  isChatOpen: boolean = false;

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (!this.message.trim()) return;

    // Agregar el mensaje del usuario al historial
    this.chatHistory.push({ sender: 'user', text: this.message });

    const payload = { message: this.message };
    this.http.post<any>('http://localhost:5005/webhooks/rest/webhook', payload).subscribe(
      (res) => {
        if (res && res.length > 0) {
          res.forEach((response: any) => {
            this.chatHistory.push({ sender: 'bot', text: response.text });
          });
        }
      },
      (error) => {
        console.error('Error:', error);
        this.chatHistory.push({ sender: 'bot', text: 'Hubo un error al conectarse con el chatbot.' });
      }
    );

    this.message = ''; // Limpiar la caja de texto
  }
}
