import React, { useState, ChangeEvent, FormEvent } from 'react';
import '../styles/globals.css';
import '../styles/tailwind.css';
import Image from 'next/image';
import Link from 'next/link';

const sampleQuestions: { question: string; choices: string[]; selectedAnswer: string; correctAnswer: string; type: string; isCorrect?: boolean }[] = [
    {
        question: "What is the capital of France?",
        choices: ["A) Paris", "B) London", "C) Berlin", "D) Madrid"],
        selectedAnswer: "",
        correctAnswer: "A) Paris",
        type: "checkbox",
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        choices: ["A) Charles Dickens", "B) Jane Austen", "C) William Shakespeare", "D) F. Scott Fitzgerald"],
        selectedAnswer: "",
        correctAnswer: "C) William Shakespeare",
        type: "checkbox",
    },
    {
        question: "What is the chemical symbol for gold?",
        choices: ["A) Ag", "B) Fe", "C) Au", "D) Hg"],
        selectedAnswer: "",
        correctAnswer: "C) Au",
        type: "radio",
    },
    {
        question: "What is the largest planet in our solar system?",
        choices: ["A) Earth", "B) Mars", "C) Jupiter", "D) Saturn"],
        selectedAnswer: "",
        correctAnswer: "C) Jupiter",
        type: "radio",
    },
    {
        question: "How many continents are there on Earth?",
        choices: ["A) 5", "B) 6", "C) 7", "D) 8"],
        selectedAnswer: "",
        correctAnswer: "C) 7",
        type: "radio",
    },
];

function ExamifyPage() {


    // const [formData, setFormData] = useState<Record<string, string>>({});
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, boolean>>({});
    const [selectedRadio, setSelectedRadio] = useState<Record<string, string>>({});
    // const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [points, setPoints] = useState(0);

    // const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    const handleRadioChange = (index: number, answer: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedRadio({ ...selectedRadio, [name]: value });
        sampleQuestions[index].selectedAnswer = answer;
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedCheckboxes({ ...selectedCheckboxes, [name]: checked });
    };

    // const toggleAdditionalFields = () => {
    //     setShowAdditionalFields(!showAdditionalFields);
    // };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Combine formData, selectedRadio, and selectedCheckboxes to include all user input
        let data = postResultToBackend(sampleQuestions);
        setPoints(data.point);
        sampleQuestions.forEach((q, i) => {
            console.log(`${data.detail[i]} ${i}`)
            q.isCorrect = data.detail[i];
        })
        setIsSubmitted(true); // Set the isSubmitted state to true after successful submission.
    };

    // Fake post
    const postResultToBackend = (questions: {
        question: string;
        choices: string[];
        selectedAnswer: string;
        correctAnswer: string;
        type: string;
    }[]) => {
        let point = 0;
        const detail: boolean[] = [];
        questions.forEach(q => {
            q.correctAnswer == q.selectedAnswer && point++;
            detail.push(q.correctAnswer == q.selectedAnswer);
        })
        return { point, detail };
    }

    return (
        <div className="container mx-auto p-4 px-[25%] bg-slate-300 min-h-screen">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex py-6 pb-12">
                <Link href="../">
                    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                        Go to&nbsp;
                        <code className="font-mono font-bold">Examify</code>
                        &nbsp;home page!
                    </p>
                </Link>

                <div className="fixed bottom-0 left-0 flex h-48 justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href=""
                    >
                        By{' '}
                        <Image
                            src="/group-removebg.png"
                            alt="Group Logo"
                            className="dark:invert"
                            width={100}
                            height={24}
                            priority
                        />
                    </a>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8 p-4">
                {sampleQuestions.map((question, index) => (
                    <div>
                        {question.type === "checkbox" && (
                            <div>
                                <label className="block font-medium text-lg text-gray-700 tracking-wider">{index + 1}. {question.question}:</label>
                                <div className="">
                                    {question.choices.map((choise, i) => (
                                        <div className="flex items-center p-2">
                                            <input
                                                type="checkbox"
                                                id={`checkboxOption${i + 1}`}
                                                name={`cbOption${index + 1}`}
                                                checked={selectedCheckboxes[`checkboxOption${i + 1}`]}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label htmlFor={`checkboxOption${i + 1}`} className="ml-2 tracking-wider">
                                                {choise}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {question.type === "radio" && (
                            <div>
                                <label className={`block font-medium text-lg text-gray-700 tracking-wider ${question.isCorrect == true && 'text-green-600'} ${question.isCorrect == false && 'text-red-600'}`}>{index + 1}. {question.question}:</label>
                                {question.choices.map((choise, i) => (
                                    <div className={`p-2`}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id={`option${i + 1}`}
                                                name={`radioAnswer${index + 1}`}
                                                value={choise}
                                                checked={selectedRadio[`radioAnswer${index + 1}`] === choise}
                                                onChange={handleRadioChange(index, choise)}
                                            />
                                            <label htmlFor={`option${i + 1}`} className="ml-2 tracking-wider">
                                                {choise}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isSubmitted && (
                    <div className="bg-green-100 p-4 text-green-700 rounded mt-4">
                        Submitted successfully! Your point is: {`${points}/${sampleQuestions.length}`}
                    </div>
                )}
                <div>
                    <button type="submit" className="bg-blue-500 text-white p-3 rounded">
                        Submit
                    </button>
                </div>

            </form>
        </div>
    );
}

export default ExamifyPage;
