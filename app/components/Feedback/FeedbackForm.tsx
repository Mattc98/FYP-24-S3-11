// FeedbackForm.tsx (Client Component)
'use client';

import { useState, useRef, ReactNode, Suspense } from 'react';
import styles from './Feedback.module.css';
import { submitFeedback, Feedback } from './SubmitFeedback';

interface FeedbackFormProps {
    children: ReactNode;
    userId: number | null; // Change to allow null value
}

function FeedbackFormContent({ children, userId }: FeedbackFormProps) {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        if (!formRef.current || userId === null) {
            console.error('Form reference is null or userId is not set');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData(formRef.current);
        const roomValue = formData.get('rooms') as string;
        const [roomId] = roomValue.split(':');

        const feedbackData: Feedback = {
            RoomID: parseInt(roomId, 10),
            UserID: userId,
            Feedback: feedback,
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

    // Display loading state while user ID is null
    if (userId === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen lg:w-[1100px] mx-auto bg-neutral-800">
            <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="rooms" className={styles.label}>Room: </label>
                    {children}
                </div>
                <div>
                    <label htmlFor="feedback" className={styles.label}>Feedback: </label>
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
        <Suspense fallback={<div></div>}>
            <FeedbackFormContent {...props} />
        </Suspense>
    );
}
