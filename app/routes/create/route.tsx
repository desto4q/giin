import { useNavigate } from "@remix-run/react";
import { useAtom } from "jotai";
import { UploadIcon } from "lucide-react";
import {
	ChangeEvent,
	SyntheticEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "react-toastify/unstyled";
import {
	getSession,
	POSTSCHEMATYPE,
	uploadPost,
	USER,
} from "~/clients/supaFuncs";
import { sessionAtom } from "~/helpers/client_state";
import {
	generate_image_thumb,
	generate_thumb,
	UPLOADBACKBLAZE,
	uploadMedia,
} from "~/helpers/methods";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function route() {
	let navigate = useNavigate();
	let [video, setVideo] = useState<string | null>(null);
	let [image, setImage] = useState<string | null>(null);
	let fileMetadata = useRef<File | null>(null);
	let temp_url = useRef<string | any>("");
	let content_type = useRef<"image" | "video" | null>(null);
	let [session, setSession] = useAtom<"loading" | USER | null>(sessionAtom);
	useEffect(() => {
		if (session == null) {
			navigate("/auth/login");
		}
	}, [session]);
	let user_info = session as USER;

	let onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setVideo(null);
		setImage(null);

		let files = e.target.files as unknown as File[];
		if (files?.length < 1) {
			return;
		}
		if (files[0].size > MAX_FILE_SIZE) {
			toast.error("max file size 5mb");
			e.target.value = ""; // Reset file input
			return;
		}

		let file = files[0] as File;
		fileMetadata.current = file;
		let url = URL.createObjectURL(file);
		temp_url.current = url;
		if (file.type.includes("video")) {
			content_type.current = "video";
			setVideo(url);
			return;
		}
		content_type.current = "image";
		setImage(url);
		return;
	};

	const onSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const user = getSession();
		const uploadForm = new FormData();
		if (!fileMetadata.current) {
			toast.error("add file");
			return;
		}
		if (video) {
			await handleVideoUpload(uploadForm, formData, session as USER);
			return;
		}
		await handleImageUpload(uploadForm, formData, session as USER);
	};

	const handleImageUpload = async (
		uploadForm: FormData,
		formData: FormData,
		user: { id: string }
	) => {
		const imageFile = fileMetadata.current as File;
		const imageThumb = await generate_image_thumb(imageFile);

		uploadForm.append("thumb", imageThumb, imageThumb.name);
		uploadForm.append("image", imageFile, imageFile.name);

		const response = await uploadMedia("/api/upload/image", uploadForm);

		const jsoned = (await response.json()) as UPLOADBACKBLAZE;

		savePost(jsoned, formData, user, "image");
	};

	const handleVideoUpload = async (
		uploadForm: FormData,
		formData: FormData,
		user: USER
	) => {
		const videoFile = fileMetadata.current as File;
		const videoThumb = (await generate_thumb(video as string)) as Blob;
		const thumbName = videoFile.name.replace("mp4", "jpg");
		uploadForm.append("thumb", videoThumb, thumbName);
		uploadForm.append("video", videoFile, videoFile.name);
		const response = await uploadMedia("/api/upload", uploadForm);
		const jsoned = (await response.json()) as UPLOADBACKBLAZE;
		savePost(jsoned, formData, user, "video");
	};

	const savePost = async (
		jsoned: UPLOADBACKBLAZE,
		formData: FormData,
		user: { id: string },
		type: string
	) => {
		const post: POSTSCHEMATYPE = {
			title: (formData.get("title") as string) ?? "",
			subtitle: (formData.get("content") as string) ?? "",
			username: (user_info.user_info.username as string) ?? "",
			user_id: user.id,
			content_url: `/api/get/${jsoned.videoPath}`,
			content_type: content_type.current ?? (type as any),
			thumbnail_url: `/api/get/${jsoned.thumbPath}`,
		};
		let post_upload = await toast.promise(uploadPost(post), {
			pending: "saving post",
			success: "post saved",
			error: "failed",
		});
	};

	return (
		<div className=" p-2 px-4 flex flex-col">
			<h2 className="w-full border-t border-b border-base-content/50 py-4 text-primary/80 text-xl">
				Create Post
			</h2>

			<form
				onSubmit={onSubmit}
				action="#"
				className="mx-auto mt-2 w-full  grid md:grid-cols-2"
			>
				<div className="w-full px-2">
					<div className="bg-base-200 w-full h-[300px] mt-2 p-2">
						{image ? (
							<img
								src={image}
								className="w-full h-full object-contain"
							></img>
						) : video ? (
							<video
								key={video}
								controls
								className="w-full h-full"
							>
								<source src={video} />
							</video>
						) : (
							<label
								htmlFor="file_input"
								className="flex flex-col h-full w-full  items-center justify-center cursor-pointer hover:border border-primary/25 rounded-md duration-200"
							>
								<div className="flex flex-col items-center gap-2">
									<UploadIcon size={32} />
									<h2 className="text-xl font-bold">
										Upload content
									</h2>
									<p>Max File Size is 5mb</p>
								</div>
							</label>
						)}
					</div>
					<input
						name="file_input"
						id="file_input"
						onChange={onChange}
						accept="image/*,video/*"
						type="file"
						className=" mt-2 cursor-pointer border rounded-md hover:border-primary duration-150 border-primary/20 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold  file:text-base-content file:bg-base-200"
					/>
				</div>
				<div className="flex flex-col w-full gap-4 mt-4 md:mt-0 px-2">
					<div className="flex flex-col w-full ">
						<label
							htmlFor=""
							className="text-xl opacity-50 mb-2"
						>
							Title
						</label>
						<input
							required
							placeholder="Title"
							name="title"
							id="title"
							type="text"
							className="input w-full"
						/>
					</div>
					<div className="flex flex-col">
						<label
							htmlFor=""
							className="text-xl opacity-50 mb-2"
						>
							Content
						</label>
						<textarea
							name="content"
							id="content"
							placeholder="Content"
							className="textarea w-full"
						/>
					</div>
					<button className="btn bg-primary/25 h-auto py-4 w-auto text-lg">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}

export default route;
