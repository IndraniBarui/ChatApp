import React from "react";
import _ from 'lodash'
function ChatWindow() {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <img
          src={`https://picsum.photos/id/${_.random(1,1000)}/200/300`}
          alt="Contact Profile"
          className="contact-avatar"
        />
        <span className="contact-name">John Doe</span>
      </div>
      <div className="chat-messages">
        <p className="message sender">Hello!</p>
        <p className="message receiver">Hi, how are you?</p>
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;