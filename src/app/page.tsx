'use client'

import { useQuizStore } from "@/stores"
import { useRouter, redirect } from "next/navigation";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { status, data: session } = useSession();

  const isActive = useQuizStore((state) => state.isActive);
  const setIsActive = useQuizStore((state) => state.setIsActive);
  const setCurrentNum = useQuizStore((state) => state.setCurrentNum);
  const clearAnswers = useQuizStore((state) => state.clearAnswers);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const hasHydrated = useQuizStore((state) => state.hasHydrated);
  const questions = useQuizStore((state) => state.questions);

  useEffect(() => {
    if (status === "unauthenticated") {
        router.replace("/login");
    }
  }, [status, router])

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
    <div className="flex flex-col gap-3">
      <button onClick={() => signOut()}>
        Logout
      </button>
      <button onClick={handleAttemptQuiz}>
        { isActive ? 'Resume Quiz' : 'Attempt Quiz' }
      </button>
    </div>
  );
}
