import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import { RootContext } from '../components/Context';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

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

function TodoItem({ item, mode, editing, onEdit, finishEdit, updateItem }) {
  const { title, note, completed } = item;
  const {user} = useContext(RootContext);
  const {token} = user;
  if ((mode === 1 && completed) || (mode === 2 && !completed)) return null;
  return (
      <li className={`${editing} ${completed? 'completed': ''}`}>
        <div className="view">
          <input 
            type="checkbox"
            className="toggle"
            checked={completed? 'checked': ''} 
            onChange={()=>{
            updateTask(token, {...item, completed: !completed}, 
              (res) => updateItem(res), console.error);
          }}></input>
          <label onDoubleClick={onEdit}>{title}</label>
        </div>
      <input
        type="text"
        className="edit"
        value={title}
        onBlur={(e)=>{
          updateTask(token, item, console.log, console.error);
          finishEdit();
        }}
        onChange={(e) => {
          updateItem({ ...item, title: e.target.value })
        }}
        onKeyDown={(e)=>{
          if(e.which === ESCAPE_KEY) finishEdit();
          else if(e.which === ENTER_KEY){
            updateTask(token, item, console.log, console.error);
            finishEdit();
          }
        }}
        ></input>
      </li>
  )
}

function TodoList({ items, setItems }) {
  const [mode, setMode] = useState(0);
  const [edit, setEdit] = useState(null);
  return (
    <section className="main">
      <ul className="todo-list">
        {
          items.map((item, i) =>
            <TodoItem key={i} item={item} mode={mode} 
              editing={ i === edit ? 'editing': ''} 
              onEdit={()=>setEdit(i)} 
              finishEdit={()=>setEdit(null)} 
              updateItem={(item) => {
                const _items = items.slice()
                _items[i] = item;
                setItems(_items)
              }} />)
        }
      </ul>
      <footer className="footer">
        <span></span>
        <ul className="filters">
          <li>
            <a 
              className={`${mode === 0? 'active': ''}`} 
              onClick={()=>setMode(0)}>All</a>
          </li>
          {' '}
          <li>
            <a 
              className={`${mode === 1? 'active': ''}`} 
              onClick={()=>setMode(1)} >Active</a>
          </li>
          {' '}
          <li>
            <a 
              className={`${mode === 2? 'active': ''}`} 
              onClick={()=>setMode(2)}>Completed</a>
          </li>
        </ul>
      </footer>
    </section>
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
        className="new-todo edit"
        value={title}
        autoFocus={true}
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
      createTask(token, task, 
        (resource)=> setItems([resource].concat(items)) , 
        (error)=> console.error(error));
    }} />
    <TodoList
      items={items}
      setItems={setItems} />
  </>)
}

function Dashboard() {
  return (
    <div className="dashboard">
      <section className="todoapp">
        <h1>todo app</h1>
        <Todo />
      </section>
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
