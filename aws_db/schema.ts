import { boolean, date, int, mysqlTable, serial, text, time, varchar } from 'drizzle-orm/mysql-core';

export const userAccount = mysqlTable('userAccount', {
  UserID: serial('UserID').primaryKey(), // This defines the primary key
  Username: varchar('Username', { length: 100 }),
  Password: varchar('Password', { length: 100 }),
  Email: varchar('Email', { length: 100 }),
  Role: varchar('Role', { length: 50 }),
  Status: varchar('Status', { length: 50 }),
  FailLogin: int('FailLogin'),
  IsLocked: boolean('IsLocked'),
});

export const Room = mysqlTable('Room', {
  RoomID: serial('RoomID').primaryKey(), // This defines the primary key
  RoomName: varchar('RoomName', { length: 100 }),
  Pax: int('Pax'),
  Type: varchar('Type', { length: 50 }),
  Status: varchar('Status', { length: 50 }),
  imagename: varchar('imagename', { length: 50 }),
  BGP: varchar('BGP', { length: 50 }),
});

export const Review = mysqlTable('Review', {
  ReviewID: serial('ReviewID').primaryKey(), // This defines the primary key
  RoomID: int('RoomID'),
  UserID: int('UserID'),
  Feedback: text('Feedback'),
});

export const Favourite = mysqlTable('Favourite', {
  UserID: int('UserID'),
  RoomID: int('RoomID'),
  // No primary key, but this combination could be considered a composite key
});

export const Booking = mysqlTable('Booking', {
  BookingID: serial('BookingID').primaryKey(), // This defines the primary key
  RoomID: int('RoomID'),
  UserID: int('UserID'),
  BookingDate: date('BookingDate'),
  BookingTime: time('BookingTime'),
  RoomPin: varchar('RoomPin', { length: 10 }),
  BGP: varchar('BGP', { length: 50 }),
});
