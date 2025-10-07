import React, { useState, useEffect } from 'react';

// ** PRODUCTION-READY API URL **
// This uses the Vercel environment variable for the live site,
// but falls back to localhost for local development. This is the correct way.
const API_URL = import.meta.env.VITE_API_URL || 'https://straynstray.onrender.com';

// Main App Component - The root of our application
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  // State to hold context for navigation, e.g., which item to book
  const [pageContext, setPageContext] = useState(null);

  useEffect(() => {
    // Check local storage for user data on initial load
    const token = localStorage.getItem('staynstray_token');
    const userData = localStorage.getItem('staynstray_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('staynstray_token', token);
    localStorage.setItem('staynstray_user', JSON.stringify(userData));
    setUser(userData);
    navigateTo('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('staynstray_token');
    localStorage.removeItem('staynstray_user');
    setUser(null);
    navigateTo('home');
  };

  const navigateTo = (page, context = null) => {
    setPageContext(context);
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  // Router to render the correct page component
  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage navigateTo={navigateTo} onLoginSuccess={handleLoginSuccess} />;
      case 'hotels':
        return <HotelsPage navigateTo={navigateTo} user={user} onLogout={handleLogout} />;
      case 'hotelReservation':
        return <HotelReservationPage navigateTo={navigateTo} user={user} onLogout={handleLogout} hotel={pageContext} />;
      case 'flights':
        return <FlightsPage navigateTo={navigateTo} user={user} onLogout={handleLogout} />;
      case 'travelerDetails':
        return <TravelerDetailsPage navigateTo={navigateTo} user={user} onLogout={handleLogout} flight={pageContext} />;
      case 'trains':
        return <TrainsPage navigateTo={navigateTo} user={user} onLogout={handleLogout} />;
      case 'payment':
        return <PaymentPage navigateTo={navigateTo} user={user} onLogout={handleLogout} bookingDetails={pageContext} />;
      case 'paymentSuccess':
        return <PaymentSuccessPage navigateTo={navigateTo} user={user} onLogout={handleLogout} bookingReceipt={pageContext} />;
      case 'bookings':
        return <MyBookingsPage navigateTo={navigateTo} user={user} onLogout={handleLogout} />;
      case 'home':
      default:
        return <HomePage navigateTo={navigateTo} user={user} onLogout={handleLogout} />;
    }
  };

  return <div className="bg-gray-50 min-h-screen font-sans">{renderPage()}</div>;
}

// ... (Rest of the components are identical to the previous correct version) ...
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +                         HOME PAGE & COMPONENTS                     +
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const HomePage = ({ navigateTo, user, onLogout }) => (
  <div className="flex flex-col min-h-screen">
    <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
    <main className="flex-grow">
      <HeroSection navigateTo={navigateTo} />
      <WhyChooseUs />
      <PopularDestinations />
      <CallToAction navigateTo={navigateTo} />
    </main>
    <Footer />
  </div>
);

const HeroSection = ({ navigateTo }) => (
    <div className="relative bg-gray-900">
        <div className="absolute inset-0">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop" alt="Beautiful travel destination"/>
            <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Your Journey Starts Here</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">Book flights, hotels, and trains all in one place. Experience seamless travel planning.</p>
            <SearchWidget navigateTo={navigateTo}/>
        </div>
    </div>
);

const SearchWidget = ({ navigateTo }) => {
    const [activeTab, setActiveTab] = useState('Flights');

    const renderForm = () => {
        const searchButtonClasses = "w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center h-12 whitespace-nowrap";
        switch (activeTab) {
            case 'Hotels':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <FormInput label="Destination" placeholder="e.g., New York" />
                        <FormInput label="Check-in" type="date" />
                        <FormInput label="Check-out" type="date" />
                        <button onClick={() => navigateTo('hotels')} className={searchButtonClasses}>Search Hotels</button>
                    </div>
                );
            case 'Trains':
                 return (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <FormInput label="From" placeholder="Departure city" />
                        <FormInput label="To" placeholder="Destination city" />
                        <FormInput label="Departure" type="date" />
                        <FormInput label="Passengers" placeholder="1 Adult" />
                        <button onClick={() => navigateTo('trains')} className={searchButtonClasses}>Search Trains</button>
                    </div>
                );
            case 'Flights':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <FormInput label="From" placeholder="Departure city" />
                        <FormInput label="To" placeholder="Destination city" />
                        <FormInput label="Departure" type="date" />
                        <FormInput label="Passengers" placeholder="1 Adult" />
                        <button onClick={() => navigateTo('flights')} className={searchButtonClasses}>Search Flights</button>
                    </div>
                );
        }
    };
    
    return (
        <div className="mt-10 max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-4 text-left">
            <div className="flex border-b">
                {['Flights', 'Hotels', 'Trains'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-8 py-3 text-sm sm:text-base font-medium transition-colors duration-300 ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                        {tab}
                    </button>
                ))}
            </div>
            <div className="p-6">
                {renderForm()}
            </div>
        </div>
    );
};

