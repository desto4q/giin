function ErrorBody(props: { refetch: () => any }) {
	return (
		<div className="w-full h-[calc(100dvh-80px)] grid place-items-center">
			<div className="flex flex-col gap-2">
				Error Occured
				<button
					className="btn btn-error mt-2"
					onClick={props.refetch}
				>
					Error
				</button>
			</div>
		</div>
	);
}

export default ErrorBody;
