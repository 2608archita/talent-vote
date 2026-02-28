import "./App.css";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Admin from './Components/Admin'
import Main from "./Components/Main";
function App() {
  return (
    <div>
      <BrowserRouter> 
        <Routes> 
          <Route path="/" element={<Main/>}/>
          <Route path="/admin" element={<Admin/>}/> 
        </Routes> 
      </BrowserRouter> 
    </div>
  );
}

export default App;