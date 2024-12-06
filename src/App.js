import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import QuoteList from "./components/QuoteList";
import QuoteCreation from "./components/QuoteCreation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/quotes" element={<QuoteList />} />
        <Route path="/create" element={<QuoteCreation />} />
      </Routes>
    </Router>
  );
}

export default App;
