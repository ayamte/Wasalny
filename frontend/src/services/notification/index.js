// Export du composant principal  
export { default as NotificationsPage } from './pages/notifications/notifications';  
  
// Export du service API  
export { default as notificationService } from './notificationService';  
  
// Export des types (optionnel, pour TypeScript)  
export const NotificationTypes = {  
  PAYMENT: 'PAYMENT',  
  SUBSCRIPTION: 'SUBSCRIPTION',  
  TRIP: 'TRIP',  
  SYSTEM: 'SYSTEM'  
};