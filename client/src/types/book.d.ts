export interface Book {
    _id?: string
    userId: string
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