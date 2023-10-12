import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../contexts/UserContextProvider";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";

export default function UserForm() {

    return (
    <div className="content">
        <div className="w-100"><h2>Users Form</h2></div>
        <div className="form-control"><Link to="/user/new">Add new</Link></div>
    </div>
    );
}
  