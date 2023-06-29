import React, { useRef , useEffect , useState } from 'react'
import axios from "axios"
import {Link , useNavigate } from 'react-router-dom'

import '../App.css';

function Chat() {

    const [showTeamModal, setShowTeamModal] = useState(false)
    const closeTeamModal = () => setShowTeamModal(false)
    const openTeamModal = () => setShowTeamModal(true)

    const [newTeamName,setNewTeamName] = useState('')

    const clear = useRef()
    const navigate = useNavigate()

    const [sender , setSender] = useState(sessionStorage.getItem('id')) // my id

    const [teams,setTeams] = useState([])
    const [members,setMembers] = useState([])
    const [chats,setChats] = useState([])


    const [team, setTeam] = useState()
    const [sendtype , setSendtype] = useState(0)
    const [reciever , setReciever] = useState()
    const [teamname , setTeamname] = useState('')
    const [recvname , setRecvName] = useState('')
    

    
    const selectedTeam = useRef([])
    const [selectTeamidx,setselectTeamidx] = useState(0)

    const selectedMember = useRef([])
    const [selectMemberidx,setselectMemberidx] = useState(0)

    
    const [sendername , setSendername] = useState(sessionStorage.getItem('name')) 
    const [message , setMessage] = useState('')

    const getmembers = () => {
        axios.get("http://localhost:5000/getmembers/"+team).then((res) => {
            const temp = []
            res.data.map((val) =>{
                if(val.name != sendername)
                    temp.push(val)
            })
            setMembers(temp)

        })
    }


    const changeTeam = (val,idx) =>{
        setTeam(val.id)
        setSendtype(0)
        setReciever(val.id)
        setTeamname(val.name)
        setRecvName(val.name)

        selectedTeam.current[selectTeamidx].className = 'flex justify-between py-2 px-4 bg-white rounded hover:bg-[#CAEBF2] cursor-pointer mt-1'
        selectedTeam.current[idx].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2] rounded cursor-pointer mt-1'
        setselectTeamidx(idx)

        selectedMember.current[selectMemberidx].className = 'flex justify-between py-2 px-4 bg-white rounded hover:bg-[#CAEBF2] cursor-pointer mt-1'
        selectedMember.current[0].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2] rounded cursor-pointer mt-1'
        setselectMemberidx(0)
    }

    const changeMember = (val,idx) =>{
        setSendtype(1)
        setReciever(val.id)
        setRecvName(val.name)

        selectedMember.current[selectMemberidx].className = 'flex justify-between py-2 px-4 bg-white rounded hover:bg-[#CAEBF2] cursor-pointer mt-1'
        selectedMember.current[idx+1].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2] rounded cursor-pointer mt-1'
        setselectMemberidx(idx+1)
    }

    const selectgroup = () => {
        setRecvName(teamname)
        setSendtype(0)
        setTeam(team)
        selectedMember.current[selectMemberidx].className = 'flex justify-between py-2 px-4 bg-white rounded hover:bg-[#CAEBF2] cursor-pointer mt-1'
        selectedMember.current[0].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2] rounded cursor-pointer mt-1'
        setselectMemberidx(0)
    }

    const sendMessage = () => {
        if(message){
            const d = new Date()
            const time = d.getHours() + ':' + d.getMinutes()
            sendtype ?
                axios
                    .post("http://localhost:5000/nongroup", {
                        snd :  sender ,
                        sndgp : null, 
                        rec : reciever,
                        message : message,
                        time : time ,
                        status : 0
                    })
                    .then((res) => {
                        console.log(res);
                }) :
                axios
                    .post("http://localhost:5000/group", {
                        snd :  sender ,
                        sndgp : reciever, 
                        rec : null,
                        message : message,
                        time : time ,
                        status : 0
                    })
                    .then((res) => {
                        console.log(res);
                })


            clear.current.value = '';
            setMessage('')
        }
    } 

    const getChats = () => {
        {
            sendtype ?  
                axios.get("http://localhost:5000/getchats/"+sender+'/'+reciever).then((res) => {
                    setChats(res.data) 
                }) :
                axios.get("http://localhost:5000/getgroupchats/"+team).then((res) => {
                    setChats(res.data)
                })              

        }     
    }

    const updatestatus = () => {
        if(sendtype == 1 )
        {
            axios
            .put('http://localhost:5000/updatestatus/' + reciever + '/' + sender)
            .then((res) => {
                console.log('http://localhost:5000/updatestatus/' + reciever + '/' + sender)
            })
        }
    }

    const logout = () => {
        if(window.confirm('You will be logged out?')){
            sessionStorage.removeItem('id');
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('image');
            navigate("/signin")
        }
    }

    const checkKey = (e) => {
        if(e.key === 'Enter') 
            sendMessage()
    }

    const createTeam = (e) => {
        e.preventDefault()  

        axios
        .post("http://localhost:5000/createteam", {
            name : newTeamName ,
            leader : sender
        })
        .then((res) => {
            window.location.reload()
        })
       
    }

    const exitTeam = () => {
        console.log('http://localhost:5000/exitteam/' + team + '/' + sender)     
        axios.delete('http://localhost:5000/exitteam/' + team + '/' + sender).then((res) => {
            if (res.data) {
              alert('Deleted Scccessfully')
              window.location.reload()
            } else alert('Some Error has occured')
        })
    }

    useEffect(() => {
        getChats()
        updatestatus()
    })

    useEffect(() => {
        getmembers()
    },[team])

    useEffect(() => {      
        axios.get("http://localhost:5000/getteams/" + sender).then((res) => {
          setTeams(res.data)
        })

    },[])



    return (
        <div className='flex w-full  h-screen'>
            
            <div className='w-1/4 flex flex-col border-r-2 px-1 justify-between pt-1'>
               <div className='px-1'>
                    {teams && teams.map((val,index) => (
                    <div key={index} onClick={()=>{changeTeam(val,index)}} className='bg-white rounded cursor-pointer flex justify-between py-2 px-4 hover:bg-[#CAEBF2] mt-1' ref={el => selectedTeam.current[index] = el}>
                         <div className='flex'>
                            <svg className='w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"/></svg>
                            <p className='p-1'></p>
                            <div className='font-semibold h-7'>{val.name}</div>
                         </div>
                         <button className='p-1 rounded-md cursor-pointer hover:bg-[#a6c5cc]'>
                            <svg className='w-4' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V480 32zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128h96V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H512V128c0-35.3-28.7-64-64-64H352v64z"/></svg>
                         </button>
                    </div>
                    ))}
                    <p className='p-1'></p>
                    <button className='w-full flex justify-center items-center bg-[#43a3b8] hover:bg-[#43a4c6] py-2 px-4 border-4 border-double  rounded-md border-black hover:border-solid' onClick={()=>{openTeamModal()}}>
                        <svg className='w-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        <p className='p-1'></p>
                        <div className='font-semibold '>Create Team</div>
                    </button>
               </div>
               <button className='bg-red-200 hover:bg-red-400 flex justify-center items-center border border-gray-600 py-2 px-4 rounded cursor m-1'>
                <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
                <p className='p-1'></p>
                <div className='font-bold text-lg' onClick={logout}>Logout</div>
               </button>
            
            </div>
        

            <div className='w-1/4 border-r-2 px-1 pt-1'>
                {team && <div>
                    <div  className='bg-white rounded cursor-pointer flex justify-between  py-2 px-4 hover:bg-[#CAEBF2] mt-1 ' ref={el => selectedMember.current[0] = el} onClick={() => selectgroup()}>
                        <div className='flex '>
                            <svg className='w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"/></svg>
                            <p className='p-1'></p>
                            <div className='font-semibold h-7'>{teamname}</div>
                        </div>
                        <button className='p-1 rounded-md cursor-pointer hover:bg-[#a6c5cc]'>
                                <svg className='w-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                        </button>
                    </div>
                    {members && members.map((val,index) => (
                        <div key={index} onClick={()=>{changeMember(val,index)}} className='bg-white flex justify-between  py-2 px-4 hover:bg-[#CAEBF2] cursor-pointer rounded mt-1' ref={el => selectedMember.current[index+1] = el} >
                            <div className='flex'>
                                <svg className='w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>
                                <p className='p-1'></p>
                                <div className='font-semibold h-7'>{val.name}</div>
                            </div>
                            <button className='p-1 rounded-md cursor-pointer hover:bg-[#a6c5cc]'>
                                <svg className='w-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                            </button>
                        </div>
                    ))}
                </div>}

                <p className='p-1'></p>
                <button className='w-full flex justify-center items-center bg-[#43a3b8] hover:bg-[#43a4c6] py-2 px-4 border-4 border-double  rounded-md border-black hover:border-solid'>
                        <svg className='w-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        <p className='p-1'></p>
                        <div className='font-semibold '>Invite Member</div>
                </button>

                <p className='p-1'></p>

                <button className='w-full flex justify-center items-center py-2 px-4 border-4 border-double  rounded-md border-black hover:border-solid bg-red-200 hover:bg-red-400'  onClick={exitTeam}>
                    <svg className='w-4' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V480 32zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128h96V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H512V128c0-35.3-28.7-64-64-64H352v64z"/></svg>
                    <p className='p-1'></p>
                    <div className='font-semibold' >Leave Team</div>
               </button>
            </div>


            <div className='w-2/4 flex flex-col px-1'>
                <div className='w-full flex justify-between items-center py-4 px-6 bg-orange-200 h-fit'>
                    <div className='flex '>
                            <img className='w-8 rounded-full border-black ' src={sessionStorage.getItem('image')} alt='pic'></img>
                            <p className='p-2'></p>
                            <div className='font-semibold'>{recvname}</div>
                    </div>
                    <svg className='w-5 cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
            
                </div>

                <div className='pb-6 w-full h-full p-4 grid content-between bg-[#CAEBF2] overflow-y-hidden '>

                    <div className=' overflow-y-auto grid container'>
                        { chats && chats.map((chat) =>(
                            sendtype ? 
                                (sender == chat.rec) ?
                                <div className='justify-self-start'>
                                    <div className='mr-16 w-fit bg-[#0D253A] text-slate-200 rounded-b-lg rounded-r-lg pl-3 pr-2 py-1 flex'>{chat.message}
                                        <div className='pl-2 pb-0.5 place-self-end text-xs flex text-cyan-200'>
                                            {chat.time}
                                            
                                            {chat.status ? <svg className='w-3 fill-cyan-200' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7 86.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg> : <div></div>}
                                        </div>
                                    </div>
                                    <p className='p-1'></p>
                                    
                                </div> :
                                <div className='justify-self-end'>
                                    <div className='ml-16 bg-[#0375B4] pl-3 pr-2 py-1 w-fit text-slate-200 rounded-t-lg rounded-l-lg flex'>{chat.message}
                                        <div className='pl-2 pb-0.5 place-self-end text-xs flex text-cyan-200'>
                                            {chat.time}
                                            {chat.status ? <svg className='w-3 fill-cyan-200' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7 86.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg> : <div></div>}
                                        </div>
                                    </div>
                                    <p className='p-1'></p>
                                </div>
                                :
                                (sender != chat.snd) ?
                                <div className='flex flex-col'>
                                    <div className='justify-self-start'>
                                        <div className='mr-16 w-fit bg-[#0D253A] text-slate-200 rounded-b-lg rounded-r-lg pl-3 pr-2 py-1 flex'>{chat.message}
                                        <div className='pl-2 pb-0.5 place-self-end text-xs flex text-cyan-200'>
                                            {chat.time}
                                        </div>
                                        </div> 
                                    </div>
                                    <div className='text-xs text-gray-500'>{chat.name}</div>
                                    <p className='p-1'></p>
                                </div> :
                                <div className='flex flex-col justify-self-end'>
                                    <div className='justify-self-end'>
                                        <div className=' ml-16 bg-[#0375B4] pl-3 pr-2 py-1 w-fit text-slate-200 rounded-t-lg rounded-l-lg flex'>{chat.message}
                                            <div className='pl-2 pb-0.5 place-self-end text-xs flex text-cyan-200'>{chat.time}</div>
                                        </div>
                                    </div>
                                    <div className='pr-1 text-xs text-gray-500 w-full text-right'>Me</div>
                                    <p className='p-1'></p>
                                </div>
                            
                        ))}

                    </div>

                    <div className='w-full relative grid '>
                        <input ref={clear} placeholder='Message...' className='w-full bg-[#0D253A] rounded-md px-4 py-2 pr-9 text-white flex items-center' onChange={(e)=>{setMessage(e.target.value)}} onKeyPress={(e)=>{checkKey(e)}} />
                        <button onClick={()=>{sendMessage()}} className='absolute justify-self-end self-center mr-1 p-2 bg-[#0D253A]'><svg className='w-4 right-0 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg></button>
                   </div>
                </div>
            </div>



            {showTeamModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-6xl">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                            <button
                                onClick={closeTeamModal}
                                type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                data-modal-toggle="popup-modal"
                            >
                                <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                ></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-6 text-left">
                                <div className="text-center font-semibold">Create New Team</div>
                                <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="">
                                    <form
                                    className="grid grid-cols-3 gap-6"
                                    onSubmit={createTeam}
                                    >
                                    <div className="col-span-3">
                                        <label
                                        htmlFor="type"
                                        className="block text-sm font-medium text-gray-700"
                                        >
                                        Team Name
                                        </label>
                                        <input
                                        required
                                        
                                        type="text"
                                        id="Tname"
                                        name="tname"
                                        
                                        className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"

                                        onChange={(e)=>{setNewTeamName(e.target.value)}}
                                        ></input>
                                    </div>

                                    <div/>                                   

                                    <button className="inline-flex justify-center rounded-md border border-transparent bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                        Create
                                    </button>
                                    </form>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            
            

        </div>
    );
}

export default Chat;

// const teams = [
//     {
//         id : 1,
//         name : 'team1'
//     },
//     {
//         id : 2,
//         name : 'team2'
//     }
// ]

// const members = [
//     {
//         id : 1,
//         name : 'ashbourn',
//         tid : 1
//     },
//     {
//         id : 2,
//         name : 'moses',
//         tid : 1
//     },
//     {
//         id : 3,
//         name : 'reeve',
//         tid : 1
//     },
//     {
//         id : 4,
//         name : 'eton',
//         tid : 2
//     }
// ]

// const messages = [
//     {
//         from : 1,
//         to : 2,
//         message : "helloworld",
//         time : '00:01'
//     },
//     {
//         from : 1,
//         to : 2,
//         message : "test",
//         time : '00:01'
//     },
//     {
//         from : 2,
//         to : 1,
//         message : "reciever text",
//         time : '00:01'
//     },
//     {
//         from : 1,
//         to : 2,
//         message : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         time : '00:01'
//     },
// ]