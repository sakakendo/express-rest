import React, {useState, useContext} from 'react';
import Router from 'next/router';
import axios from 'axios';
import Layout from '../components/layout'
import {RootContext} from '../components/Context';

function login(credential, cb, fb){
    axios.post('/api/user/authenticate',credential)
        .then((res)=>cb(res.data.token))
        .catch(err=>fb(err.response.data.error))
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
            <h1>Login</h1>
            <span>
                {error}
            </span>
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
                    login(credential, (token)=>{
                        setToken(token)
                        Router.push('/')
                    }, (mes)=>setError(mes));
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