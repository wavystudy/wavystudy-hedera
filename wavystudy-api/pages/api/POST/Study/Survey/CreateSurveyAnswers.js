import {  ContractFunctionParameters } from '@hashgraph/sdk';

export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) { }


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  let useContract = await import("../../../../../contract/useContract.ts");
  const { sendTransaction } = await useContract.default();


  if (req.method !== 'POST') {
    res.status(405).json({ status: 405, error: "Method must have POST request" })
    return;
  }
  const data = Object.keys(req.body)[0];
  let alldata = JSON.parse(data);

  for (let i = 0; i < alldata.length; i++) {
    const item = alldata[i];
    const { studyid, userid, surveyid, sectionid, questionid, answer } = item;
    let paramsTrans = new ContractFunctionParameters()
      .addUint256(Number(studyid))
      .addUint256(Number(userid))
      .addUint256(Number(surveyid))
      .addString(sectionid)
      .addString(questionid)
      .addString(answer);

    await sendTransaction("CreateQuestionAnswer", paramsTrans);
    await sleep(1000);
  }


  res.status(200).json({ status: 200, value: "Created" })

}
