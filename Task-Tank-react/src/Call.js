import { useEffect, useRef, useState , createContext   } from 'react';
import Peer from 'peerjs';
import './App.css';

function Call() {

  const UserContext = createContext()

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
    window.alert('fix reject call')
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
    <div className="bg-[#030712] h-screen w-full flex flex-col p-10 justify-center items-center">
      <h1 className='text-gray-500'>Current user id is {peerId}</h1>

      <input className='bg-gray-100' type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />

      <button className='bg-gray-100' onClick={() => call(remotePeerIdValue)}>Call</button>

      <div className='flex flex-col justify-center items-center'>
        <div className='lg:w-full grid lg:grid-cols-2 sm:grid-cols-1 gap-2 bg-[#0f172a] rounded-lg justify-items-center p-6 bg-opacity-25'>
          <video className='lg:h-auto sm:h-[300px] rounded' ref={currentUserVideoRef} muted playsInline autoPlay/>
          <video className='lg:h-auto sm:h-[300px] rounded' ref={currentUserVideoRef} muted playsInline autoPlay/>
          {/* <video className='sm:h-[200px]' ref={remoteVideoRef} playsInline autoPlay onError={()=>console.log('video play error')}/> */}
        </div>
        <div className=' w-full flex justify-center'>
          <div className='rounded-full'></div>
        </div>
      </div>

      { recievingCall? 
				<div className="">
							<h1 > is calling...</h1>
							<button variant="contained" color="primary" onClick={answerCall}>
								Answer
							</button>
              <button variant="contained" color="primary" onClick={answerCall}>
								reject
							</button>
				</div> : null
			}
      { answeredCall? 
				<button variant="contained" color="primary" onClick={endCall}>End Call</button> : null
			}

    </div>
  );
}

export default Call;
