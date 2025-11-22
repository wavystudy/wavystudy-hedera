
import {  ContractFunctionParameters } from '@hashgraph/sdk';

export async function GenerateAccessToken(fullname) {
	return "daf69cba6bb256a687c8c73e229f54d3";
}
export default async function handler(req, res) {
	try {
		let FixCors = await import("../../../contract/fixCors.js");
		await FixCors.default(res);
	} catch (error) {}

	let useContract = await import("../../../contract/useContract.ts");
	const {contract,  sendTransaction, ReadContractByQuery} = await useContract.default();
	if (req.method !== "POST") {
		res.status(405).json({status: 405, error: "Register must have POST request"});
		return;
	}
	const {fullname, email,birth_date, password} = req.body;
	const result = await ReadContractByQuery(contract, ("CheckEmail"),[email])
    
	if (result !== "False") {
		res.status(403).json({status: 403, error: "Account already exists!"});
		return;
	}
	let accessToken =""
	let paramsTrans = new ContractFunctionParameters()
	.addString(fullname)
	.addString(email)
	.addString(password)
	.addString(accessToken)
	.addString("")
	.addString(birth_date);


	await sendTransaction( "CreateAccount",paramsTrans);
	res.status(200).json({status: 200, value: "Registered!"});
}

