import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/globals.css';
import '../styles/tailwind.css';
import Image from 'next/image';
import Link from 'next/link';

interface Exam {
    title: string;
    questions: ExamQuestion[];
}

interface ExamQuestion {
    text: string;
    type: 'radio' | 'checkbox';
    choices: string[];
    correctAnswer: string | string[];
}

const AllExams: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("https://652a0b4155b137ddc83f42e5.mockapi.io/api/v1/Exam")
            .then((response) => {
                setExams(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching exams:', error);
                setLoading(false);
            });
    }, []);

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
            <h2 className="text-2xl font-bold mb-4">All Exams</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {exams.map((exam, index) => (
                        <div key={index} className="mb-4 border p-4 rounded border-gray-300">
                            <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
                            {exam.questions.map((question, qIndex) => (
                                <div key={qIndex} className="mb-2">
                                    <p>{question.text}</p>
                                    <p>Question Type: {question.type}</p>
                                    <p>Correct Answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}</p>
                                    <ul>
                                        {question.choices.map((choice, cIndex) => (
                                            <li key={cIndex}>{choice}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default AllExams;
