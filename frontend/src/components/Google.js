import React, { useState, useEffect } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import {Link , useNavigate } from 'react-router-dom'

function App() {
    const [ user, setUser ] = useState([])
    const [ profile, setProfile ] = useState([])

    const navigate = useNavigate()

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse)
        },
        onError: (error) => console.log('Login Failed:', error)
    })

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data)

                        axios.post('http://localhost:5000/googleverify' , {
                            email : res.data.email
                        })
                        .then((result) => {
                                if(result.data.length > 0 && result.data[0].type == 'google') {
                                    sessionStorage.setItem("id", result.data[0].id)
                                    sessionStorage.setItem("name", result.data[0].name)
                                    sessionStorage.setItem("email", result.data[0].email)
                                    sessionStorage.setItem("image", res.data.picture)
                                    navigate("/chat")
                                }  
                                else if(result.data.length > 0 && result.data[0].type != 'google'){
                                    alert('Email Id already exists')
                                }      
                                else{
                                    axios.post('http://localhost:5000/signup' , {
                                        name : res.data.name,
                                        email : res.data.email ,
                                        password : res.data.password,
                                        image : res.data.picture,
                                        type : 'google'
                                    })
                                    .then((resu) => {
                                        alert(resu.data)
                                        if(resu.data == 'Account Successfully created'){
                                            axios.post('http://localhost:5000/signin' , {
                                                email : res.data.email ,
                                                password : res.data.password
                                            })
                                            .then((rslt) => {
                                                console.log(rslt.data)
                                                    sessionStorage.setItem("id", rslt.data[0].id)
                                                    sessionStorage.setItem("name", rslt.data[0].name)
                                                    sessionStorage.setItem("email", rslt.data[0].email)
                                                    sessionStorage.setItem("image", rslt.data[0].image)
                                                    navigate("/chat")               
                                            })
            } 
                                    })
                                }       
                        })  
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    useEffect(()=>{
        login()
    },[])

  
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };


    return (
        <></>
    );
}
export default App;