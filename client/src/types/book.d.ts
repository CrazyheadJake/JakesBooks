export interface Book {
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