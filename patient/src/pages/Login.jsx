import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import apiService from '../api/ApiService';

function Login() {
    const { dispatch } = useAuthContext();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
      
          const response = await apiService.post(
            "patient/login",
            formData,
            false
          );
          localStorage.setItem("auth", JSON.stringify(response));
          dispatch({ type: "LOGIN", payload: response });
          setLoading(false);
      
          setError(null);
        } catch (err) {
          setLoading(false);
          console.error(err);
          setError(err.error || 'Something went wrong');
          setSuccess(null);
        }
      };



    return (
        <section className="w-full h-screen flex justify-center items-center bg-gray-100">
            <div className="lg:w-[100%] w-[95%] mx-auto gap-2 lg:flex justify-center items-center">
                {/* Left Content */}
                <div className="form login mx-auto">
                    <div className="form-content">
                        <header className='underline'>Login</header>
                        <form onSubmit={handleSubmit}>
                            <div className="field input-field">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="input"
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="password"
                                />
                            </div>
                            {error  && !loading && <p className="error">{error}</p>}
                            {loading && <p className="loading">loading ...</p>}
                            <div className="field button-field">
                                <button type="submit">Login</button>
                            </div>
                        </form>
                        <div className="form-link">
                            <span>Don't have an account? <Link to="/signup" className="link signup-link">Signup</Link></span>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    );
}

export default Login;
