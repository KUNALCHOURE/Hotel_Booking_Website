import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/navbar.jsx';
import Home from './components/homepage.jsx';
import Footer from './components/shared/footer.jsx';
import Login from './components/auth/login.jsx';
import Signup from './components/auth/signup.jsx';
import ListingsPage from './pages/listings/listingpage.jsx';
import ListingDetail from './pages/listings/listingdetail.jsx';
import NewListing from './pages/listings/newlisting.jsx';
import EditListing from './pages/listings/editlisting.jsx';
import { AuthProvider } from './context/authcontext.jsx';
function App() {
  return (
    <Router>
       <AuthProvider>
            <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/listings" element={<ListingsPage/>} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/new" element={<NewListing />} />
          <Route path="/listings/:id/edit" element={<EditListing />} />
        </Routes>
        <Footer/>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;