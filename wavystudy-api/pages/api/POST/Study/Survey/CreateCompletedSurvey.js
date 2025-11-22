import {  ContractFunctionParameters } from '@hashgraph/sdk';

export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}



  let useContract = await import("../../../../../contract/useContract.ts");
  const {contract, ParseBigNum, sendTransaction, ReadContractByQuery} = await useContract.default();
    
  if (req.method !== 'POST') {
    res.status(405).json({ status: 405, error: "Method must have POST request" })
    return;
  }

  const { surveyid, userid, date, studyid } = req.body;

	let survey_element = await ReadContractByQuery(contract, ("_surveyMap"), [Number(surveyid)]);
  
	let details_element = await ReadContractByQuery(contract, ("getUserDetails"), [Number(userid)]);
  
  
  let credits = ParseBigNum(details_element[1]) + ParseBigNum(survey_element.reward)
  let paramsTrans1 = new ContractFunctionParameters()
	.addUint256(Number(userid))
	.addString(details_element[0])
	.addUint256((Number(credits) * 1e8));


  await sendTransaction( "UpdateUser",paramsTrans1);
  let paramsTrans2 = new ContractFunctionParameters()
	.addUint256(Number(surveyid))
	.addUint256(Number(userid))
	.addString(date)
	.addUint256(Number(studyid));

  await sendTransaction( "CreateCompletedSurveys",paramsTrans2);

  res.status(200).json({ status: 200, value: "Created" })

}
