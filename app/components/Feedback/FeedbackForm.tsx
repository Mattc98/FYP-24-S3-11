'use client';

import { useState, useRef, ReactNode, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Feedback.module.css';
import { submitFeedback, Feedback } from './SubmitFeedback';

interface FeedbackFormProps {
    children: ReactNode;
    userId: number;
}

function FeedbackFormContent({ children }: FeedbackFormProps) {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const userIdParam = searchParams.get('userId');
        if (userIdParam) {
            const parsedUserId = parseInt(userIdParam, 10);
            if (!isNaN(parsedUserId)) {
                setUserId(parsedUserId);
            } else {
                console.error('Invalid userId in URL');
            }
        } else {
            console.error('userId not found in URL parameters');
        }
    }, [searchParams]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        
        if (!formRef.current || userId === null) {
            console.log('Form reference is null or userId is not set');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData(formRef.current);
        const roomValue = formData.get('rooms') as string;
        const [roomId] = roomValue.split(':');
        
        const feedbackData: Feedback = {
            RoomID: parseInt(roomId, 10),
            UserID: userId,
            Feedback: feedback
        };

        try {
            const result = await submitFeedback(feedbackData);
            if (result) {
                console.log('Feedback submitted successfully');
                setSubmitStatus('success');
                setFeedback('');
            } else {
                console.error('Failed to submit feedback');
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (userId === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="rooms" className={styles.label}>Room:</label>
                    {children}
                </div>
                <div>
                    <label htmlFor="feedback" className={styles.label}>Feedback:</label>
                    <textarea
                        id="feedback"
                        name="feedback"
                        rows={10}
                        cols={50}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Leave your feedback here"
                        className={styles.textarea}
                    ></textarea>
                </div>
                <button type="submit" className={styles.button} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                {submitStatus === 'success' && <p className={styles.successMessage}>Feedback submitted successfully!</p>}
                {submitStatus === 'error' && <p className={styles.errorMessage}>Failed to submit feedback. Please try again.</p>}
            </form>
        </div>
    );
}

export default function FeedbackForm(props: FeedbackFormProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FeedbackFormContent {...props} />
        </Suspense>
    );
}