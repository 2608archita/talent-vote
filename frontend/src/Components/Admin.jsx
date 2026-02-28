import { useEffect, useState } from "react";
import axios from "axios";
function Admin() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/contestants`,
      );
      setContestants(res.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setContestants([]);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

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

  const deleteOne = async (id) => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset this contestant's votes?",
    );

    if (!confirmReset) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete/${id}`);

      fetchData();

      alert("Contestent Record Deleted");
    } catch (e) {
      console.log(e);
      alert("Failed To Delete Contestent");
    }
  };

  const resetVote = async (id) => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset this contestant's votes?",
    );

    if (!confirmReset) return;
    // console.log('Conformed')
    // console.log(id)
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/reset/${id}`);

      fetchData();
    } catch (error) {
      console.error("Error resetting vote:", error);
    }
  };

  const resetAll = async () => {
    alert("Are You Sure You Want to Proceed");
    alert("Bad Things Will Happen If You Are not CareFull");
    const passkey = window.prompt("Enter admin passkey:");

    if (!passkey) return;

    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/resetAll`, {
        passkey,
      });

      alert("All votes reset successfully!");
      fetchData();
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Invalid passkey!");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  const deleteAll = async () => {
    alert("Are You Sure You Want to Proceed");
    alert("Bad Things Will Happen If You Are not CareFull");
    const passkey = window.prompt("Enter admin passkey:");

    if (!passkey) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteAll`, {
        data: { passkey },
      });

      alert("All Contestants Deleted Successfully!");
      fetchData();
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Invalid passkey!");
      } else {
        alert("Something went wrong.");
      }
    }
  };
  return (
    <div style={{ color: "white" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>
        Welcome to Admin Page
      </h1>
      <div className="admin_form">
        <h3>Add Contestant</h3>
        <div className="admin_form_container">
          <form onSubmit={addContestent}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="image">Image Link</label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />

            <button type="submit">Add</button>
          </form>
        </div>
      </div>
      <hr />
      <div className="admin_manage">
        <h3>Manage Contestant</h3>
        <button onClick={() => resetAll()} className="danger_btn">
          Reset All Votes
        </button>
        &nbsp; &nbsp;
        <button onClick={() => deleteAll()} className="danger_btn">
          Delete All Contestants
        </button>
        <div className="container">
          <div className="cards-wrapper">
            {loading ? (
              <div>
                <p className="loading-text">
                  Loading<span className="dots"></span>
                </p>
              </div>
            ) : contestants.length === 0 ? (
              <h2>There are No Contestants</h2>
            ) : (
              contestants.map((c) => (
                <div key={c._id} className="card">
                  <img src={c.image} alt={c.name} className="avatar" />
                  <h3>{c.name}</h3>
                  <p>Votes: {c.votes}</p>
                  <button onClick={() => deleteOne(c._id)}>Remove</button>
                  &nbsp;&nbsp;
                  <button onClick={() => resetVote(c._id)}>Reset Vote</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Admin;
