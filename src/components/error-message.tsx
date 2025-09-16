import { Link } from 'react-router';
import { Button } from './ui/button';

// 1. Определяем типы для props нашего компонента
type Props = {
  message: string;
  onRetry?: () => void;
};

export const ErrorMessage = ({ message, onRetry }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        😕 Oops, Something went wrong...
      </h2>

      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{message}</p>

      <div className="flex gap-2">
        {onRetry && <Button onClick={onRetry}>Try again</Button>}
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
};
