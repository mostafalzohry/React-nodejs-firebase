import React, { useState } from "react";
import Text from "../elements/Text";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { NavLink, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    left: false,
  });

  const user = useSelector((state) => state.user.value);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(err);
      });
  };

  return (
    <>
      <nav className="flex justify-between px-3 pt-8">
        <div className="flex items-center space-x-2">
          <Text className="text-white font-bold text-xl">
            Welcome, <span> {user.displayName} </span>
          </Text>
          <button
            className="px-6 py-2 text-xs text-white bg-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
