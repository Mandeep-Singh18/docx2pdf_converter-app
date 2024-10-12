import React, { useState } from 'react'
import { FaFileWord } from "react-icons/fa6";
import axios from "axios";

function Hero() {

    const [selectedfile,setselectedfile] = useState(null);           // for handling input files
    const [convert,setconvert] = useState("");                       // for handling convertfile button 
    const [downloaderror,setdownloaderror] = useState("")            // for handling error in convertfile bitton 

    const handlefilechange = (e) =>{
        // console.log(e.target.files[0])
        setselectedfile(e.target.files[0])
    }

    const handlesubmit= async(event) => {
        event.preventDefault();                                       
        if(!selectedfile){
            setconvert("Please select a File")
            return;
        }
        const formdata = new FormData()                     //data sent to api or backend
        formdata.append("file",selectedfile)
        try {
            const response =  await axios.post("http://localhost:3000/convertfile",formdata,{
                responseType: "blob",                       //binary form 
            });
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href=url;
            link.setAttribute("download",selectedfile.name.replace(/\.[^/.]+$/,"")+".pdf")
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            setselectedfile(null)
            setdownloaderror("")
            setconvert("File Converted Successfully")
        } catch (error) {                                                           //handle error if conversion fails
            if(error.response && error.response.status==400){
                setdownloaderror("Error occured",error.response.data.message);
            }
            else{
                setconvert("");
            }
        }
    }

    return (
        <>
            <div className='max-w-screen-2xl mx-auto container px-6 py-3 md:px-40'>
                <div className='flex h-screen items-center justify-center'>
                    <div className='border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg'>
                        <h1 className='text-3xl font-bold text-center mb-4'>
                            Convert Word To PDF Online
                        </h1>
                        <p className='text-sm text-center mb-5'>
                            Easily convert Word documents To Pdf format online, without installing any software.
                        </p>
                        <div className='flex flex-col items-center space-x-2'>
                            <input type="file" accept='.doc,.docx' onChange={handlefilechange} className='hidden' id='fileinput' />
                            <label htmlFor="fileinput" className='w-full mb-5 flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white'>
                                <FaFileWord className='text-3xl mr-3'/>
                                <span className='text-xl mr-2'>{selectedfile?selectedfile.name:"Choose File"}</span>
                            </label>
                            <button onClick={handlesubmit} disabled={!selectedfile} className='text-white bg-blue-500 disabled:bg-gray-400 disabled:pointer-events-none hover:bg-blue-700 duration-300 font-bold px-4 py-2 rounded-lg'>Convert File</button>
                            {convert && (<div className='text-green-500 text-center mt-4'>{convert}</div>)}
                            {downloaderror && (<div className='text-red-500 text-center mt-4'>{downloaderror}</div>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero
