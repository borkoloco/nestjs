import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { Report } from 'src/reports/reports.entity';
// import { Exclude } from 'class-transformer';

// console.log(Report);

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  // @Exclude()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id', this.id);
  }
}
