const {meeting} = require("../model/meeting.model")
const {meetingUser} = require("../model/meeting-user.model")

async function getAllMeetingUsers(meetId , callback){
    meetingUser.find({meetingId :  meetId}).then((response)=>{
        return callback(null , response);
    }).catch((error)=>{
        return callback(error);
    });
}

async function startMeeting(params , callback){
    const meetingSchema = new meeting(params)
    meeting.save().then((response)=>{
        return callback(null,response);
    }).catch((error)=>{
        return callback(error);
    });
}

async function joinMeeting(params, callback){
    const meetingUserModel = new meetingUser(params)
    meetingUserModel.save().then(async (response) => {
        await meeting.findOneAndUpdate({id: params.userId},{$addToSet : {"meetingUsers" : meetingUserModel}})
        return callback(null,response)
    }).catch((error)=>{
        return callback(error)
    });
}

async function isMeetingPresent(meetingId,callback){
    meeting.findById(meetingId).populate("meetingUsers","MeetingUser").then((response)=>{
        if(!response) return callback("Meeting id invalid!");
        else return callback(null,response);
    }).catch((error)=>{
        return callback(error)
    });
}

async function getMeetingUser(params, callback){
    const {meetingId , userId} = params
    meetingUser.find({meetingId, userId}).then((response)=>{
        return callback(null,response[0]);
    }).catch((error)=>{
        return callback(error);
    }) ;
}

async function updateMeetingUser(params,callback){
    meetingUser.updateOne({userId : params.userId}, {$set : params}, {new: true}).then((response)=>{
        return callback(null,response)
    }).catch((error)=>{
        return callback(error)
    });
}

async function getUserBySocketId(params,callback){
    const {meetingId, socketId} = params

    meetingUser.find({meetingId,socketId}).limit(1).then((response)=>{
        return callback(null,response);
    }).catch((error)=>{
        return callback(error);
    });
}

module.exports = {getAllMeetingUsers,startMeeting,joinMeeting,isMeetingPresent,getMeetingUser,updateMeetingUser,getUserBySocketId}