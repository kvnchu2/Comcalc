import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
// import Date from './components/Nihao.js';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";


const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  textfield: {
    width: "50%",
  },
}));

function App() {
  const classes = useStyles();
  const [events, setEvents] = useState([]);

  var gapi = window.gapi
  /* 
    Update with your own Client Id and Api key 
  */
  var CLIENT_ID = process.env["REACT_APP_CLIENT_ID"]
  var API_KEY = process.env["REACT_APP_API_KEY"]
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"

  const handleClick = function(){
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        
        var event = {
          'summary': 'Awesome Event!',
          'location': '800 Howard St., San Francisco, CA 94103',
          'description': 'Really great refreshments',
          'start': {
            'dateTime': '2020-06-21T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': '2020-06-21T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'attendees': [
            {'email': 'lpage@example.com'},
            {'email': 'sbrin@example.com'}
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        }

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
        
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date('28 June 2020 0:00 UTC')).toISOString(),
          'timeMax': (new Date('28 June 2020 23:59 UTC')).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const eventsObject = response.result.items
          setEvents(eventsObject);
          console.log("hello", eventsObject);
        })

      })
    })
  }

  const eventsList = events.map( event => {
    return (
      <ul>
        <li>{event.summary}   {event.location}</li>
      </ul>
    )
  })

  const [userName, setUserName] = useState("");
  const handleSearchInput = (e) => {
    setUserName(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("nihao")
    handleClick(userName);
    setUserName("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Click to add event to Google Calendar</p>
        <p style={{fontSize: 18}}>Uncomment the get events code to get events</p>
        <p style={{fontSize: 18}}>Don't forget to add your Client Id and Api key</p>
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className={classes.root,"searchbar-with-icon"}
        >
          <TextField
            id="outlined-basic"
            label="Enter Date"
            variant="outlined"
            value={userName}
            onChange={handleSearchInput}
            className={classes.textfield}
          />
          {/* <SearchBar value={props.value} onChange={props.onChange} onRequestSearch={props.onClick}/> */}

          <label>
            <SearchIcon onClick={handleSubmit} id="search-icon" />
          </label>
          {/* <button type="button" onClick={props.onClick}>Submit</button> */}
        </form>
        <button style={{width: 100, height: 50}} onClick={handleClick}>Add Event</button>
      <div>
        {eventsList}
      </div>
      </header>
    </div>
  );
}

export default App;