import {  ContractFunctionParameters } from '@hashgraph/sdk';

export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}


    let useContract = await import("../../../../contract/useContract.ts");
    const { sendTransaction} = await useContract.default();
    
    if (req.method !== 'POST') {
      res.status(405).json({ status: 405, error: "Method must have POST request" })
      return;
    }
  
    const { studyid,userid,given_permission } = req.body;
    let paramsTrans = new ContractFunctionParameters()
    .addUint256(Number(studyid))
    .addUint256(Number(userid))
    .addString((new Date()).toISOString())
    .addString(given_permission);
  
  
    await sendTransaction( "CreateOngoingStudy",paramsTrans);
           
    res.status(200).json({ status: 200, value: "Created" })
  
  }
  