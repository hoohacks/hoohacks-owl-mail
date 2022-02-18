import './App.css';
import {Button,TextField,Card} from '@material-ui/core'
import React,{useState,useEffect} from 'react'
import Select from 'react-select'
import logo from './hoohackslogo.png';
import Papa from 'papaparse';
import file from './emails.csv'
import clone from 'just-clone';


function App() {
  // initialize states
  const [entity,setEntity] = useState({name:"",class:"",type:"",email:""})
  const [myName,setMyName] = useState("")
  const [entitiesByName,setEntitiesByName] = useState(null);
  const [entitiesByEmail,setEntitiesByEmail] = useState(null);
  const [entitiesByClass,setEntitiesByClass] = useState(null);

// useEffect scans CSV to get data
useEffect(()=>{
  Papa.parse(file, {
    download: true,
    complete: function(results) { // this is a function that we'll use to get the data from the CSV and format it for our site
      const array = []; // stores entities
      results.data.splice(0,1) // gets rid of first row (column titles)
      results.data.forEach((entity,index)=>{ // accesses the array of data (indexed by rows) in results
      if(results.data[index-1]&&(results.data[index-1][1]===entity[1])){ // checks if the previous row was the same person
        array[array.length-1].class.push(entity[2]) // if condition met, only adds class of current row to class array of previous row
      }
      else{
        const newEntity={ // each person/org is stored as an entity object
          type:entity[0],
          name:entity[1],
          class:[entity[2]], 
          email:entity[3]
        }
        array.push(newEntity);
      }
      })
      // once all of the relevant rows have been parsed, we deep clone the array 3 times
      const array1 = clone(array)
      const array2 = clone(array)
      const array3 = clone(array)
      setEntitiesByName(setLabel(array1,"name")); // set label will return an array where the object's label is the name
      setEntitiesByClass(setLabel(array2,"class")); // set label will return an array where the object's label is the class
      setEntitiesByEmail(setLabel(array3,"email")); // set label will return an array where the object's label is the email
    }
  });
},[])

/*
Function to send the mailto command and open default mail app

Here's an important note!  Sometimes the mailto method might not work, and it's not your code's fault (although it totally could be lol)
but rather the browser+message's fault.  Each browser has it's own limit as to what the character limit for messages able to be sent by mailto
is.  If you exceed it, mailto won't work.  I've found that Safari and Firefox are the best when it comes to this.  Chrome is okay, but not good
for longer messages (ex: blurb for HooHacks 2022). Edge kinda sucks when it comes to this (I say this as a person with Edge as their default browser).
*/
  const sendEmail = (()=>{
    if(entity.type.toLowerCase()==="professor"){
      window.location.href = "mailto:"+entity.email+"?subject=Opportunity for Students - HooHacks 2022&body="+pMessage;
    }
    else{
      window.location.href = "mailto:"+entity.email+"?subject=Opportunity for Students - HooHacks 2022&body="+oMessage;
    }
  })

  // This is for organizing the data for react-select
  const setLabel = ((data,type)=>{
    const newArray = [];
      data.forEach((entity)=>{
        if(type==="name")
        entity.label=entity.name;
        else if(type==="email")
        entity.label=entity.email;
        else
        entity.label=formatArray(entity.class);

        newArray.push(entity);
      })
      return newArray;
  })

  // basically formats a professor's classes into an English string
  const formatArray = ((array)=>{
    if(array.length===1)
    return array[0]
    else if(array.length===2){
    return array[0]+" and "+array[1]
    }
    else{
      let result = ""
    for(let x=0;x<array.length;x++){
      if(x===array.length-1){
        result = result+" and "+array[x]
      }
      else if(x===0){
        result = result + array[0] + ","
      }
      else{
        result = result + " " + array[x] + ","
      }
    }
    return result;     
    }
  })

// Professor Message Version

const pMessage = `Dear Professor ${entity.name.split(' ').pop()},%0D%0A%0D%0A

I'm ${myName} from The HooHacks Team, and I'd greatly appreciate it if you would take the time to share this wonderful opportunity with your students in ${formatArray(entity.class)}.
%0D%0A%0D%0A
Registration for HooHacks 2022 is open!  HooHacks🦉 is UVA's premier student-run 24-hour hackathon and will take place March 26th - 27th as a hybrid event.  Hackathons are not for "hacking" in the sense of breaking into security systems, but more for "hacking" together a project within the span of 24 hours⏳.  It's a great opportunity for all students to learn, build, and have fun. We'd really like to stress that the hackathon does not require any prior coding experience and that non-STEM majors, first-time hackers, and beginner coders are all welcome.
%0D%0A%0D%0A
🌞This event will be hybrid. Those that are able to come in-person to UVA will be able to enjoy free food🍕, free swag👕, in-person sponsors, physical spaces to work🏢, and more!  You can also attend the event completely virtually and enjoy our online fun events + workshops!
%0D%0A%0D%0A
📢We will have experienced students and industry experts from companies like Leidos, CoStar, and Google hosting workshops and tech talks perfect for beginners and advanced students. 
%0D%0A%0D%0A
😆Group up with friends or meet new friends to create a project together for a chance to win prizes like laptops💻 and AirPods🎧 (we have $10,000💰 worth of prizes in total!). 
%0D%0A%0D%0A
📚We will have resources and mentors ready to guide and assist you with your project. 
%0D%0A%0D%0A
🎈Aside from that, HooHacks will have fun activities for everyone to enjoy scattered throughout the hackathon like a puzzle challenge, Pokémon tournament, and salsa dancing. 
%0D%0A%0D%0A
📄Here's an infographic about the event: https://bit.ly/3GTBR6B %0D%0A
✅Sign up today at:  https://www.hoohacks.io/register (Registration will close on March 16) %0D%0A
💭Learn more about the event at: http://hoohacks.io %0D%0A%0D%0A

Thank you so much!%0D%0A%0D%0A

Best Regards,%0D%0A
${myName}
`


// Organization Message Version
// Not updated since HooHacks for Humanity

const oMessage = `Dear ${entity.name},%0D%0A%0D%0A

I'm ${myName} from The HooHacks Team, and I would greatly appreciate it if you would take the time to share this wonderful opportunity with your members.%0D%0A%0D%0A

Due to the recent surge in COVID-19 cases in parts of the world such as India, Argentina, and more, The HooHacks Team feels compelled to contribute its resources and platform to combatting the pandemic.  
This is why we are introducing HooHacks for Humanity: COVID-19, a virtual hackathon and ideathon hybrid event from July 25-31 that serves as a platform for students from all academic backgrounds to utilize their creativity and problem solving abilities to solve/alleviate issues relating to COVID-19.  
This is a hybrid event as there will be two tracks: one that focuses primarily on the idea (similar to an ideathon), and another that will focus on the implementation of the solution (similar to a hackathon).  
Solutions could attempt to resolve problems like the efficiency of vaccine distribution, transportation to vaccine centers, or fundraising and awareness; it’s up to the team to define the problem and address it.  
We will have multiple incredible guest speakers at this event and also mentors that will provide valuable guidance to teams as they formulate their solutions.  
In addition, the best ideas and solution implementations will win prizes and cash funding!%0D%0A%0D%0A

You can sign up today at this link: https://humanity.hoohacks.io/apply %0D%0A%0D%0A
Learn more about the hackathon at: https://humanity.hoohacks.io/ %0D%0A%0D%0A

Again, thank you for sharing this meaningful opportunity with everyone!  We hope to see everyone there.%0D%0A%0D%0A

Sincerely,%0D%0A
${myName}
  `
  // This is what's rendered on the website
  return (
    <div class="center" style={{justifyContent:"center"}}>
      <Card elevation="13"style={{marginTop:"10%", marginBottom:"5%",height:"auto",width:"auto"}}>
        <div style={{margin:"50px"}}>
      <div style={{display:"block",textAlign:"center"}}>
      <img style={{height:60, width:410}} alt="HooHacks Logo" src={logo}/>
      <h3 style={{marginTop:2,fontWeight:"300"}}>Hoo's mailing this? Owl mail It!</h3>
      </div>
      <h2 style={{fontWeight:"300"}}>Name/Organization:</h2>
      <Select placeholder="Name/Organization" value={entity&&{label:entity.name}} onChange={(selectedOption)=>{
        setEntity(selectedOption);
      }} options={entitiesByName} />
      <h2 style={{fontWeight:"300"}}>Email Address:</h2>
      <Select placeholder="Email Address" value={entity&&{label:entity.email}} onChange={(selectedOption)=>{
        setEntity(selectedOption);
      }} options={entitiesByEmail} />
      <h2 style={{fontWeight:"300"}}>Class List:</h2>
      <Select value={entity&&{label:formatArray(entity.class)}} onChange={(selectedOption)=>{
        setEntity(selectedOption);
      }} options={entitiesByClass} />
      <h2 style={{fontWeight:"300"}}>Your Name:</h2>
      <TextField placeholder="Name" style={{width:200}}onChange={(evt)=>{
        setMyName(evt.target.value)
      }} onKeyDown={(evt)=>{
        if(evt.key==="Enter"){
            sendEmail();
        }}}/>
      <br/>
      <Button variant="contained" color="primary" style={{marginTop:"30px"}} onClick={()=>{
        sendEmail();
      }}>Send Email</Button>
      </div>
      </Card>
    </div>
  );
}

export default App;
