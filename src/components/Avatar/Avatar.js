import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ListItem, List, Radio } from "@mui/material";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Avatar(props) {
  const { avatarId, userId, userName } = props;
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(avatarId);

  const currentUserId = localStorage.getItem("currentUser"); // Get current user ID from local storage

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    saveAvatar();
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const saveAvatar = () => {
    fetch("/api" +"http://localhost:8080/users/" + currentUserId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("tokenKey"),
      },
      body: JSON.stringify({
        avatar: selectedValue,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          margin: 5,
        }}
      >
        <CardMedia
          sx={{ height: 370 }}
          image={`/avatars/avatar${selectedValue}.jpg`}
          title="User Avatar"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {userName}
          </Typography>
        </CardContent>
        {currentUserId === "" + userId && ( // Only show button if profile belongs to logged-in user
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button size="small" onClick={handleOpen}>
              Change Avatar
            </Button>
          </CardActions>
        )}
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <List dense>
            {[1, 2, 3, 4, 5, 6].map((key) => {
              const labelId = `checkbox-list-secondary-label-${key}`;
              return (
                <ListItem key={key} button>
                  <CardMedia
                    style={{ maxWidth: 100 }}
                    component="img"
                    alt={`Avatar n°${key}`}
                    image={`/avatars/avatar${key}.jpg`}
                    title="User Avatar"
                  />
                  <Radio
                    edge="end"
                    value={key}
                    onChange={handleChange}
                    checked={"" + selectedValue === "" + key}
                    inputProps={{ "aria-labelledby": labelId }}
                    style={{ marginLeft: "10px" }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Modal>
    </>
  );
}

export default Avatar;
