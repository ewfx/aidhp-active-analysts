import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  isLoggedIn = false;
  userEmail = '';
  isClient = false;

  ngOnInit() {
    this.isClient = true; // Ensures the textarea only loads on the client
  }

  newMessage: string = '';
  messages: { text: string, isUser: boolean }[] = [];
  chatHistory: string[] = [];

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, isUser: true });
      this.chatHistory.push(this.newMessage);
      this.newMessage = '';
  
      setTimeout(() => {
        this.messages.push({ text: 'I am still learning! 😊', isUser: false });
      }, 1000);
    }
  }

  showNotifications = false;
  notifications = [
    { message: 'New message from Alex' },
    { message: 'Reminder: Meeting at 3 PM' },
    { message: 'System Update Available' }
  ];

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  logout() {
    this.isLoggedIn = false;
    this.userEmail = '';
    this.email = '';
    this.password = '';
  }
  

  loadChat(chat: string) {
    this.messages = [{ text: chat, isUser: true }];
  }

  startNewChat() {
    this.messages = [];
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
