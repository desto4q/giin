import CryptoJS from "crypto-js/";
const getSecretKey = async () => {
	const response = await fetch("/api/key", { method: "POST" });
	const data = await response.json();
	return data.secret;
};
// 🔐 Encrypt Data
async function encryptData(data: object): Promise<string> {
	return CryptoJS.AES.encrypt(
		JSON.stringify(data),
		await getSecretKey()
	).toString();
}

// 🔓 Decrypt Data
async function decryptData(cipherText: string): Promise<object | null> {
	try {
		const bytes = CryptoJS.AES.decrypt(cipherText, await getSecretKey());
		return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	} catch (error) {
		console.error("Decryption failed:", error);
		return null;
	}
}
export { encryptData, decryptData };
