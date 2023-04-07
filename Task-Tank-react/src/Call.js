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
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div >
        <video ref={currentUserVideoRef} muted playsInline autoPlay/>
      </div>
      <div>
        <video ref={remoteVideoRef} playsInline autoPlay onError={()=>console.log('video play error')}/>
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
