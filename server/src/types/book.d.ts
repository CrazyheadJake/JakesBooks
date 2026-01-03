import { ObjectId } from "mongodb";

export interface Book {
    userId: ObjectId
    title: string
    author: string
    genre: string
    series?: string
    seriesNumber?: number
    rating: number
    date: Date
    review: string
}