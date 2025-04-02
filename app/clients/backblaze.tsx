import B2 from "backblaze-b2";

let master_key = import.meta.env.VITE_BACKBLAZE_MASTER_KEY;
let master_id = import.meta.env.VITE_BACKBLAZE_MASTER_ID;
// 
const b2 = new B2({
	applicationKeyId: master_id, // or accountId: 'accountId'
	applicationKey: master_key, // or masterApplicationKey
});

export { b2 };
