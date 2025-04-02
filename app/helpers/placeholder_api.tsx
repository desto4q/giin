let getData = async () => {
	try {
		let resp = await fetch(
			"https://testbooru.donmai.us/posts.json?limit=10"
		);
		let respData = await resp.json();
		return respData;
	} catch (error) {
		throw new Error(error as any);
	}
};
export { getData };
