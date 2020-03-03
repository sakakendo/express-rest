import React, {useState, useContext} from 'react';
import axios from 'axios';
import Layout from '../components/layout'
import {RootContext} from '../components/Context';

function register(credential, cb, fb){
    console.log(credential);
    axios.post('/api/user/authenticate',{
        ...credential
    }).then((res)=>{
        cb(res.data.token);
    }).catch(err=>{
        console.error(err);
        fb();
    })
}

function LoginForm(){
    const [credential, setCredential] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('')
    const {setToken} = useContext(RootContext);
    return(
        <>
            Login
            {error}
            <form>
                <input 
                    type="email" 
                    onChange={(e)=>setCredential({...credential, email: e.target.value})}
                    value={credential.email}></input>
                <input 
                    type="password" 
                    onChange={(e)=>setCredential({...credential, password: e.target.value,})}
                    value={credential.password}></input>
                <button type="button" onClick={(e)=>{
                    register(credential, setToken, (mes)=>setError(mes));
                    e.preventDefault();
                }}> login</button> 
            </form>
        </>
    )
}


export default function(){
    return (
        <Layout>
            <LoginForm/>
        </Layout>
    )
}