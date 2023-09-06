/* eslint-disable no-unused-vars */
export enum KFK_CLIENTS {
  BOOK_CLIENT = "BOOK_CLIENT",
  ORDER_CLIENT = "ORDER_CLIENT",
  AUTH_CLIENT = "AUTH_CLIENT",
  NOTIFICATION_CLIENT = "NOTIFICATION_CLIENT"
}

export enum KFK_GROUPS {
  BOOK_GROUP = "BOOK_GROUP",
  ORDER_GROUP = "ORDER_GROUP",
  NOTIFICATION_GROUP = "NOTIFICATION_GROUP",
  AUTH_GROUP = "AUTH_GROUP"
}

export enum KFK_NAMES {
  ORDER_SERVICE = "ORDER_SERVICE",
  PAYMENT_SERVICE = "PAYMENT_SERVICE",
  AUTH_SERVICE = "AUTH_SERVICE",
  NOTIFICATION_SERVICE = "NOTIFICATION_SERVICE"
}

export enum PaymentEvents {
  PAYMENT_ORDER_CREATION = "payment.service.payment-order-creation"
}

export enum NotificationEvents {
  NOTIFICATION_USER_REGISTRATION = "notification.service.notification-user-registration"
}