import { QuizItems } from "@/types";
import { create } from "zustand";

interface QuizStore {
    questions: QuizItems[] | null,
    answers: (string | null)[],
    isActive: boolean,
    currentNum: number,
    setQuestions: (value: QuizItems[]) => void,
    setAnswers: (index: number, value: string) => void,
    setCurrentNum: (value: number) => void,
}

const useQuizStore = create<QuizStore>((set) => ({
    questions: null,
    answers: Array(10).fill(null),
    isActive: false,
    currentNum: 0,

    setQuestions: (value) => set((state) =>
        state.questions ? state : { questions: value }
    ),

    setAnswers: (index, value) => set((state) => {
        const newAnswers = [...state.answers];

        const oldAnswer = newAnswers[index];
        if (value !== oldAnswer) {
            newAnswers[index] = value;
        };

        return {
            answers: newAnswers
        }
    }),

    setCurrentNum: (value) => set((state) => 
        state.currentNum ? state : { currentNum: value }
    )
}))