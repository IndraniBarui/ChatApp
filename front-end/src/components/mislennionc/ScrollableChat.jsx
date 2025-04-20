import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { useSelector } from 'react-redux';
import { Avatar, Tooltip } from '@mui/material';
const ScrollableChat = ({messages}) => {
    const { user } = useSelector((state) => state.auth);
    console.log(messages,user._id,"uuuuuuuuuuuu")
  return (
    <ScrollableFeed>
 {messages &&
        messages.map((m, i) => (
            <>
        {console.log(m._id,"jjjjj")}
            <div style={{display:"flex"}} key={m._id}>
                {(isSameSender(messages,m,i,user._id)
            || isLastMessage(messages,i,user._id)&&(
                <Tooltip>
                    <Avatar
                   alt={m.sender.name}
                   src={m.sender.pic}
                   sx={{ mt: '7px', mr: 1, width: 32, height: 32, cursor: 'pointer' }}>

                    </Avatar>
                </Tooltip>
            ))}
            <span style={{
                backgroundColor:`${
                    m.sender._id === user._id ? "#616362" : "#57C785"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius:"20px",
                padding:"5px 15px",
                maxWidth:"75%"
            }}>
{m.content}
            </span>
            </div>
            </>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat