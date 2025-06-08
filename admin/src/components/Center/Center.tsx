import { FC, useState, useEffect } from "react";
import clsx from "clsx";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { useFetchData } from "../../hooks/useFetchData";
import apiService from '../../api/ApiService.js';
import { toast, ToastContainer } from "react-toastify";
import { FormInput } from "../../base-components/Form";
import { useAuthContext } from '../../hooks/useAuthContext.js';



interface CenterData {
  _id: string;
  img: string;
  name: string;
  governorate: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closingTime: string;
}

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: string;
  ratings: number;
  available: boolean;
}

interface CenterProps {
  data: CenterData;
  refreshIndicator: Function
}

const Center: FC<CenterProps> = ({ data, refreshIndicator }) => {

  const {auth} = useAuthContext();
  if(!auth) {
    return (
      <div>something is wrong</div>
    )
  }
  
  const [doctorsModalOpen, setDoctorsModalOpen] = useState(false);
  const [isOpenModifier, setIsOpenModifier] = useState(false);
  const [formData, setFormData] = useState({
    name: data.name,
    governorate: data.governorate,
    address: data.address,
    phone: data.phone,
    email: data.email,
    openTime: data.openTime,
    closingTime: data.closingTime,
  });

  // ADDED: Effect to sync with data changes
  useEffect(() => {
    setFormData({
      name: data.name,
      governorate: data.governorate,
      address: data.address,
      phone: data.phone,
      email: data.email,
      openTime: data.openTime,
      closingTime: data.closingTime,
    });
  }, [data]);

  console.log("========", formData.openTime, formData.closingTime, data);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    
    // Append all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    
    // Append the image file with the correct field name 'img'
    if (image) {
      payload.append("img", image);
    }

    setIsSubmitting(true);

    try {
      // Send the FormData payload
      const response = await apiService.put(`center`,data._id, payload, true, true);

      if (response.success) {
        toast.success("Centre modifié avec succès");
        refreshIndicator(Date.now());
        setIsOpenModifier(false);
      }
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong.";
      toast.error(message);
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    // Reset to current data values instead of empty strings
    setFormData({
      name: data.name,
      governorate: data.governorate,
      address: data.address,
      phone: data.phone,
      email: data.email,
      openTime: data.openTime,
      closingTime: data.closingTime,
    });
    setImage(null);
  };

  const { data: docs, loading, error } = useFetchData("doctor/centers/"+data._id);

  
  const isOpenNow = () => {
    
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    
    
    const [openH, openM] = data.openTime.split(":").map(Number);
    const [closeH, closeM] = data.closingTime.split(":").map(Number);
    const openTotal = openH * 60 + openM;
    const closeTotal = closeH * 60 + closeM;
    
    
    const isOvernight = closeTotal <= openTotal;
    return isOvernight
      ? nowMinutes >= openTotal || nowMinutes < closeTotal
      : nowMinutes >= openTotal && nowMinutes < closeTotal;
  };

  const isOpen = isOpenNow();

  return (
    <>
    <ToastContainer />
      <div className="intro-y max-w-[29%] min-w-80 w-full">
        <div
          className={clsx([
            "relative zoom-in",
            "",
          ])}
        >
          <div className="p-5 box">
            {}
            <div className="intro-y flex items-center gap-4">
              <div className="w-16 h-16 rounded-md overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${data.img}`}
                  alt={data.name}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium">{data.name}</h2>
                <div className="flex items-center mt-1">
                  <Lucide
                    icon="Circle"
                    className={`w-3 h-3 mr-1 ${isOpen ? "text-success" : "text-danger"}`}
                  />
                  <span className="text-slate-500 text-xs">
                    {isOpen 
                      ? `Open - Closes at ${data.closingTime}` 
                      : `Closed - Opens at ${data.openTime}`}
                  </span>
                </div>
              </div>
            </div>
            
            {}
            <div className="mt-4 text-sm text-slate-500">
              <p>{data.address}</p>
              <p className="mt-1">{data.email}</p>
            </div>
            
            {}
            <div className="flex justify-between mt-4 text-sm text-slate-500">
              <div className="flex items-center">
                <Lucide icon="MapPin" className="w-4 h-4 mr-1 text-primary" />
                <span>{data.governorate}</span>
              </div>
              <div className="flex items-center">
                <Lucide icon="Phone" className="w-4 h-4 mr-1 text-primary" />
                <span>{data.phone}</span>
              </div>
            </div>
            

            <div className="flex justify-between mt-5 items-center">
              {(auth.user.role === "superAdmin"|| auth?.user?.center === data._id )&&<Button className="" onClick={() => {
                resetForm(); // Reset form before opening
                setIsOpenModifier(true);
              }} variant="secondary">
                {auth.user.role === "superAdmin"}
                modifier
              </Button>}
              <Button variant="primary" 
                onClick={() => setDoctorsModalOpen(true)}
                className="btn btn-sm btn-primary"
              >
                View doctors
              </Button>
            </div>
          </div>
        </div>
      </div>

       <Dialog
        open={isOpenModifier}
        onClose={() => {
          setIsOpenModifier(false);
        }}
        className="relative z-50"
      >
        <div className="fixed overflow-auto scrollbar-hide inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="max-w-lg space-y-4 border bg-white p-12">
            <Dialog.Title className="text-lg font-medium leading-6 text-center">
              modifier un Centre Médical
            </Dialog.Title>

            <div>
              <label className="block">Nom du Centre</label>
              <FormInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block">Gouvernorat</label>
              <Menu>
                <Button
                  variant="secondary"
                  className="w-full flex justify-between items-center"
                >
                  <Menu.Button as="div" className="w-full text-left">
                    {formData.governorate || "Sélectionner un gouvernorat"}
                  </Menu.Button>
                  <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                </Button>
                <Menu.Items
                  placement="bottom-start"
                  className="max-h-[20rem] overflow-y-scroll"
                >
                  {[
                    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul",
                    "Zaghouan", "Bizerte", "Beja", "Jendouba", "Kef",
                    "Siliana", "Sousse", "Monastir", "Mahdia", "Kairouan",
                    "Kasserine", "Sidi Bouzid", "Gafsa", "Tozeur", "Kebili",
                    "Gabes", "Medenine", "Tataouine", "Sfax",
                  ].map((gov) => (
                    <Menu.Item
                      key={gov}
                      onClick={() =>
                        setFormData({ ...formData, governorate: gov })
                      }
                    >
                      <div className="text-base text-slate-500 px-2 py-1 hover:bg-slate-100 rounded-md">
                        {gov}
                      </div>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>
            </div>

            <div>
              <label className="block">Adresse</label>
              <FormInput
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block">Téléphone</label>
              <FormInput
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block">Email (optionnel)</label>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block">Heure d'ouverture</label>
                <FormInput
                  type="time"
                  name="openTime"
                  value={formData.openTime || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block">Heure de fermeture</label>
                <FormInput
                  type="time"
                  name="closingTime"
                  value={formData.closingTime || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button className="w-full">
              <label htmlFor="ci" className="flex cursor-pointer w-full justify-center items-center gap-5">
                <div>{image ? image.name : "image du centre"}</div>
                <div className="relative w-4 h-4 mr-3 sm:w-5 sm:h-5 text-slate-500 sm:mr-5">
                  <Lucide icon="Paperclip" className="w-full h-full" />
                  <FormInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="ci"
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
                  setIsOpenModifier(false);
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Lucide
                      icon="Loader"
                      className="w-4 h-4 mr-2 animate-spin"
                    />
                    En cours...
                  </div>
                ) : (
                  "Modifier le Centre"
                )}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {}
      <Dialog
        open={doctorsModalOpen}
        onClose={() => setDoctorsModalOpen(false)}
        staticBackdrop={true}
      >
        <Dialog.Panel className="p-0">
          <div className="p-5 border-b mt-16">
            <div className="flex items-center">
              <h2 className="text-lg font-medium mr-auto">
                Doctors at {data.name}
              </h2>
              <button
                className="btn btn-outline-secondary p-1"
                onClick={() => setDoctorsModalOpen(false)}
              >
                <Lucide icon="X" className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-5">
            {docs?.data?.map((doctor) => (
              <div key={doctor._id} className="flex items-center py-4 border-b last:border-b-0">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${doctor.img}`}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="font-medium">{doctor.firstName}</div>
                    <div className="font-medium">{doctor.lastName}</div>
                    
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">{doctor.specialization}</div>
                  <div className="flex items-center mt-1 text-xs text-slate-500">
                    <div className="flex items-center mr-3">
                      <Lucide icon="Award" className="w-3.5 h-3.5 mr-1 text-primary" />
                      {doctor.experience}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 text-right border-t">
            <button
              type="button"
              className="btn btn-outline-secondary w-20 mr-1"
              onClick={() => setDoctorsModalOpen(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary w-20">
              View All
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default Center;