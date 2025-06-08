import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import apiService from '../api/ApiService';

function Signup() {
    const { dispatch } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confPw: '',
        firstName: '',
        lastName: '',
        sex: 'male',   
        age: '',
        phone: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
          if (formData.password !== formData.confPw) {
            setLoading(false);
            setError("Passwords do not match");
            return;
          }
      
          const signupResponse = await apiService.post(
            "patient/signup",
            formData,
            false
          );
      
          setSuccess(signupResponse);
          localStorage.setItem("auth", JSON.stringify(signupResponse));
          dispatch({ type: "LOGIN", payload: signupResponse });
          setLoading(false);
      
          setError(null);
        } catch (err) {
          setLoading(false);
          console.error(err);
          setError(err.response?.data?.error || 'Something went wrong');
          setSuccess(null);
        }
      };
      

    return (
        <section className="w-full">
            <div className="lg:w-[100%] w-[95%] mx-auto gap-2 lg:flex justify-center items-center">
                {/* Left Content */}
                <div className="form signup mx-auto">
                    <div className="form-content">
                        <header>Signup</header>
                        <form onSubmit={handleSubmit}>
                            <div className="field input-field">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="input"
                                    required
                                />
                            </div>

                            {/* Sex Selection */}
                            <div className="field input-field">
  <div className="flex justify-around gap-4">
    <label className="flex gap-3.5 items-center space-x-2">
      <input
        type="radio"
        name="sex"
        value="male"
        checked={formData.sex === 'male'}
        onChange={handleChange}
        className="form-radio text-blue-500 focus:ring-blue-400"
      />
      <span>Male</span>
    </label>
    <label className="flex gap-3.5 items-center space-x-2">
      <input
        type="radio"
        name="sex"
        value="female"
        checked={formData.sex === 'female'}
        onChange={handleChange}
        className="form-radio text-pink-500 focus:ring-pink-400"
      />
      <span>Female</span>
    </label>
  </div>
</div>


                            <div className="field input-field">
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Age"
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create Password"
                                    className="password"
                                    required
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type="password"
                                    name="confPw"
                                    value={formData.confPw}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="password"
                                    required
                                />
                            </div>

                            {error && !loading && <p className="error">{error}</p>}
                            {loading && <p className="loading">loading ...</p>}
                            <div className="field button-field">
                                <button type="submit">Signup</button>
                            </div>
                        </form>
                        <div className="form-link">
                            <span>
                                Already have an account?{' '}
                                <Link to="/login" className="link login-link">
                                    Login
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup;
