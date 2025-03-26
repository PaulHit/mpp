"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
	tags: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
	className?: string;
}

export default function TagInput({
	tags,
	onChange,
	placeholder,
	className,
}: TagInputProps) {
	const [inputValue, setInputValue] = useState("");

	const handleAddTag = () => {
		if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
			onChange([...tags, inputValue.trim()]);
			setInputValue("");
		}
	};

	const handleRemoveTag = (index: number) => {
		const newTags = tags.filter((_, i) => i !== index);
		onChange(newTags);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleAddTag();
		}
	};

	return (
		<div
			className={`flex flex-wrap items-center gap-2 border border-gray-300 text-white p-2 rounded w-full ${className}`}
		>
			{/* render existing tags */}
			{tags.map((tag, index) => (
				<div
					key={index}
					onClick={() => handleRemoveTag(index)}
					className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-blue-600"
				>
					<span>{tag}</span>
					<button
						type="button"
						onClick={() => handleRemoveTag(index)}
						className="ml-2 text-white hover:text-gray-300"
					>
						<X className="w-4 h-4 cursor-pointer" />
					</button>
				</div>
			))}

			{/* input field for adding tags */}
			<input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={tags.length === 0 && inputValue === "" ? placeholder : ""}
				className="flex-grow bg-transparent text-white border-none outline-none placeholder-gray-400"
			/>
		</div>
	);
}
