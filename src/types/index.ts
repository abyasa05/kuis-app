export interface QuizPayload {
    results: QuizItems[]
}

export interface QuizItems {
    type: string,
    difficulty: string,
    category: string,
    question: string,
    correct_answer: string,
    incorrect_answer: string[]
}