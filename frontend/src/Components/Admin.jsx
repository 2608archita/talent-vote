
import { useEffect, useState } from "react";
import axios from "axios";
function Admin() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [contestants, setContestants] = useState([]);
  useEffect(() => {
      fetchData();
    }, []);

  const fetchData = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/contestants`);
        setContestants(res.data);
    };
  
  const removeHandler = async (id)=>{
    try{
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete/${id}`)

      fetchData();  

      alert("Contestent Record Deleted")

    }catch (e){
      console.log(e)
      alert("Failed To Delete Contestent")
    }
  }

  const addContestent = async (e) => {
    e.preventDefault();

    // Trim removes extra spaces
    if (!name.trim() || !image.trim()) {
      alert("Name and Image URL cannot be empty!");
      return; // stop execution
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/add`, {
        name: name,
        image: image,
      });

      setName("");
      setImage("");
      fetchData();

    } catch (error) {
      console.error("Error adding contestant:", error);
    }
  };
  return (
    <div style={{color:'white'}}>
      <h1 style={{color:'white',textAlign:'center'}}>Welcome to Admin Page</h1>
      <div className='admin_form'>
        <h3>Add Contestent</h3>
        <div className='admin_form_container'>
          <form onSubmit={addContestent}>

            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}/>

            <label htmlFor="image">Image Link</label>
            <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)}/>
            
            <button type="submit">Add</button>

          </form>
        </div>
      </div>
      <hr />
      <div className='admin_manage'>
        <h3>Manage Contestent</h3>
        <div className="container">
          <div className="cards-wrapper">
              {contestants.map(c => (
              <div key={c._id} className="card">
  
                  <img src={c.image} alt={c.name} className="avatar" />
  
                  <h3>{c.name}</h3>
                  <p>Votes: {c.votes}</p>
                  <button onClick={()=>removeHandler(c._id)}>Remove</button>
              </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
