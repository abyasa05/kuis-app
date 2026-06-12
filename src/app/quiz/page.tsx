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

	const [selectedItem, setSelectedItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isError, setError] = useState(false);

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
        setError(true);
        console.log(error);
      }
    }
  }

  function saveSelection() {
    if (selectedItem !== "" && selectedItem !== answers[currentNum - 1]){
			setAnswer(currentNum - 1, selectedItem);
		}
  }

  function calculateResult() {
    let correct = 0;
    let incorrect = 0;
    
    if (questions){
      const currAnswers = useQuizStore.getState().answers;
      for (let i = 0; i < currAnswers.length; i++){
        if (currAnswers[i]) {
          if (currAnswers[i] == questions[i].correct_answer) {
            correct++;
          } else {
            incorrect++;
          }
        }
      }

      setCorrect(correct);
      setIncorrect(incorrect);
    }
  }

	const handleChangePage = (direction: string) => {
    saveSelection();
    setSelectedItem("");
		direction === 'back' ? setcurrentNum(currentNum - 1) : setcurrentNum(currentNum + 1);
	}

  const handleSubmit = () => {
    const confirm = window.confirm("Submit quiz?")
    if (!confirm) {
      return;
    }

    saveSelection();
    calculateResult();
    setIsActive(false);
    setIsModalOpen(true);
	}

  const handleBack = () => {
    router.push('/');
  }

  return (
    <div>
      { isLoading ? (
        <div>
          { isError ? "Please try again later." : "Loading questions..."}
        </div>
      ) : (
        <div>
          { questions && currentNum && (
              <div>
                <div className="flex justify-between">
                  <h2>
                    No. { currentNum }/10
                  </h2>
                  <button onClick={handleSubmit}>
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

          <div className={`flex ${ currentNum > 1 ? "justify-between" : "justify-end"}`}>
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
              <button onClick={handleSubmit}>
                Finish
              </button>
            )}
          </div>
          
          <div className="flex gap-3.5">
            <div className="flex flex-col">
              <h2>Correct Answers</h2>
              { questions?.map((ans, index) => (
                <p key={index}>{index + 1}. {ans.correct_answer}</p>
              ))}
            </div>
            <div className="flex flex-col">
              <h2>My Answers</h2>
              { answers.map((ans, index) => (
                <p key={index}>{index + 1}. {ans}</p>
              ))}
            </div>
          </div>
          
          {/* RESULT MODAL */}
          { questions && isModalOpen && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 z-50 justify-center items-center">
              <div className="relative bg-white text-black w-[70vw] h-[70vh]">
                <h1>Result</h1>
                <div>
                  <p>Correct answers: { correct }/{ questions.length }</p>
                  <p>Incorrect answers: { incorrect }/{ questions.length }</p>
                  <p>Answered: { correct + incorrect }/{ questions.length }</p>
                </div>
                <button onClick={handleBack}>
                  Back to Home
                </button>
                { answers.map((ans, index) => (
                  <p key={index}>{index + 1}. {ans}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      ) }
    </div>
  )
}