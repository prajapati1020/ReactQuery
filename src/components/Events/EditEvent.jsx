import { Link, redirect, useNavigate, useParams, useSubmit,useNavigation } from 'react-router-dom';
import {  useQuery } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent,queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const {state} =useNavigation()
  const param = useParams()
  const submit =useSubmit()



 const {data  ,isError ,error} = useQuery({
  queryKey:['events',param.id],
    queryFn:({signal})=>fetchEvent({signal,id:param.id}),
    staleTime:10000
  })


//   const {mutate} =useMutation({
//     mutationFn:updateEvent,
//     onMutate:async (data)=>{
//       const newEvent =data.event;
//      await queryClient.cancelQueries({
//         queryKey:['events',param.id]
//       })
//      const previousEvent= queryClient.getQueryData(['events',param.id])
//       queryClient.setQueryData(['events',param.id],newEvent);

//     return {previousEvent}
//     },
//     onError:(error,data,context)=>{
//  queryClient.setQueryData(['events',param.id],context.previousEvent)
//     },
//     onSettled:()=>{
//       queryClient.invalidateQueries(['events',param.id])
//     }
//   })

  function handleSubmit(formData) {
   submit(formData,{method:'PUT'})
  }

  function handleClose() {
    navigate('../');
  }
  let content;

  

  if(isError){
    content =(
      <>
    <ErrorBlock title="Failed to event " message={error.info?.message || 'Failed to load event. please check your input and try again later.'}/>
    <div className='form-action'>
      <Link to="../" className='button'>
        Oky
      </Link>
    </div>
    </>
    )
  }

  if(data){
    content = (
      <>
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state ==='submitting'?<p>Sending data...</p>:<>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
        </>}
        
      </EventForm>
      </>
    )
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}


export function loader({param}){
  return queryClient.fetchQuery({
    queryFn:({signal})=>fetchEvent({signal,id:param.id}),
    queryKey:['events',param.id],
  });

}

export async function action({request,params}){
  const formData = await request.fromData();
  const updateEventData = Object.fromEntries(formData);
 await  updateEvent({event:updateEventData,id:params.id});
 await queryClient.invalidateQueries(['events'])
 return redirect('../')
}