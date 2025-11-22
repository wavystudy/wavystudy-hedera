
export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}

  let useContract = await import("../../../contract/useContract.ts");
  const {contract,  sendTransaction, ReadContractByQuery} = await useContract.default();
	let output = await ReadContractByQuery(contract, ("CheckEmail"), [req.query.email]);
			
  res.status(200).json({ value: output })
}