const WhyChooseUs = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why Choose StayNStray?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Experience the future of travel booking with our comprehensive platform.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard icon="⚡️" title="Instant Booking" description="Book flights, hotels, and trains instantly with our lightning-fast booking system."/>
                <FeatureCard icon="🛡️" title="Secure Payments" description="Your transactions are protected with bank-level security and encryption."/>
                <FeatureCard icon="📞" title="24/7 Support" description="Get help anytime, anywhere with our round-the-clock customer support."/>
            </div>
        </div>
    </section>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
        <div className="text-4xl">{icon}</div>
        <h3 className="mt-4 text-xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
    </div>
);

const PopularDestinations = () => (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Popular Destinations</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Discover amazing places around the world recommended by our travelers.</p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <DestinationCard name="Paris" price="24,999" imageUrl="https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=1974&auto=format&fit=crop"/>
                <DestinationCard name="Tokyo" price="49,999" imageUrl="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop"/>
                <DestinationCard name="New York" price="32,999" imageUrl="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop"/>
                <DestinationCard name="London" price="28,999" imageUrl="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop"/>
            </div>
        </div>
    </section>
);

const DestinationCard = ({ name, price, imageUrl }) => (
    <div className="group relative rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <img src={imageUrl} alt={name} className="w-full h-80 object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
        <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-lg">From ₹{price}</p>
        </div>
    </div>
);

const CallToAction = ({ navigateTo }) => (
    <section className="bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Journey?</h2>
            <p className="mt-4 max-w-xl mx-auto">Join millions of travelers who trust StayNStray for their booking needs.</p>
            <button onClick={() => navigateTo('hotels')} className="mt-8 bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                Start Booking Now
            </button>
        </div>
    </section>
);

