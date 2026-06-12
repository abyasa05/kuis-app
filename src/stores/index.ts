import { QuizPayloadItems } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware"

interface QuizStore {
    questions: QuizPayloadItems[] | null,
    setQuestions: (value: QuizPayloadItems[] | null) => void,

    answers: (string | null)[],
    setAnswer: (index: number, value: string) => void,
    clearAnswers: () => void,

    isActive: boolean,
    setIsActive: (value: boolean) => void,

    currentNum: number,
    setCurrentNum: (value: number) => void,

    hasHydrated: boolean,
    setHydrated: (value: boolean) => void,

    isSubmitted: boolean,
    setSubmitted: (value: boolean) => void,
}

export const useQuizStore = create<QuizStore>()( 
    persist(
        (set) => ({
            questions: null,
            answers: Array(10).fill(null),
            isActive: false,
            currentNum: 0,
            hasHydrated: false,
            isSubmitted: false,

            setAnswer: (index, value) => set((state) => {
                const newAnswers = [...state.answers];

                const oldAnswer = newAnswers[index];
                if (value !== oldAnswer) {
                    newAnswers[index] = value;
                };

                return {
                    answers: newAnswers
                }
            }),
            clearAnswers: () => set({ answers: Array(10).fill(null) }),
            setQuestions: (value) => set({ questions: value }),
            setCurrentNum: (value) => set({ currentNum: value }),
            setHydrated: (value) => set({ hasHydrated: value }),
            setIsActive: (value) => set({ isActive: value }),
            setSubmitted: (value) => set({ isSubmitted: value }),
        }),
        {
            name: "quiz-storage",
            onRehydrateStorage: () => {
                return((state) => {
                    state?.setHydrated(true);
                })
            }
        },
    ),
)