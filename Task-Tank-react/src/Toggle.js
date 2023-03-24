import React, { useEffect, useState } from 'react';

function Toggle() {
  return (
    <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="Login" className="sr-only peer"/>
        <div class="border p-0 z-0 flex items-center w-[370px] h-10 bg-white rounded-md peer dark:bg-white peer-checked:after:translate-x-full peer-checked:after:border-bg-gradient-to-r from-pink-500 to-yellow-500 after:content-[''] after:absolute after:top-[0px] after:left-[0px] after:bg-gradient-to-r from-pink-500 to-yellow-500 after:border-white after:border after:rounded-md after:h-10 after:w-[186px] after:transition-all dark:border-white  peer-checked:bg-white">
            <span className='z-10 w-1/2 flex justify-center font-bold text-lg'>SignUp</span>
            <span className='z-10 w-1/2 flex justify-center font-bold text-lg'>SignIn</span>
        </div>
    </label>     
  );
}

export default Signup;