const AuthPage = ({ navigateTo, onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const toggleView = () => setIsLoginView(!isLoginView);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-1/2 p-8 md:p-12">
                         <h1 onClick={() => navigateTo('home')} className="text-3xl font-bold text-blue-600 cursor-pointer mb-8">StayNStray</h1>
                        {isLoginView 
                            ? <LoginForm onLoginSuccess={onLoginSuccess} toggleView={toggleView} />
                            : <RegistrationForm toggleView={toggleView} />
                        }
                    </div>
                    <div className="hidden md:block w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-4">Your Journey Starts Here</h2>
                        <p className="mb-8">Book trains, hotels, and flights all in one place. Experience seamless travel planning with our comprehensive booking platform.</p>
                         <ul className="space-y-4">
                            <li className="flex items-start"><span className="text-xl mr-3">✓</span> Book train tickets worldwide</li>
                            <li className="flex items-start"><span className="text-xl mr-3">✓</span> Find perfect accommodations</li>
                            <li className="flex items-start"><span className="text-xl mr-3">✓</span> Compare the best flight prices</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoginForm = ({ onLoginSuccess, toggleView }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch(`${API_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const data = await response.json();
            if (response.ok) {
                onLoginSuccess(data.user, data.token);
            } else {
                setMessage(data.message || 'Login failed.');
            }
        } catch (error) {
            setMessage('Could not connect to the server. Please try again later.');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to your account to continue your journey.</p>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">Sign In</button>
                {message && <p className="text-red-500 text-center text-sm">{message}</p>}
            </form>
            <p className="mt-6 text-center text-sm">Don't have an account? <button onClick={toggleView} className="font-medium text-blue-600 hover:underline">Sign up</button></p>
        </div>
    );
};

const RegistrationForm = ({ toggleView }) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch(`${API_URL}/api/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const data = await response.json();
            if (response.ok) {
                setMessage('Success! You can now sign in.');
                setTimeout(toggleView, 2000);
            } else {
                setMessage(data.message || 'Registration failed.');
            }
        } catch (error) {
            setMessage('Could not connect to the server. Please try again later.');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600 mb-8">Get started with your free account today.</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="firstName" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="lastName" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">Create Account</button>
                {message && <p className="text-green-500 text-center text-sm">{message}</p>}
            </form>
            <p className="mt-6 text-center text-sm">Already have an account? <button onClick={toggleView} className="font-medium text-blue-600 hover:underline">Sign in</button></p>
        </div>
    );
};

const HotelsPage = ({ navigateTo, user, onLogout }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch(`${API_URL}/api/hotels`);
                const data = await response.json();
                setHotels(data);
            } catch (error) {
                console.log("Could not fetch hotels, using mock data.");
                setHotels([
                    { _id: '1', name: 'The Grand Plaza Hotel', location: 'Manhattan, New York', price: 23999, rating: 4.8, amenities: ['Free WiFi', 'Pool', 'Gym'], imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', description: 'Luxury hotel in the heart of Manhattan with stunning city views and world-class amenities.' },
                    { _id: '2', name: 'Boutique Central Hotel', location: 'Midtown, New York', price: 14999, rating: 4.5, amenities: ['Free WiFi', 'Breakfast', 'Concierge'], imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop', description: 'Charming boutique hotel with personalized service and unique design in the heart of the city.' },
                    { _id: '3', name: 'Business Suites Manhattan', location: 'Financial District, New York', price: 19500, rating: 4.3, amenities: ['Free WiFi', 'Business Center', 'Gym'], imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop', description: 'Modern business hotel perfect for corporate travelers with excellent meeting facilities.' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const handleViewDetails = (hotel) => {
        if (user) {
            navigateTo('hotelReservation', hotel);
        } else {
            navigateTo('auth');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Stay</h1>
                    <p className="text-gray-600 mt-1">Discover amazing hotels worldwide.</p>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-1/4 xl:w-1/5 bg-white p-6 rounded-lg shadow-md self-start"><h3 className="text-lg font-bold border-b pb-2">Filter by: (Static)</h3></aside>
                    <div className="flex-1">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{loading ? 'Searching for properties...' : `${hotels.length} properties found`}</h2>
                        </div>
                        {loading ? (
                            <div className="text-center p-10"><p>Loading hotels...</p></div>
                        ) : (
                            <div className="space-y-6">
                                {hotels.map(hotel => <HotelCard key={hotel._id} hotel={hotel} onViewDetails={() => handleViewDetails(hotel)} />)}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const HotelCard = ({ hotel, onViewDetails }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <img src={hotel.imageUrl} alt={hotel.name} className="w-full md:w-80 h-64 md:h-auto object-cover"/>
        <div className="p-6 flex flex-col flex-1">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-900">{hotel.name}</h3>
                    <div className="text-lg font-bold text-blue-600 flex items-center gap-1">⭐ {hotel.rating}</div>
                </div>
                <p className="text-gray-600 mt-1">{hotel.location}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                    {hotel.amenities.map(amenity => (
                        <span key={amenity} className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{amenity}</span>
                    ))}
                </div>
                <p className="text-gray-700 mt-4 flex-grow">{hotel.description}</p>
            </div>
            <div className="mt-auto pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t mt-4">
                <div>
                    <span className="text-2xl font-bold text-gray-900">₹{hotel.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-600 text-sm"> per night</span>
                </div>
                <button onClick={onViewDetails} className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">View Details</button>
            </div>
        </div>
    </div>
);

const HotelReservationPage = ({ navigateTo, user, onLogout, hotel }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        dateOfBirth: '', address: '', checkInDate: '', checkOutDate: '',
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '' }));
        }
    }, [user]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const bookingDetails = {
            ...formData,
            hotel,
            bookingType: 'hotel',
        };
        navigateTo('payment', bookingDetails);
    };

    if (!hotel) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
                <main className="flex-grow text-center py-20 container mx-auto">
                    <h2 className="text-2xl font-bold">Oops! No hotel selected.</h2>
                    <button onClick={() => navigateTo('hotels')} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Back to Hotels</button>
                </main>
                <Footer/>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto max-w-4xl px-4 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800">Hotel Reservation</h1>
                    <p className="text-gray-600 mt-2">Complete your booking for <span className="font-bold text-blue-600">{hotel.name}</span>.</p>
                    
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <fieldset className="border-t border-gray-200 pt-6">
                            <legend className="text-xl font-semibold text-gray-700 mb-4">Primary Guest Information</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                <FormInput label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                                <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                                <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} className="md:col-span-2" />
                            </div>
                        </fieldset>
                         <fieldset className="border-t border-gray-200 pt-6">
                            <legend className="text-xl font-semibold text-gray-700 mb-4">Booking Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Check-in Date" name="checkInDate" type="date" value={formData.checkInDate} onChange={handleChange} required />
                                <FormInput label="Check-out Date" name="checkOutDate" type="date" value={formData.checkOutDate} onChange={handleChange} required />
                            </div>
                        </fieldset>
                        <div className="flex justify-end pt-4">
                             <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">Continue to Payment</button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

const FlightsPage = ({ navigateTo, user, onLogout }) => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch(`${API_URL}/api/flights`);
                const data = await response.json();
                setFlights(data);
            } catch (error) {
                console.log("Could not fetch flights, using mock data.");
                setFlights([
                    { _id: 'f1', from: { code: 'NYC', city: 'New York' }, to: { code: 'LAX', city: 'Los Angeles' }, departureTime: '8:30', arrivalTime: '14:15', duration: '5h 45m', airline: 'American Airlines', price: 3500 },
                    { _id: 'f2', from: { code: 'NYC', city: 'New York' }, to: { code: 'LAX', city: 'Los Angeles' }, departureTime: '10:00', arrivalTime: '15:45', duration: '5h 45m', airline: 'Delta Airlines', price: 3850 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, []);

    const handleSelectFlight = (flight) => {
        if (user) {
            navigateTo('travelerDetails', flight);
        } else {
            navigateTo('auth');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Available Flights</h1>
                </div>
                 <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-1/4 xl:w-1/5 bg-white p-6 rounded-lg shadow-md self-start"><h3 className="text-lg font-bold border-b pb-2">Filter Results (Static)</h3></aside>
                    <div className="flex-1">
                        {loading ? <p>Loading flights...</p> : (
                            <div className="space-y-4">
                                {flights.map(flight => <FlightCard key={flight._id} flight={flight} onSelect={() => handleSelectFlight(flight)} />)}
                            </div>
                        )}
                    </div>
                 </div>
            </main>
            <Footer />
        </div>
    );
};

const FlightCard = ({ flight, onSelect }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-xl transition-shadow duration-300">
        <div className="w-full sm:w-auto flex items-center gap-4 text-center sm:text-left">
            <div className="text-lg font-bold">{flight.departureTime} <span className="block text-sm text-gray-500 font-normal">{flight.from.code}</span></div>
            <div className="text-sm text-gray-500">✈️<br/>{flight.duration}</div>
            <div className="text-lg font-bold">{flight.arrivalTime} <span className="block text-sm text-gray-500 font-normal">{flight.to.code}</span></div>
        </div>
        <div className="text-center sm:text-left text-sm text-gray-700">{flight.airline}</div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-2xl font-bold">₹{flight.price.toLocaleString('en-IN')}</div>
            <button onClick={onSelect} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Select</button>
        </div>
    </div>
);

const TravelerDetailsPage = ({ navigateTo, user, onLogout, flight }) => {
     const [formData, setFormData] = useState({
        title: 'Mr.', firstName: '', lastName: '', dateOfBirth: '', gender: 'Male', nationality: 'United States',
        email: '', phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({...prev, firstName: user.firstName, lastName: user.lastName, email: user.email }));
        }
    }, [user]);
    
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const bookingDetails = {
            ...formData,
            flight,
            bookingType: 'flight',
        };
        navigateTo('payment', bookingDetails);
    };

    if (!flight) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
                <main className="flex-grow text-center py-20 container mx-auto">
                    <h2 className="text-2xl font-bold">Oops! No flight selected.</h2>
                    <button onClick={() => navigateTo('flights')} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Back to Flights</button>
                </main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto max-w-4xl px-4 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800">Traveler Details</h1>
                    <p className="text-gray-600 mt-2">Please provide accurate information as it appears on your government-issued ID.</p>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <fieldset className="border-t pt-6">
                            <legend className="text-xl font-semibold text-gray-700 mb-4">Passenger 1 (Adult)</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                            </div>
                        </fieldset>
                        <fieldset className="border-t pt-6">
                             <legend className="text-xl font-semibold text-gray-700 mb-4">Contact Information</legend>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                <FormInput label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                             </div>
                        </fieldset>
                        <div className="flex justify-between items-center pt-4">
                            <button type="button" onClick={() => navigateTo('flights')} className="text-gray-600 font-semibold hover:text-blue-600 transition">← Back to Selection</button>
                            <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition">Continue to Payment →</button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const TrainsPage = ({ navigateTo, user, onLogout }) => {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const response = await fetch(`${API_URL}/api/trains`);
                const data = await response.json();
                setTrains(data);
            } catch (error) {
                console.log("Could not fetch trains, using mock data.");
                setTrains([
                    { _id: 't1', name: 'Rajdhani Express', from: 'Delhi', to: 'Mumbai', departureTime: '16:55', arrivalTime: '08:15', price: 4500 },
                    { _id: 't2', name: 'Duronto Express', from: 'Mumbai', to: 'Delhi', departureTime: '23:00', arrivalTime: '15:55', price: 4200 },
                ]);
            } finally { setLoading(false); }
        };
        fetchTrains();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Available Trains</h1>
                </div>
                 <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-1/4 xl:w-1/5 bg-white p-6 rounded-lg shadow-md self-start"><h3 className="text-lg font-bold border-b pb-2">Filter Results (Static)</h3></aside>
                    <div className="flex-1">
                        {loading ? <p>Loading trains...</p> : (
                            <div className="space-y-4">
                                {trains.map(train => <TrainCard key={train._id} train={train} />)}
                            </div>
                        )}
                    </div>
                 </div>
            </main>
            <Footer />
        </div>
    );
};

const TrainCard = ({ train }) => (
     <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-xl transition-shadow duration-300">
        <div className="w-full sm:w-auto flex-grow text-center sm:text-left">
            <div className="text-xl font-bold text-gray-800">{train.name}</div>
            <div className="text-sm text-gray-500">{train.from} → {train.to}</div>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-4 text-center sm:text-left">
            <div className="text-lg font-bold">{train.departureTime} <span className="block text-sm text-gray-500 font-normal">{train.from}</span></div>
            <div className="text-sm text-gray-500">→</div>
            <div className="text-lg font-bold">{train.arrivalTime} <span className="block text-sm text-gray-500 font-normal">{train.to}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-2xl font-bold">₹{train.price.toLocaleString('en-IN')}</div>
            <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Select</button>
        </div>
    </div>
);

const PaymentPage = ({ navigateTo, user, onLogout, bookingDetails }) => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('staynstray_token');
            const response = await fetch(`${API_URL}/api/bookings`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
                body: JSON.stringify(bookingDetails) 
            });
            const data = await response.json();
            if (response.ok) {
                navigateTo('paymentSuccess', data.booking);
            } else {
                setMessage(data.message || 'Booking failed.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('An error occurred. Could not connect to the server.');
            setMessageType('error');
        }
    };

    if (!bookingDetails) {
         return (
            <div className="flex flex-col min-h-screen">
                <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
                <main className="flex-grow text-center py-20 container mx-auto">
                    <h2 className="text-2xl font-bold">Oops! No booking details found.</h2>
                </main>
                <Footer/>
            </div>
        );
    }
    
    const isHotel = bookingDetails.bookingType === 'hotel';
    const totalAmount = isHotel ? bookingDetails.hotel.price : bookingDetails.flight.price;

    return (
        <div className="flex flex-col min-h-screen">
            <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto max-w-4xl px-4 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                     <h1 className="text-3xl font-bold text-gray-800 mb-6">Secure Payment</h1>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Booking Summary</h2>
                            <BookingSummary details={bookingDetails} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Payment Information</h2>
                             <form onSubmit={handleSubmit} className="space-y-4">
                                <FormInput label="Cardholder Name" name="cardName" required />
                                <FormInput label="Card Number" name="cardNumber" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Expiry Date" name="expiry" placeholder="MM/YY" required />
                                    <FormInput label="CVV" name="cvv" required />
                                </div>
                                <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition">
                                    Complete Payment - ₹{totalAmount.toLocaleString('en-IN')}
                                </button>
                                {message && <p className={`text-center mt-4 font-medium ${messageType === 'error' ? 'text-red-600' : ''}`}>{message}</p>}
                             </form>
                        </div>
                     </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const BookingSummary = ({ details }) => {
    const isHotel = details.bookingType === 'hotel';
    return (
        <div className="space-y-4 text-gray-700">
            {isHotel ? (
                <>
                    <h3 className="text-lg font-bold">{details.hotel.name}</h3>
                    <p>{details.hotel.location}</p>
                    <p><span className="font-semibold">Check-in:</span> {details.checkInDate}</p>
                    <p><span className="font-semibold">Check-out:</span> {details.checkOutDate}</p>
                    <p className="text-2xl font-bold border-t pt-4 mt-4">Total: ₹{details.hotel.price.toLocaleString('en-IN')}</p>
                </>
            ) : (
                 <>
                    <h3 className="text-lg font-bold">{details.flight.from.city} → {details.flight.to.city}</h3>
                    <p>{details.flight.airline}</p>
                    <p><span className="font-semibold">Departure:</span> {details.flight.departureTime}</p>
                    <p><span className="font-semibold">Arrival:</span> {details.flight.arrivalTime}</p>
                    <p className="text-2xl font-bold border-t pt-4 mt-4">Total: ₹{details.flight.price.toLocaleString('en-IN')}</p>
                </>
            )}
        </div>
    );
};

const PaymentSuccessPage = ({ navigateTo, user, onLogout, bookingReceipt }) => {
     if (!bookingReceipt) {
         return (
            <div className="flex flex-col min-h-screen">
                <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
                <main className="flex-grow text-center py-20 container mx-auto">
                    <h2 className="text-2xl font-bold">Oops! No booking receipt found.</h2>
                </main>
                <Footer/>
            </div>
        );
    }
    const isHotel = bookingReceipt.bookingType === 'hotel';

    return (
        <div className="flex flex-col min-h-screen">
            <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto max-w-3xl px-4 py-12 text-center">
                 <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold text-gray-800">Payment Successful!</h1>
                    <p className="text-gray-600 mt-2">Your booking has been confirmed. Thank you for choosing StayNStray.</p>
                    <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><span className="font-semibold">Booking ID:</span> {bookingReceipt._id}</p>
                             {isHotel ? (
                                <>
                                    <p><span className="font-semibold">Hotel:</span> {bookingReceipt.details.hotelName}</p>
                                    <p><span className="font-semibold">Check-in:</span> {bookingReceipt.details.checkInDate}</p>
                                </>
                             ) : (
                                 <>
                                    <p><span className="font-semibold">Flight:</span> {bookingReceipt.details.flight.from.city} → {bookingReceipt.details.flight.to.city}</p>
                                    <p><span className="font-semibold">Airline:</span> {bookingReceipt.details.flight.airline}</p>
                                 </>
                             )}
                            <p><span className="font-semibold">Total Amount:</span> ₹{bookingReceipt.totalAmount.toLocaleString('en-IN')}</p>
                            <p><span className="font-semibold">Status:</span> <span className="text-green-600 font-bold">Confirmed</span></p>
                        </div>
                    </div>
                     <button onClick={() => navigateTo('home')} className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition">Back to Home</button>
                 </div>
            </main>
            <Footer />
        </div>
    );
};

const MyBookingsPage = ({ navigateTo, user, onLogout }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            setError('');
            const token = localStorage.getItem('staynstray_token');
            if (!token) {
                setError('You must be logged in to view your bookings.');
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/my-bookings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) { throw new Error('Failed to fetch bookings.'); }
                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header navigateTo={navigateTo} user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-4 py-8">
                 <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
                 {loading && <p>Loading your bookings...</p>}
                 {error && <p className="text-red-500">{error}</p>}
                 {!loading && !error && bookings.length === 0 && (
                     <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600">You have no bookings yet.</p>
                     </div>
                 )}
                 {!loading && !error && bookings.length > 0 && (
                     <div className="space-y-6">
                        {bookings.map(booking => <BookingCard key={booking._id} booking={booking} />)}
                     </div>
                 )}
            </main>
            <Footer />
        </div>
    );
};

const BookingCard = ({ booking }) => {
    const isHotel = booking.bookingType === 'hotel';
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <div className="text-xs text-gray-500">Booking ID: {booking._id}</div>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">
                        {isHotel ? booking.details.hotelName : `${booking.details.flight.from.city} → ${booking.details.flight.to.city}`}
                    </h3>
                    <p className="text-sm text-gray-600">{isHotel ? `Check-in: ${booking.details.checkInDate}` : `Airline: ${booking.details.flight.airline}`}</p>
                </div>
                <div className="text-left sm:text-right">
                    <div className="text-lg font-bold text-gray-800">₹{booking.totalAmount.toLocaleString('en-IN')}</div>
                    <div className="text-sm font-semibold text-green-600">Confirmed</div>
                </div>
            </div>
        </div>
    );
};

