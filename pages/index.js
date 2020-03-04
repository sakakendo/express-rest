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
  }).then(res=>{
    cb(res.data.resource);
  }).catch(err=>{
    fb(err.data.error)
  });
}

function updateTask(token, task, cb, fb){
  console.log(task);
  axios.put(`/api/task/${task._id}`, task, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res=>{
    cb(res.data.resource);
  }).catch(err=>{
    fb(err.data.error)
  });
}

function TodoItem({ item, mode, updateItem }) {
  const { title, note, completed } = item;
  const {user} = useContext(RootContext);
  const {token} = user;
  if ((mode === 1 && item.completed) || (mode === 2 && !item.completed)) return null;
  return (
    <div>
      <button
        onClick={() =>{
          const _item = {
            ...item,
            completed: !completed
          };
          updateTask(token, _item, (res)=>updateItem(res), console.error);
        }}>{
          completed ? 'x' : 'o'
        }</button>
      <input
        type="text"
        value={title}
        onBlur={(e)=>{
          updateTask(token, item, console.log, console.error)
        }}
        onChange={(e) => {
          updateItem({ ...item, title: e.target.value })
        }}></input>
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
      <button onClick={() => setMode(0)}>all</button>
      <button onClick={() => setMode(1)}>active</button>
      <button onClick={() => setMode(2)}>completed</button>
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
    <div>
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
