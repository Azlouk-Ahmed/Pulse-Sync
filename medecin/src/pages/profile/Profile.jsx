import Lucide from '../../base-components/Lucide';
import { useAuthContext } from '../../hooks/useAuthContext.js';
import { Dialog } from "../../base-components/Headless";
import { useState } from 'react';
import apiService from '../../api/ApiService.js';
import { FormInput } from "../../base-components/Form";
import Button from '../../base-components/Button';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetchData } from '../../hooks/useFetchData.js';
import AppointmentTable from '../../components/appointmentlist/AppointmentTable.jsx';
import ExamList from './ExamList.jsx';

function Profile() {
    const {auth, dispatch} = useAuthContext()
      if(!auth) {
        return (
          <div>something is wrong</div>
        )
      }
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: auth.user.firstName,
        lastName: auth.user.lastName,
        email: auth.user.email,
        experience: auth.user.experience,
        contactNumber: auth.user.contactNumber,
        desc: auth.user.desc ? auth.user.desc : "No description provided"
    });
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: appointments } = useFetchData(
    auth.user.specialization === "prescripteur" ? "appointment/doc" : "rdv/doc",
    [],
    true
  );

 

    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleImageChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setImage(e.target.files[0]);
      }
    };

    const resetForm = () => {
      setFormData({
        firstName: auth.user.firstName,
        lastName: auth.user.lastName,
        email: auth.user.email,
        experience: auth.user.experience,
        contactNumber: auth.user.contactNumber,
        desc: auth.user.desc ? auth.user.desc : "No description provided"
      });
      setImage(null);
    };
    
    const handleSubmit = async () => {
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.experience || !formData.contactNumber) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        // Create FormData object for handling file upload
        const payload = new FormData();
        
        // Append all form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
          payload.append(key, value);
        });
        
        // Append the image file if selected
        if (image) {
          payload.append("img", image);
        }
        
        const response = await apiService.put("doctor/edit", auth.user._id, payload, true, true);
        console.log(response)
        if (response.success) {
          toast.success("Profil mis à jour avec succès");
          setIsOpen(false);
          dispatch({ type: "LOGIN", payload: {...auth,user:response.data} });
          console.log(auth)
        localStorage.setItem("authDoctor", JSON.stringify({...auth,user:response.data}));
        }
      } catch (error) {
        console.log(error)
        toast.error(error || "Une erreur s'est produite lors de la mise à jour du profil");
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div>
        <ToastContainer />
        <Dialog
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            resetForm();
          }}
          className="relative z-50"
        >
          <div className="fixed overflow-auto scrollbar-hide inset-0 flex w-screen items-center justify-center p-4">
            <Dialog.Panel className="max-w-lg space-y-4 border bg-white p-12">
              <Dialog.Title className="text-lg font-medium leading-6">
                Modifier votre profil
              </Dialog.Title>
              <div>
                <label className="block">Prénom</label>
                <FormInput 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block">Nom</label>
                <FormInput 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block">Email</label>
                <FormInput 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block">Années d'expérience</label>
                <FormInput 
                  type="number" 
                  name="experience" 
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block">Numéro de téléphone</label>
                <FormInput 
                  type="text" 
                  name="contactNumber" 
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block">Description</label>
                <FormInput 
                  type="text" 
                  name="desc" 
                  value={formData.desc}
                  onChange={handleInputChange}
                />
              </div>
              
              <Button className="w-full">
                <label htmlFor="profile-image" className="flex cursor-pointer w-full justify-center items-center gap-5">
                  <div>{image ? image.name : "Photo de profil"}</div>
                  <div className="relative w-4 h-4 mr-3 sm:w-5 sm:h-5 text-slate-500 sm:mr-5">
                    <Lucide icon="Paperclip" className="w-full h-full" />
                    <FormInput
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="profile-image"
                      name="img"
                      className="absolute top-0 left-0 w-full h-full opacity-0"
                    />
                  </div>
                </label>
              </Button>
              
              <div className="flex justify-between">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Lucide icon="Loader" className="w-4 h-4 mr-2 animate-spin" />
                      En cours...
                    </div>
                  ) : (
                    "Mettre à jour"
                  )}
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
       <div className="relative intro-x mb-12">
      <div className="bg-primary h-60 rounded-xl"></div>
      <div className="absolute top-8 left-8 flex items-center">
        <div className="w-40 h-40 shadow-xl overflow-hidden mr-8">
          <img 
            src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${auth.user.img}`}
            alt={auth.user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white">
          <h1 className="text-2xl font-light mb-1">Bonjour,</h1>
          <h2 className="text-4xl font-semibold mb-2">{auth?.user?.firstName+" "+auth?.user?.lastName}</h2>
          <h3 className="text-2xl font-light mb-1 flex gap-5">Modifier vos données ici , <Lucide onClick={() => setIsOpen(true)} className='cursor-pointer' icon='Edit' /></h3>
        </div>
      </div>
    </div>
    <h1 className="header">vos historiques👋</h1>
    {appointments &&<AppointmentTable appointments={appointments} />}
    <ExamList />

  </div>
  );
}

export default Profile