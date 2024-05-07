export async function fetchEvents(searchTerm) {
  let url = 'http://localhost:3000/events';
  if(searchTerm){
    url+='?search='+searchTerm
  }
    
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
console.log("respone",response)
    const { events } = await response.json();
    console.log('events',events)

    return events;
  }