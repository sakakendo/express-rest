import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import {RootContext} from '../components/Context';

function getTodo(token, cb){
    axios.get('/api/task', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res=>{
            cb(res.data.resource);
        })
        .catch(err=>{
            console.error(err);
        })
}

function TodoItem({item, updateItem}){
    const {title, note, completed} = item;
    return(
        <div>
            <button
                onClick={()=>
                    updateItem({
                        ...item,
                        completed: !completed
                    })
                }>{
                    completed ? 'x' : 'o' 
                }</button>
            <input 
                type="text" 
                value={title} 
                onChange={(e)=>{
                    updateItem({...item, title: e.target.value})
                }}></input>
        </div>
    )
}

function TodoList({items, setItems}){
    return(
        <>{
            items.map((item, i)=>
                <TodoItem key={i} item={item} updateItem={(item)=>{
                    const _items = items.slice()
                    _items[i]=item;
                    setItems(_items)
                }}/>)
        }</>
    )
}

function NewTodoForm({onCreate}){
    const [title, setTitle] = useState('');
    return(
        <form onSubmit={
            (e) => {
                e.preventDefault();
                onCreate(title);
                setTitle('');
            }
        }>
            <input 
                type="text" 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)}
                placeholder="input new task"></input>
        </form>
    )
}

function Todo(){
    const [items, setItems] = useState([]);
    const [mode, setMode] = useState(0);
    const {user} = useContext(RootContext);
    useEffect(()=>{
        getTodo(user.token, setItems)
    },[]);
    return(<>
        <NewTodoForm onCreate={(title)=>{
            const task = [{
                title,
                note: '',
                completed: false
            }];
            setItems(task.concat(items));
        }}/>
        <TodoList 
            items={(()=>{
                if(mode===0) return items
                if(mode===1) return items.filter(item=>item.completed === false)
                if(mode===2) return items.filter(item=>item.completed === true)
            })()} 
            setItems={setItems} />
        <button onClick={()=>setMode(0)}>all</button>
        <button onClick={()=>setMode(1)}>active</button>
        <button onClick={()=>setMode(2)}>completed</button>
    </>)
}

function Dashboard(){
    return(
        <div>
            <Todo />
        </div>
    )
}

function Home(){
    const {user} = useContext(RootContext);
    if(user.token) return <Dashboard/>
    else return <h1>hello world. this is awesome TodoApp</h1>
}

export default function(){
    return(
        <Layout>
            <Home/>
        </Layout>
    );
}
