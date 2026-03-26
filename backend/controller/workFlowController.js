const WorkFlow = require('../models/WorkFlow');
const User = require('../models/User');
const Event = require('../models/Event');


const workflowController = [
    {
        role: "headOfSection",
        approvedCondition: (workflow, message , eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "headOfSection").status = "approved";
            workflow.workFlowContent.findLast(item => item.role === "headOfSection").message = message;
            workflow.workFlowContent.push({role: "welfareOfficer", status: "pending", message: ""});
            return workflow.workFlowContent;
        },
        rejectCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "headOfSection").status = "rejected";
            workflow.workFlowContent.findLast(item => item.role === "headOfSection").message = message;
            workflow.workFlowContent.push({role: "organizer", status: "pending", message: ""});
            return workflow.workFlowContent;
        }
    },
    {
        role: "welfareOfficer",
        approvedCondition: (workflow, message, eventObj) => {
            if(workflow.workFlowContent.filter(item => item.role === "welfareOfficer").every(item => item.status === "rejected" || item.status === "pending")) {
                workflow.workFlowContent.findLast(item => item.role === "welfareOfficer").status = "approved";
                workflow.workFlowContent.findLast(item => item.role === "welfareOfficer").message = message;
                if (eventObj.venue == "Faculty" || eventObj.venue == "Hadwila Auditorium" || eventObj.venue == "Ehelavala") {
                    workflow.workFlowContent.push({role: "facultyDean", status: "pending", message: ""});
                }else {
                    workflow.workFlowContent.push({role: "sportDerector", status: "pending", message: ""});
                }
                
                return workflow.workFlowContent;
            }else {
                workflow.workFlowContent.findLast(item => item.role === "welfareOfficer").status = "approved";
                workflow.workFlowContent.findLast(item => item.role === "welfareOfficer").message = message;
                workflow.workFlowContent.push({role: "completed", status: "approved", message: ""});
                return workflow.workFlowContent;
            }
        },
        rejectCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "welfareOfficer").status = "rejected";
            workflow.workFlowContent.findLast(item => item.role === "welfareOfficer").message = message;
            workflow.workFlowContent.push({role: "organizer", status: "pending", message: ""});
            return workflow.workFlowContent;
        },
    },
    {
        role: "facultyDean",
        approvedCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "facultyDean").status = "approved";
            workflow.workFlowContent.findLast(item => item.role === "facultyDean").message = message;
            workflow.workFlowContent.push({role: "sportDerector", status: "pending", message: ""});
            return workflow.workFlowContent;
        }
        ,
        rejectCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "facultyDean").status = "rejected";
            workflow.workFlowContent.findLast(item => item.role === "facultyDean").message = message;
            workflow.workFlowContent.push({role: "organizer", status: "pending", message: ""});
            return workflow.workFlowContent;
        }

    },
    {
        role: "sportDerector",
        approvedCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "sportDerector").status = "approved";
            workflow.workFlowContent.findLast(item => item.role === "sportDerector").message = message;
            if (eventObj.category === "cultural") {
                workflow.workFlowContent.push({role: "chairmanOfArt", status: "pending", message: ""});
            }else {
                workflow.workFlowContent.push({role: "proctor", status: "pending", message: ""});
            }
            
            return workflow.workFlowContent;
        }
        ,
        rejectCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "sportDerector").status = "rejected";
            workflow.workFlowContent.findLast(item => item.role === "sportDerector").message = message;
            workflow.workFlowContent.push({role: "organizer", status: "pending", message: ""});
            return workflow.workFlowContent;
        }
    },
    {
        role: "chairmanOfArt",
        approvedCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "chairmanOfArt").status = "approved";
            workflow.workFlowContent.findLast(item => item.role === "chairmanOfArt").message = message;
            workflow.workFlowContent.push({role: "proctor", status: "pending", message: ""});
            return workflow.workFlowContent;
        },
        rejectCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "chairmanOfArt").status = "rejected";
            workflow.workFlowContent.findLast(item => item.role === "chairmanOfArt").message = message;
            workflow.workFlowContent.push({role: "organizer", status: "pending", message: ""});
            return workflow.workFlowContent;
        }
    },
    {
        role: "proctor",
        approvedCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "proctor").status = "approved";
            workflow.workFlowContent.findLast(item => item.role === "proctor").message = message;
            workflow.workFlowContent.push({role: "viceChancellor", status: "pending", message: ""});
            return workflow.workFlowContent;
        },
        rejectCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "proctor").status = "rejected";
            workflow.workFlowContent.findLast(item => item.role === "proctor").message = message;
            workflow.workFlowContent.push({role: "organizer", status: "pending", message: ""});
            return workflow.workFlowContent;
        }
    },
    {
        role: "viceChancellor",
        approvedCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "viceChancellor").status = "approved";
            workflow.workFlowContent.findLast(item => item.role === "viceChancellor").message = message;

            const [hour, minute] = eventObj.endTime.split(":").map(Number);

            if (hour > 18 || (hour === 18 && minute > 0)) {
                workflow.workFlowContent.push({role: "headOfSection", status: "pending", message: ""});
            }else {
                workflow.workFlowContent.push({role: "welfareOfficer", status: "pending", message: ""});
            }
            
            return workflow.workFlowContent;
        },
        rejectCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "viceChancellor").status = "rejected";
            workflow.workFlowContent.findLast(item => item.role === "viceChancellor").message = message;
            workflow.workFlowContent.push({role: "organizer", status: "pending", message: ""});
            return workflow.workFlowContent;
        }
    },
    {
        role: "organizer",
        approvedCondition: (workflow, message, eventObj) => {
            workflow.workFlowContent.findLast(item => item.role === "organizer").status = "approved";
            workflow.workFlowContent.findLast(item => item.role === "organizer").message = message;
            const rejectedRole = workflow.workFlowContent.findLast(item => item.status === "rejected").role;
            workflow.workFlowContent.push({role: rejectedRole, status: "pending", message: ""});
            return workflow.workFlowContent;
        }
    }
];


