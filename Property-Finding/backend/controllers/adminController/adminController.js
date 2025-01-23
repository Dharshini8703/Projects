//for get all Company
const getCompany = async (req, res) => {
    try {
        const companyList = await Company.findAll();
        res.json( companyList );
    }
    catch (error) {
        res.json( { error: error.message } );
    }
}

//for delete specific company
const deleteCompany = async (req, res) => {
    const { companyId } = req.params;
    try {
        const deleted = await Company.destroy( {include: [Agent, PropertyOwner], where: {company_id: companyId}});
        if(deleted){
            res.json("Company Records Deleted");
        }
        else {
            res.json({ error:"Company Records not found" });
        }
    }
    catch (error) {
        res.json( { error: error.message } );
    }   
}

//for get all Agents
const getAllAgent = async (req, res) => {
    try {
        const agentList = await Agent.findAll();
        res.json( agentList );
    }
    catch (error) {
        res.json( { error: error.message } );
    }
}

//for get Agents under specific company
const getAgent = async (req, res) => {
    const { companyId } = req.params;
    try {
        const agentList = await Agent.findAll( { where: {company_id: companyId }} );
        res.json( agentList );
    }
    catch (error) {
        res.json( { error: error.message } );
    }
}

//for Delete specific agent
const deleteAgent = async (req, res) => {
    const { agentId } = req.params;
    try {
        const deleted = await Company.destroy( {include: [Appointment, Property], where: {agent_id: agentId}});
        if(deleted){
            res.json("Company Records Deleted");
        }
        else {
            res.json({ error:"Company Records not found" });
        }
    }
    catch (error) {
        res.json( { error: error.message } );
    }   
}

//for get all PropertyOwner
const getAllPropertyOwner = async (req, res) => {
    try {
        const propertyOwnerList = await PropertyOwner.findAll();
        res.json( propertyOwnerList );
    }
    catch (error) {
        res.json( { error: error.message } );
    }
}

//for get PropertyOwner under specific company
const getPropertyOwner = async (req, res) => {
    const { companyId } = req.params;
    try {
        const propertyOwnerList = await PropertyOwner.findAll( { where: {company_id: companyId }} );
        res.json( propertyOwnerList );
    }
    catch (error) {
        res.json( { error: error.message } );
    }
}

//for delete specific PropertyOwner
const deletePropertyOwner = async (req, res) => {
    const { propertyOwnerId } = req.params;
    try {
        const deleted = await Company.destroy( {include: [Appointment, Property], where: {propertyOwner_id: propertyOwnerId}});
        if(deleted){
            res.json("Company Records Deleted");
        }
        else {
            res.json({ error:"Company Records not found" });
        }
    }
    catch (error) {
        res.json( { error: error.message } );
    }   
}

//for get Clients 
const getClient = async (req, res) => {
    try {
        const clientList = await Client.findAll();
        res.json( clientList );
    }
    catch (error) {
        res.json( { error: error.message } );
    }
}

//for delete specific Client
const deleteClient = async (req, res) => {
    const { clientId } = req.params;
    try {
        const deleted = await Company.destroy( {include: [Appointment, Property], where: {client_id: clientId}});
        if(deleted){
            res.json("Company Records Deleted");
        }
        else {
            res.json({ error:"Company Records not found" });
        }
    }
    catch (error) {
        res.json( { error: error.message } );
    }   
}

export { getCompany, getAllAgent, getAgent, getAllPropertyOwner, getPropertyOwner, getClient};