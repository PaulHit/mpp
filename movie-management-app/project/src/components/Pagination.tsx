"use client";

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	return (
		<div>
			<button
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
			>
				Previous
			</button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
			<button
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
			>
				Next
			</button>
		</div>
	);
}
