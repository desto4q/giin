import { supabase } from "./supabase";
import { decryptData, encryptData } from "./encryptions";
let getUser = async (username: string) => {
	let { data, error } = await supabase
		.from("user_info")
		.select("*")
		.eq("username", username);
	if (error) {
		throw new Error(error as any);
	}
	if ((data?.length as number) < 1) {
		return null;
	}
	let returned_data: any = data;
	return returned_data[0];
};
type USER = {
	id: string; // UUID
	created_at: string; // ISO timestamp
	email: string;
	password: string;
	user_info: {
		username: string;
		fullname: string;
	}; // Hashed password
};
const getSession = async () => {
	let resp = localStorage.getItem("auth");
	if (resp) {
		return (await decryptData(resp)) as USER;
	}
	return null;
};

interface POSTSCHEMATYPE {
	title: string;
	subtitle: string;
	username: string;
	user_id: string;
	content_url: string;
	thumbnail_url: string;
	content_type: "image" | "video" | null;
}
interface POSTDATATYPE {
	id: number;
	created_at: string;
	title: string;
	content_url: string;
	thumbnail_url: string;
	subtitle: string;
	user_id: string;
	username: string;
	content_type: "video" | "image";
	user_info: {
		username: string;
	};
}
const uploadPost = async (object: POSTSCHEMATYPE) => {
	let { data, error } = await supabase
		.from("posts")
		.insert([{ ...object }])
		.select();
	if (error) {
		console.log(error);
		throw new Error();
	}
	console.log(data);
	return data;
};

const pagesCalculator = (count: number, limit: number) =>
	count ? Math.ceil(count / limit) : 0;

const getPosts = async (page: number, limit: number) => {
	const from = (page - 1) * limit;
	const to = from + limit - 1;
	console.log(from);
	let { data, error, count } = await supabase
		.from("posts")
		.select("*", { count: "estimated" })
		.range(from, to);
	if (error) {
		throw new Error(error as any);
	}
	const totalPages = pagesCalculator(count as number, limit);
	return { data, totalPages };
};

const getFavourites = async (page: number, limit: number, id: string) => {
	const from = (page - 1) * limit;
	const to = from + limit - 1;
	let { data, error, count } = await supabase
		.from("saved")
		.select("*, posts(*)", { count: "estimated" })
		.eq("user_id", id)
		.range(from, to);
	if (error) {
		console.log(error);
		throw new Error(error as any);
	}
	console.log(data);
	const totalPages = pagesCalculator(count as number, limit);
	return { data, totalPages };
};

const getSinglePost = async (id: any) => {
	console.log(id)
	// let { data, error } = await supabase
	// 	.from("posts")
	// 	.select("*, user_info(username)")
	// 	.eq("user_id", id)
	// 	.single();

	let { data, error } = await supabase
		.from("posts")
		.select("*, user_info(username)")
		.eq("id", id)
		.single();
	if (error) {
		throw new Error(error as any);
	}
	return data as POSTDATATYPE;
};

const checkUserExists = async (email: string) => {
	let { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("email", email);
	if (error) {
		console.log(error);
		throw new Error(error as any);
	}
	return data?.length ? true : false;
};
const checkUserName = async (username: string) => {
	if (username.length < 3) {
		return null;
	}
	try {
		let { data, error } = await supabase
			.from("user_info")
			.select("*")
			.eq("username", username);
		if (error && !data) {
			console.log(error);
			throw new Error(error as any);
		}
		return data?.length ? true : false;
	} catch (err) {
		throw new Error(err as any);
	}
};

interface SIGNUPTYPE {
	email: string;
	password: string;
	username: string;
	fullname: string;
}
async function hashPassword(password: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

interface SIGNUPTYPERESPONSE {
	created_at: string;
	email: string;
	password: string;
	id: string;
}
let signUp = async (props: SIGNUPTYPE) => {
	let hashed = await hashPassword(props.password);

	let uploadObject = {
		email: props.email,
		password: hashed,
	};
	let { data, error } = await supabase
		.from("users")
		.insert([uploadObject])
		.select()
		.single();

	if (error) {
		throw new Error(error as any);
	}

	let response_sign = data as SIGNUPTYPERESPONSE;
	let resp = await upload_user_name(
		props.username,
		response_sign.id,
		props.fullname
	);

	let responseobj = {
		...response_sign,
		...resp,
	};
	return responseobj;
};
let upload_user_name = async (
	username: string,
	id: string,
	fullname: string
) => {
	let { data, error } = await supabase
		.from("user_info")
		.insert([{ id: id, username: username, fullname: fullname }]) // Include `id`
		.select()
		.single(); // Fetch inserted data

	if (error) {
		throw new Error(error.message); // Show error message properly
	}
	return data;
};
interface LOGINTYPE {
	email: string;
	password: string;
}
let login = async (props: LOGINTYPE) => {
	let hashed = await hashPassword(props.password);
	let { data, error } = await supabase
		.from("users")
		.select("*,user_info(username,fullname)")
		.eq("password", hashed)
		.eq("email", props.email)
		.single();

	if (error) {
		throw new Error(error as any);
	}
	let encrypted = await encryptData(data);
	localStorage.setItem("auth", encrypted);
	return encryptData;
};

let logOutSesssion = async (callback?: () => any) => {
	localStorage.removeItem("auth");
	if (callback) {
		callback();
	}
	return;
};

let getPostsByUsername = async (username: string) => {
	let { data, error } = await supabase
		.from("posts")
		.select("*")
		.eq("username", username);
	if (error) {
		throw new Error();
	}
	return data;
};
let deletePost = async (id: number, user_id: string) => {
	let { data, error } = await supabase
		.from("posts")
		.delete()
		.eq("id", id)
		.eq("user_id", user_id)
		.select();
	if (error) {
		throw new Error(error as any);

		return data;
	}
};

let likePost = async (post_id: number, user_id: string) => {
	let { data, error } = await supabase
		.from("saved")
		.insert([
			{
				post_id: post_id,
				user_id: user_id,
			},
		])
		.select("*");
	if (error) {
		throw new Error(error as any);
	}
	return data;
};
let unLikePost = async (post_id: number, user_id: string) => {
	let { data, error } = await supabase
		.from("saved")
		.delete()
		.eq("post_id", post_id)
		.eq("user_id", user_id)
		.select("*");
	if (error) {
		throw new Error(error as any);
	}
	return data;
};

async function checkIfUserLikedPost(post_id: number, user_id: string) {
	const { data, error } = await supabase
		.from("saved")
		.select("*") // You can select specific columns if needed, e.g., 'user_id'
		.eq("user_id", user_id)
		.eq("post_id", post_id);

	if (error) {
		console.error("Error checking like:", error);
		return false; // Or handle the error appropriately
	}
	// If 'data' is not null and has at least one element, the user has liked the post
	return data && data.length > 0;
}

export {
	unLikePost,
	checkIfUserLikedPost,
	likePost,
	login,
	logOutSesssion,
	getUser,
	getSession,
	getPostsByUsername,
	uploadPost,
	getSinglePost,
	checkUserExists,
	checkUserName,
	signUp,
	getPosts,
	getFavourites,
	deletePost,
};
export type { POSTSCHEMATYPE, USER, SIGNUPTYPE, POSTDATATYPE };
