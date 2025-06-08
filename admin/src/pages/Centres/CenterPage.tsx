import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Center from "../../components/Center/Center";
import { useFetchData } from "../../hooks/useFetchData";
import { useState, useEffect } from "react";
import { FormInput } from "../../base-components/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Menu } from "../../base-components/Headless";
import apiService from '../../api/ApiService.js';
import { useAuthContext } from '../../hooks/useAuthContext.js';


function CenterPage() {
  const {auth} = useAuthContext();
  if(!auth) {
    return (
      <div>something is wrong</div>
    )
  }
  const [isOpen, setIsOpen] = useState(false);
  const [successDate, setSuccessDate] = useState(null);
  const { data, loading, error } = useFetchData("center",[successDate],false);
  
  const [formData, setFormData] = useState({
    name: "",
    governorate: "",
    address: "",
    phone: "",
    email: "",
    openTime: "",
    closingTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data && data.data) {
      if (searchQuery.trim() === "") {
        setFilteredData(data.data);
      } else {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = data.data.filter(center => 
          center.name.toLowerCase().includes(lowerCaseQuery) ||
          center.governorate.toLowerCase().includes(lowerCaseQuery) ||
          center.address.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredData(filtered);
      }
    }
  }, [data, searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
      // FIXED: Send the FormData payload instead of formData object
      const response = await apiService.post("center", payload, true, true);

      if (response.success) {
        toast.success("Centre ajouté avec succès");
        setSuccessDate(Date.now());
        setIsOpen(false);
        resetForm();
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
    setFormData({
      name: "",
      governorate: "",
      address: "",
      phone: "",
      email: "",
      openTime: "",
      closingTime: "",
    });
    setImage(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="mt-0">liste de centres</h5>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          ajouter un centre
        </Button>
      </div>

      {/* Search input */}
      <div className="mt-4 mb-5">
        <div className="relative">
          <FormInput
            type="text"
            placeholder="Rechercher des centres par nom, gouvernorat ou adresse..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-[20rem]"
          />
          <Lucide 
            icon="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" 
          />
          {searchQuery && (
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              onClick={() => setSearchQuery("")}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-5">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Lucide
                icon="Loader"
                className="w-8 h-8 mx-auto animate-spin text-primary"
              />
              <div className="mt-2">Loading centers...</div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center text-danger">
              <Lucide
                icon="AlertTriangle"
                className="w-8 h-8 mx-auto text-danger"
              />
              <div className="mt-2">Error loading centers</div>
            </div>
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="flex justify-center items-center w-full h-64">
            <div className="text-center text-slate-500">
              <Lucide
                icon="Search"
                className="w-8 h-8 mx-auto text-slate-300"
              />
              <div className="mt-2">
                {searchQuery 
                  ? "Aucun centre ne correspond à votre recherche" 
                  : "Aucun centre disponible"}
              </div>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          filteredData.map((centerItem) => (
            <Center key={centerItem._id} data={centerItem} refreshIndicator={setSuccessDate} />
          ))}
      </div>

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
            <Dialog.Title className="text-lg font-medium leading-6 text-center">
              Ajouter un Centre Médical
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
                  value={formData.openTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block">Heure de fermeture</label>
                <FormInput
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
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
                  setIsOpen(false);
                  resetForm();
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
                  "Ajouter le Centre"
                )}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default CenterPage;