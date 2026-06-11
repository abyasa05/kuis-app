export interface QuizPayload {
    results: QuizPayloadItems[]
}

export interface QuizPayloadItems {
    type: string,
    difficulty: string,
    category: string,
    question: string,
    correct_answer: string,
    incorrect_answers: string[]
}