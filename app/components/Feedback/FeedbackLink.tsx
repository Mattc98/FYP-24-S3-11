'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const FeedbackLink = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const userId = searchParams.get('userId');

  return (
    <Link 
      className="text-white hover:text-gray-300 transition duration-200" 
      href={{
        pathname: '/feedback',
        query: {
            ...(username && { username }),
            ...(userId && { userId })
          },
      }}
    >
      Feedback
    </Link>
  );
};

export default FeedbackLink;