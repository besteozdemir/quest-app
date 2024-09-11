import React from "react";
import { Avatar, CardContent, InputAdornment, OutlinedInput, Link as MuiLink } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: "white",
  width: "100%",
  '& .MuiInputBase-input': {
    color: 'black',
  },
  '&.Mui-disabled .MuiInputBase-input': {
    color: 'black',
    '-webkit-text-fill-color': 'black',
  },
  '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: 'black',
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

const Comment = (props) => {
  const { text, userId, userName } = props;

  // Safeguard to ensure userName is not undefined before using charAt
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
    <StyledCardContent>
      <StyledOutlinedInput
        disabled
        id="outlined-adornment-amount"
        multiline
        inputProps={{ maxLength: 25 }}
        fullWidth
        value={text}
        startAdornment={
          <InputAdornment position="start">
            <StyledLink to={`/users/${userId}`}>
              <StyledAvatar aria-label="recipe">
                {initial}
              </StyledAvatar>
            </StyledLink>
          </InputAdornment>
        }
      />
    </StyledCardContent>
  );
}

export default Comment;
