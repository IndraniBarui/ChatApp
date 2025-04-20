import React from "react";
import _ from 'lodash'
const chats = [
  { id: 1, name: "John Doe", lastMessage: "Hey there!" },
  { id: 2, name: "Jane Smith", lastMessage: "How are you?" },
  { id: 3, name: "Alice Johnson", lastMessage: "See you later!" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Chats</h2>
      <ul className="chat-list">
        {chats.map((chat) => (
          <li key={chat.id} className="chat-item">
            <img
              src={`https://picsum.photos/id/${_.random(1,1000)}/200/300`}
              alt={chat.name}
              className="chat-avatar"
            />
            <div className="chat-info">
              <span className="chat-name">{chat.name}</span>
              <span className="chat-message">{chat.lastMessage}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;