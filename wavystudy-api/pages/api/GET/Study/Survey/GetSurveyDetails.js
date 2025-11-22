export default async function handler(req, res) {
	try {
		let FixCors = await import("../../../../../contract/fixCors.js");
		await FixCors.default(res);
	} catch (error) {}

	let useContract = await import("../../../../../contract/useContract.ts");
	const {contract, signerAddress, sendTransaction, ParseBigNum, ReadContractByQuery} = await useContract.default();

	let survey_element = await ReadContractByQuery(contract, ( "_surveyMap"), [Number(req.query.surveyid)]);
	var new_survey = {
		id: Number(survey_element.survey_id),
		study_id: Number(survey_element.study_id),
		user_id: Number(survey_element.user_id),
		name: survey_element.name,
		description: survey_element.description,
		date: survey_element.date,
		image: survey_element.image,
		reward: ParseBigNum(survey_element.reward),
		submission: Number(survey_element?.submission)
	};
	let allCategory = [];

	let totalCategories = await ReadContractByQuery(contract, ( "_SurveyCategoryIds"));
	for (let i = 0; i < Number(totalCategories); i++) {
		let element = await ReadContractByQuery(contract, ( "_categoryMap"), [Number(i)]);
		allCategory.push({
			name: element.name,
			image: element.image
		});
	}

	let secionElement = await ReadContractByQuery(contract, ( "_sectionsMap"), [Number(req.query.surveyid)]);
	let final = {
		Survey: new_survey,
		Sections: JSON.parse(secionElement),
		Categories: allCategory
	};


	res.status(200).json({status: 200, value: final});
	return;
}

