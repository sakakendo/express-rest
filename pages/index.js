import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import { RootContext } from '../components/Context';

function getTodo(token, cb) {
  axios.get('/api/task', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      cb(res.data.resource);
    })
    .catch(err => {
      console.error(err);
    })
}

function createTask(token, task, cb, fb){
  axios.post('/api/task', task, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
    .then(res => cb(res.data.resource))
    .catch(err => fb(err));
}

function updateTask(token, task, cb, fb){
  axios.put(`/api/task/${task._id}`, task, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res=>{
    cb(res.data.resource);
  }).catch(err=>{
    fb(err)
  });
}

function TodoItem({ item, mode, updateItem }) {
  const { title, note, completed } = item;
  const {user} = useContext(RootContext);
  const {token} = user;
  if ((mode === 1 && completed) || (mode === 2 && !completed)) return null;
  return (
    <div className="item">
      <label className="container">
        <input 
          type="checkbox"
          checked={completed? 'checked': ''} 
          onChange={()=>{
          updateTask(token, {...item, completed: !completed}, 
            (res) => updateItem(res), console.error);
        }}></input>
        <span className="checkmark"/>
      <input
        type="text"
        value={title}
        onBlur={(e)=>{
          updateTask(token, item, console.log, console.error)
        }}
        onChange={(e) => {
          updateItem({ ...item, title: e.target.value })
        }}></input>
      </label>
    </div>
  )
}

function TodoList({ items, setItems }) {
  const [mode, setMode] = useState(0);
  return (
    <>
      {
        items.map((item, i) =>
          <TodoItem key={i} item={item} mode={mode} updateItem={(item) => {
            const _items = items.slice()
            _items[i] = item;
            setItems(_items)
          }} />)
      }
      <button  
        className={`${mode === 0? 'active': ''}`} 
        onClick={() => setMode(0)}>all</button>
      <button 
        className={`${mode === 1? 'active': ''}`} 
        onClick={() => setMode(1)}>active</button>
      <button 
        className={`${mode === 2? 'active': ''}`} 
        onClick={() => setMode(2)}>completed</button>
    </>
  )
}

function NewTodoForm({ onCreate }) {
  const [title, setTitle] = useState('');
  return (
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
        onChange={(e) => setTitle(e.target.value)}
        placeholder="input new task"></input>
    </form>
  )
}

function Todo() {
  const [items, setItems] = useState([]);
  const { user } = useContext(RootContext);
  const {token} = user;
  useEffect(() => {
    getTodo(user.token, setItems)
  }, []);
  return (<>
    <NewTodoForm onCreate={(title) => {
      const task = {
        title,
        note: '',
        completed: false
      };
      createTask(token, task, (resource)=>{
        console.log(resource);
        setItems([resource].concat(items))
      }, (error)=>{
        console.error(error);
      });
    }} />
    <TodoList
      items={items}
      setItems={setItems} />
  </>)
}

function Dashboard() {
  return (
    <div className="dashboard">
      <Todo />
    </div>
  )
}

function Home() {
  const { user } = useContext(RootContext);
  if (user.token) return <Dashboard />
  else return <h1>hello world. this is awesome TodoApp</h1>
}

export default function () {
  return (
    <Layout>
      <Home />
    </Layout>
  );
}
