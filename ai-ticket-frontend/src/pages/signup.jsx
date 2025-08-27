import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const handleSignup=async(e)=>{
     e.preventDefault();
     setLoading(true)
     try {
    const res=await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`,{
       method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data=await res.json();
      if(res.ok){
        localStorage.setItem("token",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))
        navigate("/")
      }
      else{
        alert(data.message || "signup failed")
      }
     } catch (error) {
      alert("something went wrong")
     }
     finally{
      setLoading(false)
     }
  }

  return (
    <div className='max-h-screen flex items-center justify-center'>
      <div className='card w-full max-w-sm shadow-xl bg-base-100'>
        <form onSubmit={handleSignup} className='card-body'>
          <h2 className='text-center justify-center'>Sign up</h2>
          <input
          type='email'
          name='email'
          value={email}
          placeholder='Email'
          className="input input-bordered mb-3"
          onChange={(e)=>{
           setEmail(e.target.value)
          }}
          />

          <input
          type='password'
          name='password'
          value={password}
          placeholder='password'
          className="input input-bordered mb-4"
          onChange={(e)=>{
           setPassword(e.target.value)
          }}
          />
          <div>
            <button 
            type='submit'
            className='btn btn-primary w-full'
            disabled={loading}>
            {loading?"signing in":"sign up"}
            </button>
          </div>
        </form>

      </div>
      
    </div>
  )
}

export default Signup