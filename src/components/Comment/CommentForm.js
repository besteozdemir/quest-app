import React, { useState } from "react";
import { Avatar, CardContent, InputAdornment, OutlinedInput, Link as MuiLink, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";


const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
    color: "black", // Applies to the text color inside the input field
    backgroundColor: "white",
    width: "100%",
    "& .MuiInputBase-input": {
      color: "black", // Ensures the text color of the input value is black
    },
  }));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  boxShadow: "none",
  color: "inherit", // Changed to inherit to ensure text color matches the theme.
}));

const CommentForm = (props) => {
  const { userId, userName, postId, addComment } = props;
  const [text, setText] = useState("");

  // Safeguard to ensure userName is not undefined before using charAt
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  const saveComment = () => {
    fetch("http://localhost:8080/comments",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : localStorage.getItem("tokenKey"),
            },
            body: JSON.stringify({
                postId: postId,
                userId: userId,
                text: text,
            }),
        })
        .then((res) => res.json())
        .then((newComment) => {
            newComment.userName = userName;
            addComment(newComment);
            setText("");
        })
        .catch((err) => console.log("Error creating post:", err))
}

  const handleSubmit = () => {
    saveComment();
    setText("");
  }
  const handleChange = (value) => {
    setText(value);
  }

  return (
    <StyledCardContent>
      <StyledOutlinedInput
        id="outlined-adornment-amount"
        multiline
        inputProps={{maxLength: 250}}
        fullWidth
        value={text}
        onChange = {(i) => handleChange(i.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <StyledLink to={`/users/${userId}`}>
              <StyledAvatar aria-label="recipe">
                {initial}
              </StyledAvatar>
            </StyledLink>
          </InputAdornment>
        }
        endAdornment = {
            <InputAdornment position = "end">
                <Button
                    variant="contained"
                    style={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: "white" }}
                    onClick={handleSubmit}>
                    Comment
                </Button>
            </InputAdornment>
        }
      />
    </StyledCardContent>
  );
}

export default CommentForm;
