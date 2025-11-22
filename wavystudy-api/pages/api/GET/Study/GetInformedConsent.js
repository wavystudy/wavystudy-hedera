
export default async function handler(req, res) {
    try {
        let FixCors = await import("../../../../contract/fixCors.js");
        await FixCors.default(res);
    } catch (error) { }

    let useContract = await import("../../../../contract/useContract.ts");
    const { contract, signerAddress,ParseBigNum, sendTransaction, ReadContractByQuery } = await useContract.default();
    const { study_id, user_id } = req.query;

    //Current Age
    let fhir_element = await ReadContractByQuery(contract, ( "_fhirMap"), [Number(user_id)]);
    var bDate = new Date(fhir_element.birth_date);
    var nDate = new Date()
    let currentAge = nDate.getFullYear() - bDate.getFullYear(); //36


    let study_element = await ReadContractByQuery(contract, ( "_studyMap"), [Number(study_id)]);

    //Load Ages

    let ages_groups = [];
    try {
        let ages = await ReadContractByQuery( contract,("_studyAges"), [Number(study_id)]);

        if (ages !== '')
            ages_groups = JSON.parse(ages);
    } catch (e) { }

    //Elligible Age
    let eligible_age_group = ages_groups.filter((val) => {
        if (!val.older) {
            //20 < 36 && 36 < 25
            if (val.from < currentAge && currentAge < val.to) {
                return true;
            }
        } else {
            // 25 < 36 
            if (val.from < currentAge) return true;
        }
        return false;
    });

    //Load Study Title
    let study_title = {};

  
    try {
        let titles = await ReadContractByQuery( contract,("_studyTitles"), [Number(params.id)]);
        if (titles !== "")
            study_title = JSON.parse(titles);
    } catch (e) { }
    



    //Elligible 
 
    let study_title_elligible = "";
    if (eligible_age_group.length > 0) {
        study_title_elligible = study_title[eligible_age_group[0]?.id];
    }



    var newStudy = {
        id: Number(study_id),
        title: study_element.title,
        image: study_element.image,
        description: study_element.description,
        contributors: Number(study_element.contributors),
        audience: Number(study_element.audience),
        budget: ParseBigNum(study_element.budget),
        permissions: (study_element.permission),
        study_title: study_title_elligible,
        ages_groups: ages_groups,
        eligible_age_group: eligible_age_group
    };

    
    res.status(200).json({ status: 200, value: JSON.stringify(newStudy) })
    
    return;

}
