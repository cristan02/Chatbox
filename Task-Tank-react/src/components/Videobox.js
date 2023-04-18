import React, { useEffect, useRef, useState } from 'react'

function Videobox(props) {

    const remotevideo = useRef(null)

    useEffect(() => {
        // remotevideo.current.srcObject = props.stream        
        console.log()
    },[])


	return (
		<div>
            <video key={props.id} className='rounded-md' playsInline autoPlay ref={remotevideo}/>
            <div>test : {props.memberstream}</div>
        </div>
	)
}

export default Videobox
