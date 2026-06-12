'use client'
import { useQuizStore } from "@/stores"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const isActive = useQuizStore((state) => state.isActive);
  const setIsActive = useQuizStore((state) => state.setIsActive);
  const setCurrentNum = useQuizStore((state) => state.setCurrentNum);
  const clearAnswers = useQuizStore((state) => state.clearAnswers);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const hasHydrated = useQuizStore((state) => state.hasHydrated);
  const questions = useQuizStore((state) => state.questions);

  useEffect(() => {
    if (hasHydrated) {
      if (!isActive && questions) {
        setQuestions(null);
        clearAnswers();
      }
    }
  }, [hasHydrated]);

  const handleAttemptQuiz = () => {
    if (!isActive) {
      setIsActive(true);
      setCurrentNum(1);
    }
    
    router.push('/quiz');
  }

  return (
    <div>
      <button onClick={handleAttemptQuiz}>
        { isActive ? 'Resume Quiz' : 'Attempt Quiz' }
      </button>
    </div>
  );
}
