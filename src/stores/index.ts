import { QuizPayloadItems } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware"

interface QuizStore {
    questions: QuizPayloadItems[] | null,
    answers: (string | null)[],
    isActive: boolean,
    currentNum: number,
    hasHydrated: boolean,
    setIsActive: (value: boolean) => void,
    setQuestions: (value: QuizPayloadItems[] | null) => void,
    setAnswers: (index: number, value: string) => void,
    setCurrentNum: (value: number) => void,
    setHydrated: (value: boolean) => void,
}

export const useQuizStore = create<QuizStore>()( 
    persist(
        (set) => ({
            questions: null,
            answers: Array(10).fill(null),
            isActive: false,
            currentNum: 0,
            hasHydrated: false,

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

            setQuestions: (value) => set({ questions: value }),
            setCurrentNum: (value) => set({ currentNum: value }),
            setHydrated: (value) => set({ hasHydrated: value }),
            setIsActive: (value) => set({ isActive: value }),
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