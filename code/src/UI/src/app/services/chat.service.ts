import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chats: { id: number; messages: { text: string; isUser: boolean }[] }[] = [];
  private chatCounter = 1;
  private apiUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) {
    // Initialize with a dummy chat history
    this.chats.push({
      id: this.chatCounter,
      messages: [
        { text: "Hello! How can I assist you today?", isUser: false },
        { text: "Can you help me with my task?", isUser: true },
      ]
    });
  }

  // Get chat history (list of chats)
  getChatHistory() {
    return this.chats.map(chat => ({
      id: chat.id,
      summary: chat.messages.length ? chat.messages[0].text : 'New Chat'
    }));
  }

  // Get messages for a specific chat
  getMessages(chatId: number) {
    const chat = this.chats.find(c => c.id === chatId);
    return chat ? chat.messages : [];
  }

  // Start a new chat
  createNewChat() {
    this.chatCounter++;
    this.chats.push({ id: this.chatCounter, messages: [] });
    return this.chatCounter;
  }

  // Add message to a specific chat
  addMessage(chatId: number, message: { text: string; isUser: boolean }) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.messages.push(message);
    }
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'chat', data);
  }
}
