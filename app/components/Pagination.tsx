import { useSearchParams, useNavigate } from "@remix-run/react";

function Pagination({ totalPages }: { totalPages: number }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	let page = Number(searchParams.get("page")) || 1; // Default to page 1

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	const handlePageChange = (newPage: number) => {
		setSearchParams({ page: newPage.toString() });
		// or navigate(`?page=${newPage}`)
	};

	return (
		<div className="join">
			<div className="join">
				{pages.map((pageNum) => (
					<button
						key={pageNum}
						className={`join-item btn ${
							pageNum === page ? "btn-active" : ""
						}`}
						onClick={() => handlePageChange(pageNum)}
					>
						{pageNum}
					</button>
				))}
			</div>
			<form
				className="flex items-center"
				onSubmit={(e) => {
					e.preventDefault();
					let form_data = new FormData(e.target as HTMLFormElement);
					let input_page = form_data.get("page");
					
					searchParams.set("page", input_page as string);
				}}
			>
				<input
					className="w-16 h-full mx-2 border border-neutral-500/25 focus:border-primary/50 text-center outline-hidden appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					type="number"
					name="page"
					min={1}
					defaultValue={page}
					max={totalPages}
				/>
				<button className="btn bg-secondary/25 ">Go</button>
			</form>
		</div>
	);
}

export default Pagination;
