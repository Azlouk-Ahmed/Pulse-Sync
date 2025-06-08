import React, { useState, useEffect, useRef } from 'react'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface SearchableInputProps {
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
    value: string; // Ajoutez cette ligne
    onSearchTermChange: (value: string) => void; // Si vous utilisez cette fonction
  }

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SearchableSelect({
    options,
    onChange,
    placeholder = 'Rechercher...',
    value, // Utilisez la valeur passée en props
    onSearchTermChange,
  }: SearchableInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const containerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }, [value, options]);
  
    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);
  
    const handleSelect = (option: Option) => {
      onChange(option.value); // Appeler la fonction onChange passée en prop
      setIsOpen(false);
    };
  
    return (
      <div className="relative w-full" ref={containerRef}>
        <input
          type="text"
          className="w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={value} // Utiliser la valeur passée en props
          onChange={(e) => onSearchTermChange(e.target.value)} // Utiliser onSearchTermChange
          onFocus={() => setIsOpen(true)}
        />
  
        {isOpen && (
          <div className="fixed z-10 mt-1 bg-white rounded-md shadow-lg w-[27%]">
            <ul
              className="py-1 overflow-auto text-base max-h-60 focus:outline-none sm:text-sm"
              role="listbox"
            >
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    "relative py-2 pl-3 pr-9 cursor-default select-none hover:bg-blue-100",
                    value === option.label ? "bg-blue-50" : ""
                  )}
                  role="option"
                  aria-selected={value === option.label}
                  onClick={() => handleSelect(option)}
                >
                  <span className="block truncate font-normal">
                    {option.label}
                  </span>
                  {value === option.label && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                      <Check className="w-5 h-5" aria-hidden="true" />
                    </span>
                  )}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="relative py-2 pl-3 pr-9 text-gray-500 cursor-default select-none">
                  Aucune option trouvée
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }