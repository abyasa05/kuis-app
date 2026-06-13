import { QuizPayload, QuizPayloadItems } from "@/components/types";

const BASE_URL = 'https://opentdb.com/api.php'

export async function getQuizQuestions(): Promise<QuizPayloadItems[]> {
    const response = await fetch(`${BASE_URL}?amount=10&category=15&type=multiple`, {
        method: 'GET',
    })

    if (!response.ok){
        throw new Error(`Status: ${response.status}`)
    }

    const result = await response.json();

    return formatQuizOptions(result);
}

// Use incorrect_answer array as options
// Insert correct answer in random index
function formatQuizOptions(payload: QuizPayload): QuizPayloadItems[] {
    const questions: QuizPayloadItems[] = payload.results;

    questions.forEach((question: QuizPayloadItems) => {
        const randomIndex = Math.floor(Math.random() * (4))
        question.incorrect_answers.splice(randomIndex, 0, question.correct_answer)
    });

    return questions;
}