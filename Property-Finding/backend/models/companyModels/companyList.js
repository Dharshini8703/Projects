import mongoose, { now } from 'mongoose';

const companyListSchema = new mongoose.Schema({
    cmp_id: {
        type: String,
        unique: true,
        required: true
    },
    cmp_name: {
        type: String,
        unique: true,
        required: true
    }
});

const CompanyList = mongoose.model('Company_list', companyListSchema);
export default CompanyList;
