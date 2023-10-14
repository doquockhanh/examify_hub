import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Exam {
    id: number
    title: string;
    questions: ExamQuestion[];
}

interface ExamQuestion {
    text: string;
    type: 'radio' | 'checkbox';
    choices: string[];
    correctAnswer: string | string[];
}

const PickExamPage: React.FC = () => {
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
        <div>
            <h1 className="text-2xl font-bold mb-4">Pick an Exam</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {exams.map((exam, index) => (
                        <li key={index} className="mb-2">
                            <Link href={{
                                pathname: '/examify',
                                query: { id: exam.id },
                            }}>
                                <span className="text-blue-500 hover:underline">{exam.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PickExamPage;
