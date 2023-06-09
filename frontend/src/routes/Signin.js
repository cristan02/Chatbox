import React, { useEffect, useState , useRef} from 'react'
import {Link , useNavigate } from 'react-router-dom'
import axios from "axios"
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import Google from '../components/Google'

function Signin() {

    const navigate = useNavigate()

    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [hidePass , setHidePass] = useState(true)

    const [google , setGoogle] = useState(false)

    const formRef = useRef();

    const login = (e) => {
        e.preventDefault()

        axios.post('http://localhost:5000/signin' , {
            email : email ,
            password : password
        })
        .then((res) => {
            if(res.data.length > 0){
                alert('Welcome ' + res.data[0].name)
                sessionStorage.setItem("id", res.data[0].id)
                sessionStorage.setItem("name", res.data[0].name)
                sessionStorage.setItem("email", res.data[0].email)
                sessionStorage.setItem("image",null)
                navigate("/chat")

            }
            else
                alert('Invalid Credentials')
             
        })

        formRef.current.reset()
    }



  return (
    <div className='bg-[#EDFBFF] w-full h-screen flex justify-center items-center'>
        <div className='py-16 px-16 bg-white drop-shadow-md rounded-md'>
            <form className='flex  flex-col items-center w-96' ref={formRef} onSubmit={login}>
                <h1 className='font-bold text-2xl w-fit'>SignIn</h1>
                
                <p className='p-2'></p>
                <p className='text-center'>Hey, Enter your details to get sign<br/>in to your account</p>
                <p className='p-2'></p>


                <p className='p-2'></p>
                <div className='w-full relative p-0 grid '>
                    <input type="email" placeholder='Email Id' className='px-3 py-2 w-full border rounded pr-9' value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
                </div>
                <p className='p-2'></p>

                <div className='w-full relative p-0 grid '>
                    <input type={hidePass? "password" : "text"} placeholder='Password' className='px-3 py-2 w-full border rounded pr-9' value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
                    <div className='absolute justify-self-end self-center mr-1  p-2 cursor-pointer' onClick={() => {setHidePass(!hidePass)}}>
                        {
                            hidePass ? 
                            <svg className='w-4 h-4 fill-gray-400' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg>:
                            <svg className='w-4 h-4 fill-gray-400' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/></svg>
                        }
                    </div>
                </div>
                <p className='p-2'></p>
                <button className='bg-[#FDC666] hover:bg-[#fdc032] font-semibold px-2 py-2 rounded-md w-full'>SignIn</button> 

                <p className='p-2'></p>
                <p className='text-center font-semibold'>~ Or SignIn with ~</p>
                <p className='p-2'></p>

                <div className='grid grid-cols-2 gap-6 w-full'>
                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}> 
                        <button type='button' onClick={() => (setGoogle(true))} className='border rounded-md px-3 py-2 flex items-center justify-center hover:bg-sky-200 cursor-pointer'>
                            <svg className='w-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
                            <p className='p-1'></p>
                            <span className='font-semibold'>Google</span>
                        </button>
                        {google ? <Google/> : null}   
                    </GoogleOAuthProvider>
                    <button type='button'  className='border rounded-md px-3 py-2 flex items-center justify-center hover:bg-sky-200 cursor-pointer'>
                        <svg className='w-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
                        <p className='p-1'></p>
                        <span className='font-semibold'>Github</span>
                    </button>
                </div>

                <p className='p-2'></p>
                <p className=''>Not a member? 
                    <Link to='/signup'>
                        <button className='font-bold pl-1'>SignUp</button>
                    </Link>
                </p>
                <p className='p-2'></p>

            </form>
        </div>
    </div>
  );
}

export default Signin;
