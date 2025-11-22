import {  ContractFunctionParameters } from '@hashgraph/sdk';

export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}


    let useContract = await import("../../../contract/useContract.ts");
    const {contract,  sendTransaction, ReadContractByQuery,ParseBigNum} = await useContract.default();
  
    if (req.method !== 'POST') {
      res.status(405).json({ status: 405, error: "Method must have POST request" })
      return;
    }
  
    const { userid, image } = req.body;
    let details_element = await ReadContractByQuery(contract, ("getUserDetails"), [Number(userid)]);
  

	let paramsTrans = new ContractFunctionParameters()
    .addUint256(Number(userid))
    .addString(image)
    .addUint256(ParseBigNum(details_element[1]) * 1e8);


    await sendTransaction( "UpdateUser",paramsTrans);
    res.status(200).json({ status: 200, value: "Updated!" })
  
  }
  