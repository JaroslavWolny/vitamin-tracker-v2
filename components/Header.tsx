import React from 'react';
import { getFriendlyDate } from '../utils/dateUtils';

interface HeaderProps {
    isEditing: boolean;
    onToggleEdit: () => void;
}

const PencilIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ isEditing, onToggleEdit }) => {
  const todayFriendly = getFriendlyDate();

  return (
    <header className="pt-8">
        <div className="relative flex justify-center items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight text-center">
              {isEditing ? 'Správa doplňků' : 'Denní přehled'}
            </h1>
            <button
                onClick={onToggleEdit}
                className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center justify-center h-10 w-10 rounded-full transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={isEditing ? 'Dokončit úpravy' : 'Upravit seznam'}
            >
                {isEditing ? <CheckIcon className="w-6 h-6" /> : <PencilIcon className="w-5 h-5" />}
            </button>
        </div>
      
        {!isEditing && (
            <p className="text-center text-lg text-indigo-500 dark:text-indigo-400 font-medium mt-2 capitalize">
                {todayFriendly}
            </p>
        )}
    </header>
  );
};

export default Header;