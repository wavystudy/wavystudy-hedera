import {  ContractFunctionParameters } from '@hashgraph/sdk';

export default async function handler(req, res) {
    try {
        let FixCors = await import("../../../../contract/fixCors.js");
        await FixCors.default(res);
    } catch (error) { }



    let useContract = await import("../../../../contract/useContract.ts");
    const {  sendTransaction, ReadContractByQuery } = await useContract.default();

    if (req.method !== 'POST') {
        res.status(405).json({ status: 405, error: "Method must have POST request" })
        return;
    }

    const { userid, date, studyid } = req.body;
    let paramsTrans = new ContractFunctionParameters()
	.addUint256(Number(userid))
	.addString(date)
	.addUint256(Number(studyid));


    await sendTransaction("CreateCompletedInformedConsent", paramsTrans);


    res.status(200).json({ status: 200, value: "Created" })

}
