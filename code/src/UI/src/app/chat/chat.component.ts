import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { ChatService } from '../services/chat.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule], // ✅ Add FormsModule here
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  isLoggedIn = false;
  userEmail = '';
  isClient = false;
  isNotificationOpen = false;
  notifications: string[] = [];
  showNotifications = false;

  currentChatId: number | null = null;
  messages: { text: string; isUser: boolean }[] = [];
  chatHistory: { id: number; summary: string }[] = [];

  newMessage: string = '';

  constructor(private notificationService: NotificationService,private chatService: ChatService) { }

  ngOnInit() {
    this.isClient = true; // Ensures the textarea only loads on the client
    this.notifications = this.notificationService.getNotifications();
    this.chatHistory = this.chatService.getChatHistory();
    if (this.chatHistory.length) {
      this.loadChat(this.chatHistory[0].id); // Load first chat by default
    }
  }

  loadChat(chatId: number) {
    this.currentChatId = chatId;
    this.messages = this.chatService.getMessages(chatId);
  }


  toggleNotifications() {
    this.isNotificationOpen = !this.isNotificationOpen;
    if (this.isNotificationOpen) {
      this.notifications = this.notificationService.getNotifications();
    }
  }

  addTestNotification() {
    this.notificationService.addNotification("🆕 New test notification!");
    this.notifications = this.notificationService.getNotifications();
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
    this.notifications = [];
  }

  // newMessage: string = '';
  // messages: { text: string, isUser: boolean }[] = [];
  // chatHistory: string[] = [];

  sendMessage() {
    if (this.newMessage.trim() && this.currentChatId !== null) {
      this.chatService.addMessage(this.currentChatId, { text: this.newMessage, isUser: true });
      let response = {response : ''};
      this.chatService.postData({ text: this.newMessage}).subscribe({
        next: (data) => {
          response = data;  // Store the response
          this.chatService.addMessage(this.currentChatId??0, { text: response?.response, isUser: false });
        },
        error: (err) => {
          
        }
      });
      let data = this.chatService.postData({ text: this.newMessage});
      //this.chatService.addMessage(this.currentChatId??0, { text: response?.response, isUser: true });
      this.messages = this.chatService.getMessages(this.currentChatId); // Refresh messages
      this.newMessage = '';

      // setTimeout(() => {
      //   this.chatService.addMessage(this.currentChatId ?? 0, { text: "I am still learning! 😊", isUser: false });
      //   this.messages = this.chatService.getMessages(this.currentChatId??0); // Refresh messages
      // }, 1000);
    }
  }


  logout() {
    this.isLoggedIn = false;
    this.userEmail = '';
    this.email = '';
    this.password = '';
  }
  

  // loadChat(chat: string) {
  //   this.messages = [{ text: chat, isUser: true }];
  // }

  startNewChat() {
    const newChatId = this.chatService.createNewChat();
    this.chatHistory = this.chatService.getChatHistory(); // Update history list
    this.loadChat(newChatId);
  }

  email: string = '';
  password: string = '';
  isLoginModalOpen: boolean = false;

  // Open Modal
  openLoginModal() {
    this.isLoginModalOpen = true;
  }

  // Close Modal
  closeLoginModal() {
    this.isLoginModalOpen = false;
  }

  // Login Function
  login() {
    if (this.email && this.password) {
      this.isLoggedIn = true;
      this.userEmail = this.email;
      this.closeLoginModal();
    } else {
      alert('Please enter email and password');
    }
  }
}
