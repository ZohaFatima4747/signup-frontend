import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactForm from "./pages/ContactForm";
import Home from "./pages/HomePage";
import Admin from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContactForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;