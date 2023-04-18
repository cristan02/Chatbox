
import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

function Call() {

  const [recievingCall, setRecievingCall] = useState(0)
  const callReciever = useRef(null)
  const [answeredCall, setAnsweredCall] = useState(0)


  const [peerId, setPeerId] = useState('')
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('')
  const remoteVideoRef = useRef(null)
  const currentUserVideoRef = useRef(null)
  const peerInstance = useRef(null)

  useEffect(() => {
    const peer = new Peer(Math.floor(Math.random() * 1000))

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			currentUserVideoRef.current.srcObject = stream
		})

    peer.on('open', (id) => {
      setPeerId(id)
    })

    peer.on('connection', function(conn) {
      conn.on('open', function() {
        conn.on('data', function(data) {
          conn.send(peerId)
          window.location.reload()         
        }) 
      })
      
    })

    peer.on('call', (call) => {
      setRecievingCall(1)
      callReciever.current = call
      setRemotePeerIdValue(call.peer)
    })

    peerInstance.current = peer;
  }, [])
 

  const endCall = () => {              
    let conn = peerInstance.current.connect(remotePeerIdValue)
        conn.on('open', function() {
          conn.on('data', function(data) {
            window.location.reload()
          })
           
          conn.send('send disconnect')
    })  

  }

  const answerCall = () => {
    setAnsweredCall(1)
    setRecievingCall(0)

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {    
      callReciever.current.answer(stream)

      callReciever.current.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
      })

    })
  }

  const call = (remotePeerId) => {
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {

      const call = peerInstance.current.call(remotePeerId, stream)

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        setAnsweredCall(1)
      })
      
    });
  }

  return (

    
    // <div className="bg-[#030712] h-screen w-full flex flex-col p-10 justify-center items-center">
    //   <h1 className='text-gray-500'>Current user id is {peerId}</h1>

    //   <input className='bg-gray-100' type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />

    //   <button className='bg-gray-100' onClick={() => call(remotePeerIdValue)}>Call</button>

    //   <div className='h-[95%] px-20 flex justify-center items-center'>
    //       <video className='grow  bg-black rounded-10' ref={remoteVideoRef} playsInline autoPlay/>
    //       <video className='grow-0 bg-black rounded-10' ref={currentUserVideoRef} playsInline autoPlay/>
    //   </div>

    //   <div className='grid grid-flow-col gap-6 w-full justify-center'>
    //     <div className='relative p-2 rounded-full bg-cyan-200 flex items-center justify-center cursor-pointer' onClick={()=>{console.log('change video')}}>
    //       <svg className='absolute w-6 h-6 fill-cyan-900'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M5.1 9.2C13.3-1.2 28.4-3.1 38.8 5.1l592 464c10.4 8.2 12.3 23.3 4.1 33.7s-23.3 12.3-33.7 4.1L9.2 42.9C-1.2 34.7-3.1 19.6 5.1 9.2z"/></svg>
          
    //       <svg className='w-5 h-5 fill-cyan-800' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
          
    //     </div>
    //     <div className='relative  p-2 rounded-full bg-cyan-200 flex items-center justify-center cursor-pointer' onClick={()=>{console.log('change audio')}}>
    //       <svg className='absolute w-6 h-6 fill-cyan-900'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M5.1 9.2C13.3-1.2 28.4-3.1 38.8 5.1l592 464c10.4 8.2 12.3 23.3 4.1 33.7s-23.3 12.3-33.7 4.1L9.2 42.9C-1.2 34.7-3.1 19.6 5.1 9.2z"/></svg>
          
    //       <svg className='w-5 h-5 fill-cyan-800' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
    //     </div>
    //     <div className='p-2 rounded-full bg-red-200 cursor-pointer'>
    //       <svg className='w-5 h-5 fill-red-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M228.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C76.1 30.2 64 46 64 64c0 107.4 37.8 206 100.8 283.1L9.2 469.1c-10.4 8.2-12.3 23.3-4.1 33.7s23.3 12.3 33.7 4.1l592-464c10.4-8.2 12.3-23.3 4.1-33.7s-23.3-12.3-33.7-4.1L253 278c-17.8-21.5-32.9-45.2-45-70.7L257.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96zm96.8 319l-91.3 72C310.7 476 407.1 512 512 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L368.7 368c-15-7.1-29.3-15.2-43-24.3z"/></svg>
    //     </div>
    //   </div>

    //   { recievingCall? 
		// 		<div className="text-white">
		// 					<h1 > is calling...</h1>
		// 					<button   onClick={answerCall}>
		// 						Answer
		// 					</button>
    //           <button onClick={answerCall}>
		// 						reject
		// 					</button>
		// 		</div> : null
		// 	}
    //   { answeredCall? 
		// 		<button className="text-white" onClick={endCall}>End Call</button> : null
		// 	}

    // </div>
    <div className='bg-[#0f172a] w-full h-screen p-4'>
      
      <div className='flex'>
        <h1 className='text-gray-500'>Current user id is {peerId}</h1>
        <input className='bg-gray-100' type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
        <button className='bg-gray-100' onClick={() => call(remotePeerIdValue)}>Call</button>
      </div>

      <div className='h-[95%] px-20 flex justify-center items-center gap-4 text-[#0f172a]'>
          <video className='grow rounded-md' ref={remoteVideoRef} playsInline autoPlay />
          <video className='grow-0 rounded-md' ref={currentUserVideoRef} playsInline autoPlay/>
      </div>

      <div className='grid grid-flow-col gap-6 w-full justify-center'>
        <div className='relative p-2 rounded-full bg-cyan-200 flex items-center justify-center cursor-pointer' onClick={()=>{console.log("video")}}>
          <svg className='absolute w-6 h-6 fill-cyan-900'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M5.1 9.2C13.3-1.2 28.4-3.1 38.8 5.1l592 464c10.4 8.2 12.3 23.3 4.1 33.7s-23.3 12.3-33.7 4.1L9.2 42.9C-1.2 34.7-3.1 19.6 5.1 9.2z"/></svg>
          
          <svg className='w-5 h-5 fill-cyan-800' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
          
        </div>
        <div className='relative  p-2 rounded-full bg-cyan-200 flex items-center justify-center cursor-pointer' onClick={()=>{console.log("audio")}}>
          <svg className='absolute w-6 h-6 fill-cyan-900'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M5.1 9.2C13.3-1.2 28.4-3.1 38.8 5.1l592 464c10.4 8.2 12.3 23.3 4.1 33.7s-23.3 12.3-33.7 4.1L9.2 42.9C-1.2 34.7-3.1 19.6 5.1 9.2z"/></svg>
          
          <svg className='w-5 h-5 fill-cyan-800' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
        </div>
        <div className='p-2 rounded-full bg-red-200 cursor-pointer'>
          <svg className='w-5 h-5 fill-red-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M228.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C76.1 30.2 64 46 64 64c0 107.4 37.8 206 100.8 283.1L9.2 469.1c-10.4 8.2-12.3 23.3-4.1 33.7s23.3 12.3 33.7 4.1l592-464c10.4-8.2 12.3-23.3 4.1-33.7s-23.3-12.3-33.7-4.1L253 278c-17.8-21.5-32.9-45.2-45-70.7L257.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96zm96.8 319l-91.3 72C310.7 476 407.1 512 512 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L368.7 368c-15-7.1-29.3-15.2-43-24.3z"/></svg>
        </div>
      </div>

      <div className='bg-black'>
        { recievingCall? 
          <div className="text-white">
            <h1 > is calling...</h1>
              <button   onClick={answerCall}>
                Answer
              </button>
              <button onClick={answerCall}>
                reject
              </button>
          </div> : null
			  }       
      { answeredCall? 
 				<button className="text-white" onClick={endCall}>End Call</button> : null
 			}
      </div>

    </div>
  );
}

export default Call;
