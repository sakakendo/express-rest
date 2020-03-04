import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { RootContext } from './Context';

export default function ({ children }) {
  const [user, setUser] = useState({
    token: null
  })
  const setToken = function (token) {
    localStorage.setItem('token', token);
    setUser({ ...user, token })
  }

  const logout = function () {
    localStorage.removeItem('token');
    setUser({
      token: null
    })
    Router.push('/');
  }

  useEffect(() => {
    if (!user.token && localStorage.getItem('token'))
      setUser({ token: localStorage.getItem('token') })
  }, [])
  return (
    <>
      <RootContext.Provider value={{
        user,
        setToken,
        setUser
      }}>
        <>
          <nav>
            <ul>
              <li><Link href="/"><a>home</a></Link></li>
              {
                user.token
                  ? <li><a className="logout" onClick={logout}>logout</a></li>
                  : <>
                    <li><Link href="/login"><a>login</a></Link></li>
                    <li><Link href="/register"><a>register</a></Link></li>
                  </>
              }
            </ul>
          </nav>
        </>
        {children}
        {
          user.token ? 'loged in' : 'not loged in'
        }
      </RootContext.Provider>
    </>
  )
}
