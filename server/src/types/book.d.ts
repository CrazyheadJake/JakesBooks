import { ObjectId } from "mongodb";

export interface Book {
    _id?: ObjectId
    userId: ObjectId
    cover: string
    title: string
    author: string
    genre: string
    series?: string
    seriesNumber?: number
    rating: number
    date: Date
    review: string
}
