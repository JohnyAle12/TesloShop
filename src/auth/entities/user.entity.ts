import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column('text')
    name: string

    @Column('text')
    lastname: string

    @Column('text', {
        unique: true
    })
    email: string

    @Column('text')
    password: string

    @Column('bool', {
        default: true
    })
    isActive: boolean

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]
}
