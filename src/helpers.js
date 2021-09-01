import axios from 'axios';

//calculates the "to" date 
const calculateTimeMax = (eventDate) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let maxDay;
  let maxMonth;
  let splitDate = eventDate.split(" ")
  if (Number(eventDate.split(" ")[0]) === 31 && (eventDate.split(" ")[1] === "January" || eventDate.split(" ")[1] === "March" || eventDate.split(" ")[1] === "May" || eventDate.split(" ")[1] === "July" || eventDate.split(" ")[1] === "August" || eventDate.split(" ")[1] === "October" || eventDate.split(" ")[1] === "December")) {
    maxDay = 1;
    maxMonth = months[months.indexOf(eventDate.split(" ")[1]) === 11 ? months[0] : (months.indexOf(eventDate.split(" ")[1]) + 1)]
  } else if (Number(eventDate.split(" ")[0]) === 30 && (eventDate.split(" ")[1] === "February" || eventDate.split(" ")[1] === "April" || eventDate.split(" ")[1] === "June" || eventDate.split(" ")[1] === "September" || eventDate.split(" ")[1] === "November")){
    maxDay = 1;
    maxMonth = months[months.indexOf(eventDate.split(" ")[1]) === 11 ? months[0] : (months.indexOf(eventDate.split(" ")[1]) + 1)]
  } else {
    maxDay = Number(eventDate.split(" ")[0]) + 1;
  }
  splitDate[0] = maxDay;
  splitDate[1] = maxMonth;
  console.log("splitDate", splitDate);
  return splitDate.join(" ");
}

//fetches coordinates for first batch
const firstMap = async (icbcArrOne) => {
  const routePromise = await Promise.all( icbcArrOne.map(event => (axios.get(`https://api.tomtom.com/search/2/structuredGeocode.json?key=atFqCv6vs5HzL0u9qS9G5HXnhdYAA6kv&countryCode=CA&postalCode=${event.location}`)
  .then(({data})=> data))
  
))

return routePromise
}

//fetches coordinates for second batch 
const secondMap = async(icbcArrTwo) => {
  
  const routePromiseTwo = await Promise.all( icbcArrTwo.map(event => axios.get(`https://api.tomtom.com/search/2/structuredGeocode.json?key=atFqCv6vs5HzL0u9qS9G5HXnhdYAA6kv&countryCode=CA&postalCode=${event.location}`)
  .then(({data})=> data)))

  return routePromiseTwo;
}

//sets delay between first fetch and second fetch 
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const icbcEvents = (eventsObject) => {
  let icbcArr = [];
  
  eventsObject.forEach(event => {
    const eventSplit = event.location
    const eventSummary = event.summary 
    
    if (eventSummary.split(" ")[0] === "ICBC" || eventSummary.split(" ")[0] === "Icbc" || eventSummary === "home") {
      const icbcObj = {}
      icbcObj["location"] = eventSplit;
      icbcObj["summary"] = eventSummary;
      icbcArr.push(icbcObj)
    }
  })

  return icbcArr;
}


export { calculateTimeMax, firstMap, secondMap, wait, icbcEvents };