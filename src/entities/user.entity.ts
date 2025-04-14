import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CalendarEvent } from './calendar-event.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => CalendarEvent, event => event.user)
  calendarEvents: CalendarEvent[];
} 