import React, { useState, useEffect, useRef } from 'react'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: Option[]
  onChange: (value: string) => void
  placeholder?: string
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SearchableSelect({ options, onChange, placeholder = 'Select an option' }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredOptions(filtered)
  }, [searchTerm, options])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleSelect = (option: Option) => {
    setSelectedOption(option)
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        className={cn(
          "flex items-center justify-between w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
          isOpen ? "border-blue-500" : "border-gray-300"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="pointer-events-none">
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </span>
      </button>

      {isOpen && (
        <div className="fixed z-10 mt-1 bg-white rounded-md shadow-lg">
          <div className="p-2">
            <input
              type="text"
              className="px-3 py-2 text-sm leading-5 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Recherche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <ul
            className="py-1 overflow-auto text-base max-h-60 focus:outline-none sm:text-sm"
            role="listbox"
          >
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className={cn(
                  "relative py-2 pl-3 pr-9 cursor-default select-none hover:bg-blue-100",
                  selectedOption?.value === option.value ? "bg-blue-50" : ""
                )}
                role="option"
                aria-selected={selectedOption?.value === option.value}
                onClick={() => handleSelect(option)}
              >
                <span className="block truncate font-normal">
                  {option.label}
                </span>
                {selectedOption?.value === option.value && (
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
  )
}

