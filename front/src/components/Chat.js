import React from 'react';

const rooms =[
    "room1",'room2'
]

const Chat = ({message,currentChat,allUsers,handleMessageChange,toggleChat,yourId,connectedRooms,joinRoom
   ,sendMessage ,messages})=>{
    const renderRooms = (room)=>{
        const currentChat = {
            chatName:room,
            isChannel:true,
            receiverId:""
        }
        return (
            <div onClick={()=>toggleChat(currentChat)} key={room}>
                {room}
            </div>
        )
    }

    const renderUsers = (user)=>{
        if(user.id === yourId){
            return(
                <div key={user.id}>You : {user.username}</div>
            )
        }
        const currentChat = {
            chatName:user.username,
            isChannel:false,
            receiverId:user.id
        }
        return (
            <div onClick={()=>toggleChat(currentChat)} key={user.id}>
                {user.username}
            </div>
        )
    }

    const renderMessages = (message,index)=>{
        return(
            <div key={index}>
                <h3>{message.sender}</h3>
                <p>{message.content}</p>
            </div>
        )
    }

    const handleKeyPress = (e)=>{
        if(e.key==="Enter"){
            sendMessage()
        }
    }

    let body;

    if(!currentChat.isChannel || connectedRooms.includes(currentChat.chatName)){
        body = (
            <div>{messages.map(renderMessages)}</div>
        )
    }else{
        body = (
            <button onClick={()=>joinRoom(currentChat.chatName)}>Join {currentChat.chatName}</button>
        )
    }
    
    
    return(
        <div>
            <div>
                <h3>Channels</h3>
                {rooms.map(renderRooms)}
                <h3>All Users</h3>
                {allUsers.map(renderUsers)}
            </div>
            <div>
                <div>
                    {currentChat.chatName}
                </div>
                <div>
                    {body}
                </div>
                <textarea value={message}onChange={handleMessageChange}
                onKeyPress={handleKeyPress}

                ></textarea>
            </div>
        </div>
    )
}

export default Chat;