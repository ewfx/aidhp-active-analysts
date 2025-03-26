import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: string[] = [
    "📢 System update available!",
    "📩 You have a new message from John.",
    "🔔 Your report is ready for review.",
    "🎉 Congratulations! You won a reward."
  ];

  constructor() { }

  // Add a new notification
  addNotification(message: string) {
    this.notifications.push(message);
  }

  // Get all notifications
  getNotifications(): string[] {
    return this.notifications;
  }

  // Clear all notifications
  clearNotifications() {
    this.notifications = [];
  }
}
