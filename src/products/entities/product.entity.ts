import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProducImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example: '0c3c6ba6-0abc-44bd-95de-34f0514e2866',
        description: 'Product unique ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string

    @ApiProperty({
        example: 'T-shirt teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title:string

    @ApiProperty({
        example: 1200,
        description: 'Product price',
        default: 0
    })
    @Column('float', {
        default: 0
    })
    price: number
    
    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @ApiProperty()
    @Column({
        type: 'text',
        unique: true
    })
    slug: string

    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock: number

    @ApiProperty()
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty()
    @Column('text')
    gender: string

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    //eager: true -> allow that each query we can retrieve this property inside the query

    @ApiProperty()
    @OneToMany(
        () => ProducImage,
        productImage => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    images?: ProducImage[]

    @ManyToOne(
        () => User,
        user => user.product,
        { eager:true }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title
        }

        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", '')
    }
}