const Header = ({ navigateTo, user, onLogout }) => {
    const handleBookingsClick = (e) => {
        e.preventDefault();
        if (user) {
            navigateTo('bookings');
        } else {
            navigateTo('auth');
        }
    };
    
    return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <div className="flex-shrink-0">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="text-2xl font-bold text-blue-600">StayNStray</a>
                </div>
                <nav className="hidden md:flex md:items-center md:space-x-8">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('hotels'); }} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Hotels</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('trains'); }} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Trains</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('flights'); }} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Flights</a>
                    <a href="#" onClick={handleBookingsClick} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">My Bookings</a>
                </nav>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-700 hidden sm:block">Welcome, {user.firstName}!</span>
                            <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">Sign Out</button>
                        </div>
                    ) : (
                        <button onClick={() => navigateTo('auth')} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Sign In</button>
                    )}
                </div>
            </div>
        </div>
    </header>
);
};
const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                     <h2 className="text-2xl font-bold">StayNStray</h2>
                     <p className="text-gray-400 mt-2">Your trusted partner for seamless travel experiences worldwide.</p>
                </div>
                <div>
                    <h3 className="font-bold uppercase tracking-wider">Company</h3>
                    <ul className="mt-4 space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">Press</a></li>
                    </ul>
                </div>
                <div>
                     <h3 className="font-bold uppercase tracking-wider">Support</h3>
                    <ul className="mt-4 space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">Help Center</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white">Safety</a></li>
                    </ul>
                </div>
                 <div>
                     <h3 className="font-bold uppercase tracking-wider">Follow Us</h3>
                    <ul className="mt-4 space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">Facebook</a></li>
                        <li><a href="#" className="hover:text-white">Twitter</a></li>
                        <li><a href="#" className="hover:text-white">Instagram</a></li>
                    </ul>
                </div>
            </div>
             <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} StayNStray. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

const FormInput = ({ label, name, type = 'text', value, onChange, required, className, placeholder }) => (
    <div className={`text-gray-700 ${className}`}>
        <label className="block text-sm font-medium mb-1">{label}{required && ' *'}</label>
        <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-12"/>
    </div>
);

        
