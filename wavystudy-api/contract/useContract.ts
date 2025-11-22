
import { Buffer } from "buffer";
import {
	Client,
	AccountId,
	ContractExecuteTransaction,
} from "@hashgraph/sdk";
import { ethers } from 'ethers';
import erc20 from './deployments/hedera/WavyStudy.json';
import config from './config.json';



export default async function useContract() {

	const providerURL = 'https://testnet.hashio.io/api';
	const provider = new ethers.JsonRpcProvider(providerURL, {
		chainId: 296,
		name: 'hedera-testnet'
	});
	let signer = provider;

	const contract = new ethers.Contract(erc20.address, erc20.abi, signer)
	let contractInstance = {
		ParseBigNum: ParseBigNum,
		contract: contract,
		signerAddress: "",
		sendTransaction: sendTransaction,
		ReadContractByQuery: ReadContractByQuery
	};

	return contractInstance;
}

async function sendTransaction(method, params, price = null) {
	const client = Client.forTestnet().setOperator(
		config.Operator_ID, config.Operator_key
	);

	let contractID = (await AccountId.fromEvmAddress(0, 0, erc20.address)).toString()

	const trans = new ContractExecuteTransaction()

		.setContractId(contractID)
		.setGas(2000000)
		.setFunction(method, params);
	if (price != null) {
		trans.setPayableAmount((price));
	}


	let output = await 	trans.execute(client);
	return output;

}

export const ParseBigNum = (num) => Number(num) / 1e8


async function ReadContractByQuery(contract,query, args = []) {
	return await contract[query](...args)
}

export function base64DecodeUnicode(base64String) {
	return Buffer.from(base64String, "base64").toString('utf8');
}
