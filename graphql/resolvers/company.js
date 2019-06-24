const Company = require('../../models/company');

module.exports = {
    companies: () => {
        return Company
            .find()
            .then(companies => companies.map(company => {
                return {
                    ...company._doc,
                };
            }))
            .catch(err => {
                throw err;
            });
    },
    addCompany: (args, req) => {
        if(!req.isAuth){
            throw new Error("User not authenticated!");
        }

        const company = new Company({
            name: args.companyInput.name,
            description: args.companyInput.description,
            isCustom: true,
            imgPath: ""
        });

        return Company.findOne({ name: args.companyInput.name })
            .then(comp => {
                if(comp){
                    throw new Exception('Company already exists!');
                }
                return company.save();
            })
            .then(company => {
                return { ...company._doc }
            })
            .catch(err => { 
                throw err
            });
    }
};