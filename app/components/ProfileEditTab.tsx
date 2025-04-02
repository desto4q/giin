import { FormEvent } from "react";
import { USER } from "~/clients/supaFuncs";

function ProfileEditTab(props: USER) {
	let onSubmit = (e: FormEvent) => {
		e.preventDefault();
		let form_data = new FormData(e.target as HTMLFormElement);
		console.log(form_data.keys
        )
	};
	return (
		<form
			action="#"
			onSubmit={onSubmit}
		>
			<div className="grid md:grid-cols-2 gap-2">
				<div className="flex flex-col  w-full">
					<label htmlFor="">Email</label>
					<input
						type="text"
						name="email"
						className="input grow w-full"
						placeholder="email"
						defaultValue={props.email}
					/>
				</div>
				<div className="flex flex-col w-full">
					<label htmlFor="">User Name</label>
					<input
						type="text"
						name={"username"}
						className="input grow w-full"
						placeholder="email"
						defaultValue={props.user_info.username}
					/>
				</div>
				<div className="flex flex-col w-full">
					<label htmlFor="">full Name</label>
					<input
						name="fullname"
						type="text"
						className="input grow w-full"
						placeholder="email"
						defaultValue={props.user_info.fullname}
					/>
				</div>
				<div className="flex flex-col w-full">
					<label htmlFor="">Id</label>
					<input
						readOnly
						type="text"
						name="id"
						id="id"
						className="input grow w-full"
						placeholder="Id"
						defaultValue={props.id}
					/>
				</div>
			</div>
			<button className="btn bg-primary/25 w-full mt-4">Submit</button>
		</form>
	);
}

export default ProfileEditTab;
