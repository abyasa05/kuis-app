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
		const [selectedItem, setSelectedItem] = useState("");

    useEffect(() => {
        if (!questions && hasHydrated) {
          getQuestions();
        }
    }, [hasHydrated]);

    async function getQuestions() {
        try {
					const questions = await getQuizQuestions();
					setQuestions(questions);
					window.alert("Kuis berhasil difetch")
        } catch (error) {
					if (error instanceof Error) {
						window.alert(error.message)
						console.log(error);
					}
        }
    }

		const handleFinish = () => {
			setIsActive(false);
			setQuestions(null);
			router.push('/');
		}

    return (
			<div>
				{
					questions && currentNum && (
						<form>
							<h3>{ questions[0].question }</h3>

							<div className="flex">
								{ questions[0].incorrect_answers.map((option) => (
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
					)
				}

				<button onClick={handleFinish}>
					Finish
				</button>
			</div>
)}