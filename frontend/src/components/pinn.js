import React,{useState} from 'react'
import {Link,Navigate,useNavigate} from 'react-router-dom'
/* the fiff btw useNavigate and Link The difference between the Link (and NavLink and Navigate) components and the navigate function returned by the useNavigate hook is effectively the same difference between Declarative(Link) hna rana ndiro declare ll link  and Imperative programming.(useNvigate)  hna rana n9ololo roh lhadik lplace bssif kishghol amer*/
import  {v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from "react-icons/bs"
import { client,urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser'

const Pinn =({pin:{postedBy,image,_id,destination,save}}) => {
   const [postHoverd,setPostHoverd]=useState(false)
   const [savingPost,setSavingPost]=useState(false)
   const navigate=useNavigate()
   const user= fetchUser();
   /* sha9inah hna besh na3arvo ila user ta3na dar save wla la  */
   const alreadySaved =!!(save?.filter((item)=> item.postedBy?._id === user?.sub))?.length
   /* ila habina nrj3o haja numerique boolenn 
   1,[2,3,1] -> [1].length -> 1 -> !1 -> false -> ! false -> true hada 3lah derna !! ma3ntha bar ta3 bar hhh   meme chose pour false  whene length =0*/
   const savePin =(id) =>{
    if(!alreadySaved){
      setSavingPost(true)
      client.patch(id).setIfMissing({save:[]}).insert('after','save[-1]',[
        {
          _key:uuidv4(),
          userId:user?.sub,
          postedBy:{
            _type:'postedBy',
            _ref:user?.sub
          }
        }
      ]).commit().then(()=>{
        window.location.reload();
        setSavingPost(false)
      })
    }
   }
   const deletePin =(id) =>{
    client.delete(id).then(()=>{
      window.location.reload()
    })
   }
  return (
    <div className='m-2 '>
      <div
      onMouseEnter={()=>setPostHoverd(true)}
      onMouseLeave={()=>setPostHoverd(false)}
      onClick={()=>navigate(`/pin-detail/${_id}`)}
      className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out" >
           <img className ='rounded-lg w-full' alt='user-post' src={urlFor(image).width(250).url()} />
           {postHoverd && (
            <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
            style={{height:"100%"}} >
              <div className='flex items-center justify-between'>
                <div className='flex gap-2'>
                    <a href={`${image?.asset?.url}?dl=`}
                      download
                      onClick={(e)=>e.stopPropagation()} >
                        <MdDownloadForOffline
                        className="bg-white w-9 h-9 flex items-center rounded-full justify-center text-dark opacity-75 text-xl hover:opacity-100 hover:shadow-md outline-none"
                        /> 
                  </a>
                </div>
                {alreadySaved ?(
                  <button type='button'
                  className='bg-red-500  opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                  >
                   {save?.length} Saved
                  </button>
                ):(
                  <button type='button' 
                  className='bg-red-500  opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                  onClick={(e) =>{
                    e.stopPropagation(
                    savePin(_id)
                    )
                  }} >
                    Save
                  </button>
                )}

              </div>
              <div className='flex justify-between items-center gap-2 w-full'>
                {destination &&(
                  <a href={destination}
                  target="_blank"
                  rel='noreferrer'
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md outline-none ' >
                    <BsFillArrowUpRightCircleFill/>
                    {destination.length>20 ? destination.slice(8,20):destination.slice(8) /** bdina mn 8 tnihina hadik https ou hadok tmdlna direct src  */} 
                  </a>
                )}
                  {postedBy ?._id === user?.sub &&(
                    <button type='button'
                    onClick={(e) =>{
                    e.stopPropagation(
                    deletePin(_id)
                    )
                  }} 
                  className='bg-white p-2  opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                  <AiTwotoneDelete/>
                    </button>
                  )}
              </div>

            </div>

           )}
      </div>
      <Link to={`user-profile/${postedBy?._id}`}
      className='flex gap-2 mt-2 items-center' >
        <img className='w-8 h-8 rounded-full object-cover'
        src={postedBy?.image}
         alt="user-profile"/>
         <p className='font-base capitalize '>{postedBy?.userName}</p>
      </Link>
      
    </div>
  )
}

export default Pinn
