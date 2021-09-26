import React from 'react';
import {useState , useEffect} from 'react';
import ReactMapGL ,{Marker,Popup} from 'react-map-gl';
import RoomRoundedIcon from '@material-ui/icons/RoomRounded';
import StarRateRoundedIcon from '@material-ui/icons/StarRateRounded';
import "./app.css";
import axios from "axios";
import {format} from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";


function App() {
  const myStorage = window.localStorage;

  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));

  const [pins,setPins] = useState([]);
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [showRegister, setRegister] = useState(false);
  const [showLogin, setLogin] = useState(false);


  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 22.007432591822422,
    longitude: 78.6662976165253,
    zoom: 4
  });

  useEffect(() => {
      const getPins = async () => {
        try {
          const allPins = await axios.get("/api/pins");
          setPins(allPins.data);
        } catch (err) {
          console.log(err);
        }
      };
      getPins();
    }, []);

    const handleMarkerClick = (id,lat,long)=>{
      setCurrentPlaceId(id);
      setViewport({...viewport,latitude:lat,longitude:long})
    }

    const handleAddClick = (e) =>{
      const [long,lat] = e.lngLat;
      setNewPlace({
        lat,
        long
      })
    }

    const handleSubmit = async (e)=>{
      e.preventDefault();
      const newPin = {
        username: currentUser,
        title,
        desc,
        rating,
        lat: newPlace.lat,
        long: newPlace.long
      }
      try {
        const res = await axios.post("/api/pins", newPin);
        setPins([...pins,res.data]);
        setNewPlace(null);
      } catch (e) {
        console.log(e);
      }
    };

    const handleLogout = ()=>{
      myStorage.removeItem("user");
      setCurrentUser(null);
    }

  return (
    <div className="App">
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={viewport => setViewport(viewport)}
      mapStyle="mapbox://styles/ojesh/ckty1fyrl0l2r17sc7gfb96vz"
      onDblClick= {handleAddClick}
      transitionDuration="150"
    >

    {pins.map(p=>(
     <>
    <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom *3.5} offsetTop={-viewport.zoom*7}>
    < RoomRoundedIcon style = {
    {
      fontSize: viewport.zoom * 8,
      color: p.username === currentUser ? "#FF7F50" : "slateblue",
      cursor: "pointer"
    }
  }
  onClick = {
    () => handleMarkerClick(p._id, p.lat,p.long)
  }
  />
      </Marker>
      {p._id === currentPlaceId && (
      <Popup className="entries"
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCurrentPlaceId(null)}

          anchor="right" >
          <div className="card">
          <label>Place</label>
          <h4 className="place">{p.title} </h4>
          <label>Review</label>
          <p className="desc"> {p.desc} </p>
          <label>Rating</label>
          <div className="stars">
           {Array(p.rating).fill(<StarRateRoundedIcon className="star"/>)}
          </div>
          <label>Description</label>
          <span className="username"> Created by <b>{p.username}</b></span>
          <span className="date"> {format(p.createdAt)} </span>

          </div>
        </Popup>
      )}
        </>
          ))}
          {newPlace && (
          <Popup className="details"
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left" >
              <div>
               <form onSubmit={handleSubmit}>
               <label> Title </label>
               <input placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)}/>
               <label> Review </label>
               <textarea placeholder="Say something about your desired place." onChange={(e) => setDesc(e.target.value)}/>
               <label> Rating </label>
               <select onChange={(e) => setRating(e.target.value)}>
                <option value="1"> 1</option>
                <option value="2"> 2</option>
                <option value="3"> 3</option>
                <option value="4"> 4</option>
                <option value="5"> 5</option>

               </select>
               <button className="submitButton" type="submit"> Add Pin </button>
               {currentUser ? (<span> </span>) : (<span className="popspan"> You Need to Log in first!</span>)}
               </form>
              </div>
              </Popup>
        )}
        {currentUser ? (  <button className="button logout" onClick={handleLogout}>Log Out</button> ) :
        (<div className="buttons">
          <button className="button login" onClick={() => setLogin(true) }>Login</button>
          <button className="button register" onClick={() => setRegister(true) }>Register</button>
          </div>)}
          {showRegister && < Register setRegister={setRegister}/>}
          {showLogin && < Login setLogin={setLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}



    </ReactMapGL>
    </div>
  );
}

export default App;
