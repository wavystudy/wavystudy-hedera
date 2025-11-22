import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import erc20 from '../contracts/deployments/hedera/WavyStudy.json';
import {ContractExecuteTransaction, Hbar,AccountId} from '@hashgraph/sdk'
import {
	executeTransaction,
	signerAddress
} from "../services/hashconnect";

export default function useContract() {

	const [contractInstance, setContractInstance] = useState({

		contract: null,
		sendTransaction: sendTransaction,
		ReadContractByQuery: ReadContractByQuery,
	});


	useEffect(() => {
		const fetchData = async () => {

			const providerURL = 'https://testnet.hashio.io/api';
			const provider = new ethers.providers.JsonRpcProvider(providerURL, {
				chainId: 296,
				name: 'hedera-testnet'
			});
			let signer = provider;

			const contract = new ethers.Contract(erc20.address, erc20.abi, signer)
			window.contract = contract;
			let contractIns = {

				contract: contract,
				sendTransaction: sendTransaction,
				ReadContractByQuery: ReadContractByQuery,
			}
			setContractInstance(contractIns);
		};

		fetchData();
	}, []);


	async function sendTransaction(method, params,price=null) {


		let contractID = (await  AccountId.fromEvmAddress(0,0,erc20.address)).toString()

		const trans = new ContractExecuteTransaction()
			.setContractId(contractID)
			.setGas(2000000)
			.setFunction(method, params);
		if (price != null){
			trans.setPayableAmount(( price));
		}

		let output = await executeTransaction(signerAddress(), trans);
		return output;

	}

	async function ReadContractByQuery(query, args = []) {
		return await window.contract[query](...args)


	}





	return contractInstance;
}
window.ParseBigNum = (num) => Number(num) / 1e8
