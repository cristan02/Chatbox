import React, { useRef , useEffect , useState } from 'react';
import axios from "axios";

import './App.css';

function Chat() {

    const clear = useRef()

    
    const selectedTeam = useRef([])
    const [selectTeamidx,setselectTeamidx] = useState(0)

    const selectedMember = useRef([])
    const [selectMemberidx,setselectMemberidx] = useState(0)

    const [teams,setTeams] = useState([])
    const [members,setMembers] = useState([])
    const [chats,setChats] = useState([])

    const [team, setTeam] = useState(1)
    const [teamname , setTeamname] = useState('team1')

    const [sendername , setSendername] = useState('Reeve') //set user
    const [recvname , setRecvName] = useState('My Team')
    const [sender , setSender] = useState(2)
    const [reciever , setReciever] = useState(2)

    const [sendtype , setSendtype] = useState(0)

    const [message , setMessage] = useState('')

    const changeTeam = (val,idx) =>{
        setTeam(val.id)
        setSendtype(0)
        setReciever(val.id)
        setTeamname(val.name)
        setRecvName(val.name)

        selectedTeam.current[selectTeamidx].className = 'flex justify-between py-2 px-4 bg-white'
        selectedTeam.current[idx].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2]'
        setselectTeamidx(idx)

        selectedMember.current[selectMemberidx].className = 'flex justify-between py-2 px-4 bg-white'
        selectedMember.current[0].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2] '
        setselectMemberidx(0)
    }

    const changeMember = (val,idx) =>{
        setSendtype(1)
        setReciever(val.id)
        setRecvName(val.name)

        selectedMember.current[selectMemberidx].className = 'flex justify-between py-2 px-4 bg-white'
        selectedMember.current[idx+1].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2] '
        setselectMemberidx(idx+1)
    }

    const selectgroup = () => {
        setRecvName(teamname)
        setSendtype(0)
        setTeam(team)
        selectedMember.current[selectMemberidx].className = 'flex justify-between py-2 px-4 bg-white '
        selectedMember.current[0].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2] '
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


    const getTeams =() => {
        axios.get("http://localhost:5000/getteams/" + sendername).then((res) => {
          setTeams(res.data)
        });
    }

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

    const refresh = () =>{
        getTeams()
        getmembers()
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

    useEffect(() => {
        getChats()
        updatestatus()
    })

      useEffect(() => {
        getmembers()
      },[team])

      useEffect(() => {
        getTeams()
        getmembers()

        selectedMember.current[0].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2] '
        setselectMemberidx(0)
        // selectedTeam.current[0].className = 'flex justify-between py-2 px-4 bg-[#CAEBF2]'
        // setselectTeamidx(0)
      },[])

    return (
        <div className='flex w-full'>
            
            <div className='w-1/4 h-screen border-r-2 '>
            {/* <button className='bg-blue-100 p-2' onClick={()=>{setSendername('Ashbourn')}}>click1</button>
            <button className='bg-green-100 p-2' onClick={()=>{setSender(1)}}>click2</button>
            <button className='bg-red-100 p-2' onClick={()=>{refresh()}}>click3</button> */}
                {teams && teams.map((val,index) => (
                    <div key={index} onClick={()=>{changeTeam(val,index)}} className='cursor-pointer flex justify-between py-2 px-4 hover:bg-[#CAEBF2] ' ref={el => selectedTeam.current[index] = el}>
                         <div className='flex'>
                            <svg className='w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"/></svg>
                            <p className='p-1'></p>
                            <div className='font-semibold'>{val.name}</div>
                         </div>
                        <div className='flex'>
                            <div className='font-semibold rounded-full bg-transparent w-7 h-7 flex justify-center items-center'></div>
                            <svg className='w-4 cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
                        </div>
                    </div>
                ))}
            </div>
        

            <div className='w-1/4 h-screen border-r-2 '>
                <div  className='cursor-pointer flex justify-between  py-2 px-4 hover:bg-[#CAEBF2]  ' ref={el => selectedMember.current[0] = el} onClick={() => selectgroup()}>
                    <div className='flex'>
                        <svg className='w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"/></svg>
                        <p className='p-1'></p>
                        <div className='font-semibold'>{teamname}</div>
                    </div>
                    <div className='flex'>
                            <div className='font-semibold rounded-full bg-transparent w-7 h-7 flex justify-center items-center'></div>
                    </div>
                </div>
                {members && members.map((val,index) => (
                    <div key={index} onClick={()=>{changeMember(val,index)}} className='flex justify-between  py-2 px-4 hover:bg-[#CAEBF2] cursor-pointer' ref={el => selectedMember.current[index+1] = el} >
                        <div className='flex'>
                            <svg className='w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>
                            <p className='p-1'></p>
                            <div className='font-semibold'>{val.name}</div>
                        </div>
                        <div className='flex'>
                            <div className='font-semibold rounded-full bg-transparent w-7 h-7 flex justify-center items-center'></div>
                            <svg className='w-2 cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M246.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 41.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                        </div>
                    </div>
                ))}
            </div>


            <div className='w-2/4 h-screen flex flex-col '>
                <div className='w-full flex justify-between items-center py-4 px-6 bg-orange-200 h-fit'>
                    <div className='flex'>
                        <svg className='w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>
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
                        <input ref={clear} placeholder='Message...' className='w-full bg-[#0D253A] rounded-md px-4 py-2 pr-9 text-white flex items-center' onChange={(e)=>{setMessage(e.target.value)}}
                        ></input>
                        <button onClick={()=>{sendMessage()}} className='absolute justify-self-end self-center mr-1 p-2 bg-[#0D253A]'><svg className='w-4 right-0 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg></button>
                   </div>
                </div>
            </div>
            

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