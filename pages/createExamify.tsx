import React, { useState } from 'react';
import '../styles/globals.css';
import '../styles/tailwind.css';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import Notification from '../components/Notification';

interface ExamQuestion {
    text: string;
    type: 'radio' | 'checkbox';
    choices: string[];
    correctAnswer: string | string[];
}

interface Exam {
    title: string;
    questions: ExamQuestion[];
}

const CreateExamPage: React.FC = () => {
    const [exam, setExam] = useState<Exam>({
        title: '',
        questions: [],
    });
    const [notifications, setNotifications] = useState<{ message: string; key: string }[]>([]);

    const addQuestion = (type: 'radio' | 'checkbox') => {
        const newQuestion: ExamQuestion = {
            text: '',
            type,
            choices: ["", ""],
            correctAnswer: type === 'radio' ? '' : [],
        };
        setExam((prevExam) => ({ ...prevExam, questions: [...prevExam.questions, newQuestion] }));
    };

    const removeQuestion = (index: number) => {
        setExam((prevExam) => {
            const questions = [...prevExam.questions];
            questions.splice(index, 1);
            return { ...prevExam, questions };
        });
    };

    const handleQuestionTextChange = (index: number, text: string) => {
        setExam((prevExam) => {
            const questions = [...prevExam.questions];
            questions[index].text = text;
            return { ...prevExam, questions };
        });
    };

    const handleChoiceChange = (questionIndex: number, choiceIndex: number, text: string) => {
        setExam((prevExam) => {
            const questions = [...prevExam.questions];
            questions[questionIndex].choices[choiceIndex] = text;
            return { ...prevExam, questions };
        });
    };

    const removeChoice = (questionIndex: number, choiceIndex: number) => {
        setExam((prevExam) => {
            const questions = [...prevExam.questions];
            questions[questionIndex].choices.splice(choiceIndex, 1);
            return { ...prevExam, questions };
        });
    }


    const handleCorrectAnswerChange = (questionIndex: number, correctAnswer: string | string[]) => {
        setExam((prevExam) => {
            const questions = [...prevExam.questions];
            questions[questionIndex].correctAnswer = correctAnswer;
            return { ...prevExam, questions };
        });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(exam);

        try {
            const response = await axios.post("https://652a0b4155b137ddc83f42e5.mockapi.io/api/v1/Exam", exam);

            if (response.status === 201) {
                showNotification('Exam created successfully!');
            }
        } catch (error) {
            showNotification('Error creating the exam!');
        }
    };

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
            <div className='fixed top-0 right-0'>
                {notifications.map((notification, i) => (
                    <div className='p-1' key={i}>
                        <Notification nKey={notification.key} message={notification.message} />
                    </div>
                ))}
            </div>
            <h1 className="text-2xl font-bold mb-4">Create Exam</h1>
            <form onSubmit={handleSubmit} className="space-y-8 p-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Title:</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        value={exam.title}
                        onChange={(e) => setExam({ ...exam, title: e.target.value })}
                        placeholder='Enter title of exam...'
                    />
                </div>

                {exam.questions.map((question, index) => (
                    <div key={index} className="mb-4 border p-4 rounded border-gray-300">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Question Text {index + 1}:</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={question.text}
                                onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                                placeholder='Input question text'
                            />
                        </div>
                        {question.type === 'radio' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Answer Choices:</label>
                                {question.choices.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className="mb-2 flex">
                                        <div className='relative w-full'>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                value={choice}
                                                onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)}
                                                placeholder='Input Answer'
                                            />
                                            <button
                                                onClick={() => removeChoice(index, choiceIndex)}
                                                className="absolute right-0 p-2 px-4 text-red-500 rounded-lg"
                                                type="button"
                                            >
                                                x
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600"
                                    onClick={() => handleChoiceChange(index, question.choices.length, '')}
                                    type='button'
                                >
                                    +
                                </button>
                                <div className='mb-2'>
                                    <label className="block text-sm font-medium mb-2">Correct Answer:</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        value={question.correctAnswer as string}
                                        onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                                    >
                                        {question.choices.map((choice, choiceIndex) => (
                                            <option key={choiceIndex} value={choice}>
                                                {choice}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        {question.type === 'checkbox' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Answer Choices:</label>
                                {question.choices.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className="mb-2 flex">
                                        <div className='relative w-full'>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                value={choice}
                                                onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)}
                                                placeholder='Input Answer'
                                            />
                                            <button
                                                onClick={() => removeChoice(index, choiceIndex)}
                                                className="absolute right-0 p-2 px-4 text-red-500 rounded-lg"
                                                type="button"
                                            >
                                                x
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600"
                                    onClick={() => handleChoiceChange(index, question.choices.length, '')}
                                    type='button'
                                >
                                    +
                                </button>
                                <div className='mb-2'>
                                    <label className="block text-sm font-medium mb-2">Correct Answer:</label>
                                    {question.choices.map((choice, choiceIndex) => (
                                        <div key={choiceIndex}>
                                            {choice && (
                                                <div key={choiceIndex} className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        value={choice}
                                                        checked={(question.correctAnswer as string[]).includes(choice)}
                                                        onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            const currentAnswers = question.correctAnswer as string[];
                                                            const updatedAnswers = isChecked
                                                                ? [...currentAnswers, choice]
                                                                : currentAnswers.filter((ans) => ans !== choice);
                                                            handleCorrectAnswerChange(index, updatedAnswers);
                                                        }}
                                                    />
                                                    <label>&nbsp;{choice}</label>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button
                            className="bg-red-500 text-white p-2 px-4 rounded hover:bg-red-600 mt-2 mb-4"
                            onClick={() => removeQuestion(index)}
                            type='button'
                        >
                            Delete
                        </button>
                        <hr></hr>
                    </div>
                ))}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Add Question</label>
                    <button
                        className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600"
                        onClick={() => addQuestion('radio')}
                        type='button'
                    >
                        Radio Question
                    </button>
                    <button
                        className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600 ml-2"
                        onClick={() => addQuestion('checkbox')}
                        type='button'
                    >
                        Checkbox Question
                    </button>
                </div>
                <button type="submit" className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600">
                    Create Exam
                </button>
            </form>
        </div>
    );
};

export default CreateExamPage;
