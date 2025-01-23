// import { DATE, where } from "sequelize";
// import { ClientsAppointments } from "../model/client.js";


// const clientAppointmentWithAgent = async (req,res) => {
//   console.log(req.body);
//   // const {client_id,client_name,client_phone,agent_id,property_id,request_date,status} = req.body;
//   try {
//     // if(!client_id ||!client_name ||!client_phone ||!agent_id ||!property_id ||!request_date ||!status) {
//     //   return res.status(400).send('All fields are required.');
//     // }
//     // const appointment = await ClientsAppointments.create(req.body);
//     const appointment1 = await ClientsAppointments.update(req.body,{where:{agent_id:'AGE#1001'}});
//     res.status(200).send('Appointment Request sent successfully');
//   } catch (error) {
//     // console.log(error);
//     // res.status(500).send('Internal server error!!!');
//     res.status(500).json({error:error.message});
//   }
// }

// export { clientAppointmentWithAgent };