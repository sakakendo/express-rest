import React, {useContext} from 'react';
import Layout from '../components/layout';
import {RootContext} from '../components/Context';

function Dashboard(){
    return(
        'dashbaord'
    )
}

function Home(){
    const {user} = useContext(RootContext);
    if(user.token) return <Dashboard/>
    else return 'not logged in'
}

export default function(){
    return(
        <Layout>
            <Home/>
        </Layout>
    );
}
