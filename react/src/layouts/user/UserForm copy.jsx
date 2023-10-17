import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../contexts/UserContextProvider";
import axiosClient from "../../axios-client";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function UserForm() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [errors,setErrors] = useState();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);

    if(id){
        useEffect(()=>{
            setLoading(true);
            axiosClient.get(`/users/${id}`)
            .then(({data})=>{
                setUser(data);
                setLoading(false);
                //console.log(user);
            })
            .catch(()=>{
                setLoading(false);
            })
        },[])
    }

    const onSubmit = (ev) => {
        ev.preventDefault();

        if(user.id){
            axiosClient.put(`/users/${user.id}`,user)
            .then(()=>{
                console.log(user);
                
                navigate('/users')
            })
            .catch(err=>{
                const response = err.response;
                if(response && response.status === 422){
                  setErrors(response.data.errors);
                  
                }
                setErrors(response.data.errors);
                  
            })
        } else {
            axiosClient.post(`/users`,user)
            .then(()=>{
                //notification
                navigate('/users')
            })
            .catch(err=>{
                const response = err.response;
                if(response && response.status === 422){
                  setErrors(response.data.errors);
                  
                }
                setErrors(response.data.errors);
                  
            })
        }
    }

    return (
    <div>
        <div>
            {user.id && <h2>Users Form { user.name }</h2>}
            {!user.id && <h2>New user</h2>}
            <div>
                {loading && (
                    <div>Loading...</div>
                )}
                { errors &&
                    <div class="alert alert-danger d-flex align-items-start flex-column" role="alert">
                        {
                            Object.keys(errors).map(key=>(
                            <span key={key}>{errors[key][0]}</span>
                            ))
                        }
                    </div>
                }
            </div>
            {!loading && (
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name: </label>
                        <input value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email: </label>
                        <input value={user.email}  onChange={ev => setUser({...user, email: ev.target.value})}type="email" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label ">Password: </label>
                        <input  onChange={ev => setUser({...user, password: ev.target.value})} type="password" className="form-control"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label ">Password confirmation: </label>
                        <input  onChange={ev => setUser({...user, password_confirmation: ev.target.value})} type="password" className="form-control"/>
                    </div>
                    <button type="submit">Save</button>
                </form>
            )}
        </div>
        
    </div>
    );
}
  