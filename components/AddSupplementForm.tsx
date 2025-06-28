import React, { useState } from 'react';

interface AddSupplementFormProps {
    onAdd: (name: string) => void;
}

const AddSupplementForm: React.FC<AddSupplementFormProps> = ({ onAdd }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2.5">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Přidat další položku..."
                className="flex-grow bg-transparent px-3 py-2 text-lg font-semibold text-gray-700 dark:text-gray-200 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                aria-label="Název nového doplňku"
            />
            <button
                type="submit"
                className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!name.trim()}
                aria-label="Přidat nový doplněk"
            >
                Přidat
            </button>
        </form>
    );
};

export default AddSupplementForm;