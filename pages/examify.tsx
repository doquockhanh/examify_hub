import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import '../styles/globals.css';
import '../styles/tailwind.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Notification from '../components/Notification';

interface ExamQuestion {
    text: string;
    type: 'radio' | 'checkbox';
    choices: string[];
    correctAnswer: string | string[];
    selectedAnswer: string | string[]
    isCorrect?: boolean;
}

interface Exam {
    title: string;
    questions: ExamQuestion[];
}

const ExamifyPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, boolean>>({});
    const [selectedRadio, setSelectedRadio] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<{ message: string; key: string }[]>([]);
    const [exam, setExam] = useState<Exam>();
    const [result, setResult] = useState<Exam>();

    useEffect(() => {
        if(id) {
            axios
            .get("https://652a0b4155b137ddc83f42e5.mockapi.io/api/v1/Exam/" + id)
            .then((response) => {
                setExam(response.data);
                setResult(response.data);
                setLoading(false);
            })
            .catch(() => {
                showNotification('Error featching the exam!');
                setLoading(false);
            });
        }
    }, [id]);

    const handleRadioChange = (index: number, answer: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedRadio({ ...selectedRadio, [name]: value });
        if(result) {
            result.questions[index].selectedAnswer = answer;
        }
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
        let data = postResultToBackend(result?.questions);
        setPoints(data.point);
        result?.questions.forEach((q, i) => {
            q.isCorrect = data.detail[i];
        })
        setIsSubmitted(true); // Set the isSubmitted state to true after successful submission.
    };

    // Fake post
    const postResultToBackend = (questions: ExamQuestion[] | undefined) => {
        let point = 0;
        const detail: boolean[] = [];
        questions?.forEach(q => {
            q.correctAnswer == q.selectedAnswer && point++;
            detail.push(q.correctAnswer == q.selectedAnswer);
        })
        return { point, detail };
    }

    const showNotification = (message: string) => {
        const newNotification = {
            message,
            key: Date.now().toString(), // Use a timestamp as the key to ensure uniqueness
        };
        setNotifications([...notifications, newNotification]);
    };

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
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8 p-4">
                    {exam?.questions.map((question, index) => (
                        <div key={index}>
                            {question.type === "checkbox" && (
                                <div>
                                    <label className="block font-medium text-lg text-gray-700 tracking-wider">{index + 1}. {question.text}</label>
                                    <div className="">
                                        {question.choices.map((choise, i) => (
                                            <div key={i} className="flex items-center p-2">
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
                                    <label className={`block font-medium text-lg text-gray-700 tracking-wider ${question.isCorrect == true && 'text-green-600'} ${question.isCorrect == false && 'text-red-600'}`}>{index + 1}. {question.text}</label>
                                    {question.choices.map((choise, i) => (
                                        <div key={i} className={`p-2`}>
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
                            Submitted successfully! Your point is: {`${points}/${exam?.questions.length}`}
                        </div>
                    )}
                    <div>
                        <button type="submit" className="bg-blue-500 text-white p-3 rounded">
                            Submit
                        </button>
                    </div>

                </form>
            )}
            <div className='fixed top-0 right-0'>
                {notifications.map((notification, i) => (
                    <div className='p-1' key={i}>
                        <Notification nKey={notification.key} message={notification.message} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExamifyPage;
