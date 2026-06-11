import { QuizPayloadItems } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware"

interface QuizStore {
    questions: QuizPayloadItems[] | null,
    answers: (string | null)[],
    isActive: boolean,
    currentNum: number,
    hasHydrated: boolean,
    setQuestions: (value: QuizPayloadItems[]) => void,
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
            ),

            setHydrated: (value) => set((state) => 
                state.hasHydrated ? state : { hasHydrated: value }
            ),
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