import logo from "../assets/Logo.png";
import { useEffect, useState } from "react";
import axios from "axios";
import './Main.css'

const Main = () => {
    const [contestants, setContestants] = useState([]);
    const [voted, setVoted] = useState(false);

    useEffect(() => {
        fetchData();

        // check if already voted (after refresh)
        if(localStorage.getItem("voted") === "true"){
        setVoted(true);
        }
    }, []);

    const fetchData = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/contestants`);
        setContestants(res.data);
    };

    const vote = async (id) => {

        if(voted){
        alert("You already voted");
        return;
        }

        try{
        await axios.post(`${process.env.REACT_APP_API_URL}/vote/${id}`);

        // disable instantly
        setVoted(true);
        localStorage.setItem("voted","true");

        fetchData();

        alert("Vote submitted!");
        }
        catch(err){
        console.log(err);
        alert("Vote failed");
        }
    };
  return (
    <div className="container">

        <img src={logo} alt="GEC Talent Spotlight" className="logo"/>

        <div className="cards-wrapper">
            {contestants.map(c => (
            <div key={c._id} className="card">

                <img src={c.image} alt={c.name} className="avatar" />

                <h3>{c.name}</h3>
                <p>Votes: {c.votes}</p>

                <button
                disabled={voted}
                onClick={() => vote(c._id)}
                >
                {voted ? "Already Voted" : "Vote"}
                </button>

            </div>
            ))}
        </div>

    </div>
  )
}

export default Main
