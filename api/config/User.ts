import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column({ select: false })
    password!: string; // In a real app, store hashed passwords!

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Consider adding fields like email: @Column({ unique: true }) email!: string;
}