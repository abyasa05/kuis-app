'use client'
import { getQuizQuestions } from "@/utils"
import { useQuizStore } from "@/stores"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Quiz() {
	const router = useRouter();
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
	const hasHydrated = useQuizStore((state) => state.hasHydrated);
	const currentNum = useQuizStore((state) => state.currentNum);
	const isActive = useQuizStore((state) => state.isActive);
	const setIsActive = useQuizStore((state) => state.setIsActive);
	const setcurrentNum = useQuizStore((state) => state.setCurrentNum);
	const answers = useQuizStore((state) => state.answers)
	const setAnswer = useQuizStore((state) => state.setAnswer);
  const clearAnswers = useQuizStore((state) => state.clearAnswers)
  const setSubmitted = useQuizStore((state) => state.setSubmitted);
	const [selectedItem, setSelectedItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasHydrated) {
      if (!isActive) {
        router.push('/');
      }

      if (!questions) {
        getQuestions();
      }
    }
  }, [hasHydrated]);

  useEffect(() => {
    const currentAnswer = answers[currentNum - 1];
    if (currentAnswer) {
      setSelectedItem(currentAnswer);
    }
  }, [currentNum]);

  async function getQuestions() {
    try {
      setIsLoading(true);
      const questions = await getQuizQuestions();
      setQuestions(questions);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        window.alert(error.message)
        console.log(error);
      }
    }
  }

	const handleFinish = () => {
    saveSelection();
    const confirm = window.confirm("Submit quiz?")
    if (!confirm) {
      return;
    }

		setIsActive(false);
		setQuestions(null);
    clearAnswers();
		router.push('/');
	}

  function saveSelection() {
    if (selectedItem !== "" && selectedItem !== answers[currentNum - 1]){
			setAnswer(currentNum - 1, selectedItem);
		}
  }

	const handleChangePage = (direction: string) => {
    saveSelection();
    setSelectedItem("");
		direction === 'back' ? setcurrentNum(currentNum - 1) : setcurrentNum(currentNum + 1);
	}

  return (
    <div>
      { isLoading ? (
        <div>
          Loading questions...
        </div>
      ) : (
        <div>
          { questions && currentNum && (
              <div>
                <div className="flex justify-between">
                  <h2>
                    No. { currentNum }/10
                  </h2>
                  <button onClick={handleFinish}>
                    Finish
                  </button>
                </div>
                <form>
                  <h3>{ questions[currentNum - 1].question }</h3>

                  <div className="flex flex-col">
                    { questions[currentNum - 1].incorrect_answers.map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          name="option"
                          value={option}
                          checked={selectedItem === option}
                          onChange={(e) => setSelectedItem(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </form>
                <p>currently selected: {selectedItem}</p>
              </div>
            )
          }

          <div className="flex justify-between">
            { currentNum > 1 && (
              <button onClick={() => handleChangePage('back')}>
                Previous
              </button>
            )}
            { currentNum < 10 ? (
              <button onClick={() => handleChangePage('front')}>
                Next
              </button>
            ) : (
              <button onClick={handleFinish}>
                Finish
              </button>
            )}
          </div>

          <div className="flex flex-col">
            { answers.map((ans, index) => (
              <p key={index}>{index + 1}. {ans}</p>
            ))}
          </div>
        </div>
      ) }
    </div>
  )
}