const getWorkFlowByRole = async (req, res) => {
    try {

        const {userId} = req.body;

        const user = await User.findById(userId);

        if(!user) {
            return res.send({success: false, message: "Invalid User"})
        }

        const role = user.adminProfile.role;

        const workflow = await WorkFlow.findOne({
            $expr: {
                $eq: [
                    { $arrayElemAt: ["$workFlowContent.role", -1] },
                    role
                ]
            }
        });

        if(!workflow) {
            return res.send({success: false, message: "No workflow found for the user's role"})
        }

        const event = await Event.findById(workflow.eventId);

        const organizer = await User.findById(event.organizationId);

        const eventObj = event.toObject();

        delete eventObj.organizationId;

        eventObj.organizerProfile = organizer
            ? organizer.organizerProfile
            : { name: "Unknown Organizer" };
        
        return res.send({success: true, message: {workflowId: workflow._id, workflowContent: workflow.workFlowContent, event: eventObj}})

    } catch (error) {
        return res.send({success: false, message: "Error fetching workflow: " + error.message})
    }
}


const updateWorkFlowStatus = async (req, res) => {
    try {
        const {userId, status, message} = req.body;

        const user = await User.findById(userId);

        if(!user) {
            return res.send({success: false, message: "Invalid User"})
        }

        const role = user.adminProfile.role;

        

        const workflow = await WorkFlow.findOne({
            $expr: {
                $eq: [
                    { $arrayElemAt: ["$workFlowContent.role", -1] },
                    role
                ]
            }
        });

        if(!workflow) {
            return res.send({success: false, message: "No workflow found for the user's role"})
        }

        const event = await Event.findById(workflow.eventId);

        const organizer = await User.findById(event.organizationId);

        const eventObj = event.toObject();

        delete eventObj.organizationId;

        eventObj.organizerProfile = organizer
            ? organizer.organizerProfile
            : { name: "Unknown Organizer" };

        const workflowHandler = workflowController.find(item => item.role == role);
        
        if(!workflowHandler) {
            return res.send({success: false, message: "No workflow handler found for the user's role"})
        }

        if(status === "approved") {
            
            workflow.workFlowContent = workflowHandler.approvedCondition(workflow, message, eventObj);

        } else if(status === "rejected") {
            
            workflow.workFlowContent = workflowHandler.rejectCondition(workflow, message, eventObj);
            
        }

        if (workflow.workFlowContent.findLast(item => item.role === "completed")) {
            event.isApproved = true;
            await event.save();
        }
        
        await workflow.save();
        
        return res.send({success: true, message: "Workflow approved successfully", workflowContent: workflow.workFlowContent, event: eventObj})

        
    } catch (error) {
        return res.send({success: false, message: "Error updating workflow: " + error.message })
    }
}


exports.getWorkFlowByRole = getWorkFlowByRole;
exports.updateWorkFlowStatus = updateWorkFlowStatus;