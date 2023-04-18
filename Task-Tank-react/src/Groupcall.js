import React, { useEffect, useRef, useState } from 'react'
//import Peer from 'simple-peer'
import Peer from 'peerjs'
import io from 'socket.io-client'

import './App.css'

const socket = io.connect('http://localhost:5000')

function Groupcall() {

    const [mybox , setMybox] = useState(true)

    const [sockId , setSockId] = useState()
    const [roomId, setRoomId ] = useState()

	const [name , setName ] = useState('')
    const [stream , setStream] = useState()
    
    const [team , setTeam] = useState([])

    const myVideo = useRef(null)
    const membersRef = useRef([])

    const peerInstance = useRef(null)
    const memberInstance = useRef(null)

	useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mystream) => {
			myVideo.current.srcObject = mystream
            setStream(mystream)
		})
        socket.on('sockId', (id) => {
            setSockId(id)
        })

        socket.on('userJoined', (data) =>{
            if(data.name != ''){
                setTeam(prev => {
                    prev.push(data)
                    const unique = prev.filter((value, index, array) => {
                        return index === array.findIndex((el) => (
                            el.name === value.name && el.stream === value.stream && el.sockId == value.sockId
                          )) 
                        })
                    return unique
                })
            }
        })

        socket.on('getJoined', (data) =>{
            socket.emit('sendMyDetails' , {senderSockId : data , name , stream , sockId})
        })

        socket.on('getDetails', (data) =>{
            if(data.name != ''){
                setTeam(prev => {
                    prev.push(data)
                    const unique = prev.filter((value, index, array) => {
                        return index === array.findIndex((el) => (
                            el.name === value.name && el.stream === value.stream && el.sockId == value.sockId
                          )) 
                        })
                    return unique
                })
            }
        })

        socket.on('leftCall', (data) =>{
            setTeam(prev => {
                const temp = prev.filter( val => (val.sockId != data.sockId) )
                return temp
            })
        })

        socket.on('callEnded', (data) =>{
            alert('Call Ended')
        })

        team && team.map((val , idx) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mystream) => {
                const peer = new Peer(sockId + idx)
    
                peer.on('open', function(id) {})
    
                peer.on('call', (call) => {
                    call.answer(mystream)
                })
    
                memberInstance.current.push(peer)
            })
        })
       

	},[team])

    useEffect(() =>{
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mystream) => {
			const peer = new Peer(sockId)

            peer.on('open', function(id) {})

            peer.on('call', (call) => {
                call.answer(mystream)
            })

            peerInstance.current = peer
		})
        
    }, [sockId])

    useEffect(() =>{
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mystream) => {
			myVideo.current.srcObject = mystream
            setStream(mystream)
		})
    },[mybox])

    const joinRoom = () => {
        socket.emit('joinRoom', { roomId , name , stream , sockId})
        socket.emit('getJoined' , { roomId , sockId})
    }

    const leaveRoom = () => {
        socket.emit('leaveCall', {roomId , name , stream})
    }

    const display = () => {
        console.clear()
        console.log('Sock Id : ' , sockId)
        console.log('Name :' , name)
        console.log('Room :' , roomId)
        console.log('Team : ' , team)
    }

    const playVideo = (val , idx) => {
        
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mystream) => {
            const peer = new Peer(sockId +idx )
            peer.on('open', function(id) {})

            const call = peerInstance.current.call(val.sockId , mystream)
              
            call.on('stream', (remoteStream) => {
                membersRef.current[idx].srcObject = remoteStream
            }) 
        })
    }

	return (
		<div className='w-full h-screen bg-[#0f172a] px-12 py-6 pt-12'>
            <div><input placeholder='Enter your name' onChange={(e) => setName(e.target.value)}/></div>
			<div><input placeholder='Enter Room Id' onChange={(e) => setRoomId(e.target.value)}/></div>

            <div><button onClick={joinRoom}>Join room</button></div>
            <div><button onClick={display}>Display users</button></div>
            <div><button onClick={leaveRoom}>End Call</button></div>

            
                <div className='h-[95%] overflow-y-auto container grid lg:grid-cols-3 md:grid-cols-1 gap-6 justify-items-center'>
                    {
                        mybox ? 
                        <div className='relative grid w-fit h-fit'>
                            <video className='rounded-md w-full h-full' ref={myVideo} playsInline autoPlay/>  
                            <div className='mb-1 px-2 rounded-full bg-gray-100 bg-opacity-10 absolute text-white font-semibold justify-self-center self-end '>You</div>
                        </div>  : null
                    }          
                    {   team ? 
                            team.map((member, idx) => (
                                <div key={idx} className='relative grid'>
                                    <video key={idx} className='rounded-md' playsInline autoPlay ref={el => membersRef.current[idx] = el} onafterprint={playVideo(member , idx)}/>
                                    <div className='mb-1 px-2 rounded-full bg-gray-100 bg-opacity-10 absolute text-white font-semibold justify-self-center self-end '>{member.name}</div>
                                </div>
                            )) 
                            : null
                    }
                </div>
            

            <div className='py-4 grid grid-flow-col gap-6 w-full justify-center'>
                <div className='relative p-2 rounded-full bg-cyan-200 flex items-center justify-center cursor-pointer' onClick={()=>{setMybox(!mybox)}}>
                {mybox ? <svg className='absolute w-6 h-6 fill-cyan-900'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M5.1 9.2C13.3-1.2 28.4-3.1 38.8 5.1l592 464c10.4 8.2 12.3 23.3 4.1 33.7s-23.3 12.3-33.7 4.1L9.2 42.9C-1.2 34.7-3.1 19.6 5.1 9.2z"/></svg> : null}

                <svg className='w-5 h-5 fill-cyan-800' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                
                {/* <svg className='w-5 h-5 fill-cyan-800' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg> */}
                
                </div>
                <div className='relative  p-2 rounded-full bg-cyan-200 flex items-center justify-center cursor-pointer' onClick={()=>{console.log("audio")}}>
                <svg className='absolute w-6 h-6 fill-cyan-900'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M5.1 9.2C13.3-1.2 28.4-3.1 38.8 5.1l592 464c10.4 8.2 12.3 23.3 4.1 33.7s-23.3 12.3-33.7 4.1L9.2 42.9C-1.2 34.7-3.1 19.6 5.1 9.2z"/></svg>
                
                <svg className='w-5 h-5 fill-cyan-800' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
                </div>
                <div className='p-2 rounded-full bg-red-200 cursor-pointer'>
                <svg className='w-5 h-5 fill-red-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M228.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C76.1 30.2 64 46 64 64c0 107.4 37.8 206 100.8 283.1L9.2 469.1c-10.4 8.2-12.3 23.3-4.1 33.7s23.3 12.3 33.7 4.1l592-464c10.4-8.2 12.3-23.3 4.1-33.7s-23.3-12.3-33.7-4.1L253 278c-17.8-21.5-32.9-45.2-45-70.7L257.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96zm96.8 319l-91.3 72C310.7 476 407.1 512 512 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L368.7 368c-15-7.1-29.3-15.2-43-24.3z"/></svg>
                </div>
            </div>

		</div>
        
	)
}

export default Groupcall
