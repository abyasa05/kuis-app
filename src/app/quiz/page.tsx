'use client'
import { getQuizQuestions } from "@/utils"
import { useQuizStore } from "@/stores"
import { useEffect, useState } from "react"

export default function Quiz() {
    const questions = useQuizStore((state) => state.questions)
    const setQuestions = useQuizStore((state) => state.setQuestions)
		const hasHydrated = useQuizStore((state) => state.hasHydrated)
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

    return (
			<div>
				{
					questions && (
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
			</div>
)}