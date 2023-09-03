import React,{useState,useEffect} from 'react'
import {MdDowlaodForOffline} from 'react-icons/md'
import {Link,useParams} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {client,urlFor} from '../client'
import MasonryLayout from './masonryLayout'
import {pinDetailMorePinQuery,pinDetailQuery} from '../utils/data'
import {MdDownloadForOffline} from 'react-icons/md'
import Spinner from './spinner'
const  PinDetails =({user}) => {
  const [pins, setPins] = useState([]);
  const [pindetails, setPindetails] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const {pinId} =useParams(); /* hadi njibo des information mn lien */
   console.log(user)
  
   const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPindetails(data[0]);
        console.log(data);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };
  useEffect(() => {
    fetchPinDetails();
  }, []);
 
  const addComment =()=>{
    if(comment){
      setAddingComment(true);
      client.patch(pinId).setIfMissing({comments:[]}).insert('after','comments[-1]',[{
        comment,
        _key:uuidv4,
        postedBy:{
          _type:'postedBy',
          _ref:user._id,
        }

      }]).commit().then(()=>{
        fetchPinDetails();
        setComment('');
        setAddingComment(false)
      })
    }
   }
  if (!pindetails) return <Spinner message="Loading pin"/>
  return (
     <>
    <div className='flex xl-flex flex-col m-auto' style={{maxWidth:'1500px',borderRadius:'32px'}}>
        <div className='flex justify-center items-center md:items-start flex-initial '>
          <img src={pindetails?.image && urlFor(pindetails.image).url()} className=" rounded-t-3xl rounded-b-lg " alt="user-post" />
        </div> 
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <a href={`${pindetails.image?.asset?.url}?dl=`}
                        download
                        onClick={(e)=>e.stopPropagation()} >
                          <MdDownloadForOffline
                          className="bg-white w-9 h-9 flex items-center rounded-full justify-center text-dark opacity-75 text-xl hover:opacity-100 hover:shadow-md outline-none"
                          /> 
                    </a>
            </div>
            <a href={pindetails.destination} target="_blank"  rel="noreferrer">
                {pindetails.destination}
            </a>
          </div>
          <div>
              <h1 className='text-4xl font-bold break-words mt-3'>
                {pindetails.title}
              </h1>
              <p className='mt-3'>
                 {pindetails.about}
              </p>
          </div>
          <Link to={`user-profile/${pindetails.postedBy?._id}`}
              className='flex gap-2 mt-5 items-center bg-white rounded-lg ' >
              <img className='w-8 h-8 rounded-full object-cover'
               src={pindetails.postedBy?.image}
               alt="user-profile"/>
               <p className='font-base capitalize '>{pindetails.postedBy?.userName}</p>
           </Link>
           <h2 className='mt-5 text-2xl '>Comments</h2>
           <div className='max-h-370 overflow-y-auto'>
                {/* hadik 3alamat istifham ma3ntha ila kan true derli hadi render sinon madir walo */}
            {pindetails?.comments?.map((comment,i)=>(
              <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                 <img src={comment.postedBy.image}
                  alt="user-profile"
                  className='w-10 h-10 rounded-full cursor-pointer ' />
                  <div className='flex flex-col'>
                    <p className='font-bold'>{comment.postedBy.userName}</p>
                    <p>{comment.comment}</p>

                  </div>
              </div>  
            ))}
           </div>
           <div className='flex flex-wrap mt-6 gap-3'>
              <Link to={`user-profile/${pindetails.postedBy?._id}`} >
                  <img className='w-10 h-10 rounded-full cursor-pointer'
                  src={pindetails.postedBy?.image}
                  alt="user-profile"/>
              </Link>
              <input className='flex-1 border-gray-100 outline-none  border-2 p-2 rounded-2xl focus:border-gray-300' type="text" placeholder='Add a comment' 
              value={comment}
              onChange={(e)=>{setComment(e.target.value)}}
              />
              <button type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none' 
              onClick={addComment} >
                {addingComment?'Posting the comment...':'Post'}
              </button>
           </div>
        </div>
    </div>
    {pins.length > 0  ?(
      <>
      <h2 className='text-center font-bold text-2x mt-8  mb-4'>
           More like this 
      </h2>
      <MasonryLayout pins={pins}/>
      </>
    ):(
      <Spinner message="Loading more pins ...."/>
    )}
    
     </>
  )
  
}

export default PinDetails