import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../contexts/UserContextProvider";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";

export default function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState();

    useEffect(()=>{
        getUsers();
    },[])

    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/users')
        .then(({data})=>{
            console.log(data);
            setLoading(false);
            setUsers(data.data);
        })
        .catch(()=>{
            setLoading(false);
        })
    }

    return (
    <div className="content">
        <div className="element text-center">
            <h2>Users list</h2>
        </div>
        <div className="element text-center">
            <Link to="">New users</Link>
        </div>
        <div className="">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Create date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.created_at}</td>
                            <td>
                                <Link to={'/users/'+u.id}>Edit</Link>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
}
  