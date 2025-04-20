import React from "react";
import _ from 'lodash'
function Header() {
  return (
    <header className="header">
      <div className="search-bar">
        <input type="text" placeholder="Search or start a new chat" />
      </div>
      <div className="profile">
        <img
          src={`https://picsum.photos/id/${_.random(1,1000)}/200/300`}
          alt="Profile"
          className="profile-image"
        />
      </div>
    </header>
  );
}

export default Header;