import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import UserActivity from "../UserActivity/UserActivity";
import { Box } from "@mui/material";  // Import Box for layout

function User() {
  const { userId } = useParams();
  const [user, setUser] = useState();

  const getUser = () => {
    fetch("http://localhost:8080/users/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("tokenKey"),
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          setUser(result);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  return (
    <Box sx={{ display: "flex" }}>
      {user ? (
        <Box sx={{ width: 500, marginRight: 2 }}>
          <Avatar avatarId={user.avatarId} userId={userId} userName={user.userName} sx={{ width: '100%', height: '100%' }} />
        </Box>
      ) : null}
      <UserActivity userId={userId} />
    </Box>
  );
}

export default User;
