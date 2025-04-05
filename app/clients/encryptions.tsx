const getSecretKey = async () => {
	const response = await fetch("/api/key", { method: "POST" });
	const data = await response.json();
	return data.secret;
};
// 🔐 Encrypt Data
async function encryptData(data: object): Promise<string> {
	let form = new FormData();
	form.append("data", JSON.stringify(data));
	let resp = await fetch("/api/encrypt", {
		method: "POST",
		body: form,
	});
	let response = await resp.json();
	return response.encrypted;
}
// 🔓 Decrypt Data
async function decryptData(cipherText: string): Promise<object | null> {
	let form = new FormData();
	form.append("data", cipherText);
	let resp = await fetch("/api/decrypt", {
		method: "POST",
		body: form,
	});
	let response = await resp.json();
	return response.decrypted;
	
}
export { encryptData, decryptData };
