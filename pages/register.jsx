import React, {useState} from 'react';
import axios from 'axios';
import Layout from '../components/layout'

function register(credential, cb, fb){
    console.log(credential);
    axios.post('/api/user/signup',{
        ...credential
    }).then((res)=>{
        console.log(res);
    }).catch(err=>{
        console.error(err);
        fb();
    })
}

export default function(){
    const [credential, setCredential] = useState({
        email: '',
        name: '',
        password: ''
    });
    const [error, setError] = useState('')
    return(
        <Layout>
            register form
            {error}
            <form>
                <input 
                    type="text" 
                    onChange={(e)=>setCredential({...credential, name: e.target.value})}
                    value={credential.name}></input>
                <input 
                    type="email" 
                    onChange={(e)=>setCredential({...credential, email: e.target.value})}
                    value={credential.email}></input>
                <input 
                    type="password" 
                    onChange={(e)=>setCredential({...credential, password: e.target.value,})}
                    value={credential.password}></input>
                <button type="button" onClick={(e)=>{
                    register(credential, ()=>{}, (mes)=>setError(mes));
                    e.preventDefault();
                }}> register</button> 
            </form>
        </Layout>
    )
}
