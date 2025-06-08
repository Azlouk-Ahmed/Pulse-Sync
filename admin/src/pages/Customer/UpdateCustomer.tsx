import React, { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import {
  FormInput,
  FormInline,
  FormSelect,
  FormLabel,
  FormHelp,
  FormTextarea,
  FormSwitch,
} from "../../base-components/Form";
import Gouvernerat from "../../utils/Gouvernerat.json";
import { Country } from "country-state-city";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lucide from "../../base-components/Lucide";
import { GetCurrentAdmin } from "../../Services/adminService"; // Importez la fonction du service


function UpdateCustomer() {
  const [viewInformation, setViewInformation] = useState(true);
  const [viewContact, setViewContact] = useState(false);
  const [viewAdress, setViewAdress] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentAdmin, setCurrentAdmin] = useState<any>([]);
      
  useEffect(() => {
    // Appeler la fonction pour récupérer l'administrateur actuel
    const fetchAdmin = async () => {
      try {
        const adminData = await GetCurrentAdmin();
        setCurrentAdmin(adminData);
      } catch (error) {
        console.error("Erreur dans le composant", error);
      }
    };

    fetchAdmin(); // Appeler la fonction au montage du composant
  }, []); // Le tableau vide [] signifie que cela s'exécute une seule fois au montage


  const [customer, setCustomer] = useState({
    _id: "",
    codecustomer: "",
    email: "",
    adresse: {},
    raison_sociale: "",
    matricule_fiscale: "",
    first_name: "",
    last_name: "",
    phone: "",
    num_carte_identite: "",
    name:"",
    sexe:"",
    gsm: "",
    siteweb: "",
  });

  const [address, setAddress] = useState({
    pays: "",
    Gouvernorat: "",
    Ville: "",
    adresse: "",
  });

  const [gouvernerats, setGouvernerats] = useState(Gouvernerat);
  const [nomGouvernerat, setNomGouvernerat] = useState<string>("");
  const [cities, setCities] = useState([{ Nom: "", value: "" }]);
  const [selectedCountry, setSelectedCountry] = useState({ name: "", isoCode: "" });

  const [matriculeFiscale, setMatriculeFiscale] = useState({
    part1: "",
    part2: "",
    part3: "",
    part4: "",
    part5: "000",
  });

  const getCustomer = async () => {
    try {
      const response = await axios.get(process.env.DASH_API_URL + `/getcustomer/${id}`);
      const customerData = response.data;

      setCustomer(customerData);
      setAddress(customerData.adresse || {
        pays: "",
        Gouvernorat: "",
        Ville: "",
        adresse: "",
      });

      if (customerData.matricule_fiscale) {
        const [part1, part2, part3, part4, part5] = customerData.matricule_fiscale.split(/[ /]/);
        setMatriculeFiscale({
          part1: part1 || "",
          part2: part2 || "",
          part3: part3 || "",
          part4: part4 || "",
          part5: part5 || "000",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du client :", error);
      toast.error("Erreur lors de la récupération du client.");
    }
  };

  useEffect(() => {
    getCustomer();
    setSelectedCountry(Country.getAllCountries()[223]);
    address.pays = Country.getAllCountries()[223].name;
  }, []);

  const validateEmail = (email: string | null) => {
    if (email === null || email.trim() === "") {
      return true; // Accepte une chaîne vide ou null
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
   // Test if the value contains only numbers
   const isNumeric = /^\d*$/.test(value);
   if ((name=== 'num_carte_identite') &&(!isNumeric)) {
    toast.error('Le N° carte identité doit contenir uniquement des chiffres.');
   } else if ((name=== 'phone') &&(!isNumeric)) {
    toast.error('Le téléphone doit contenir uniquement des chiffres.');
   } else if ((name=== 'gsm') &&(!isNumeric)) {
    toast.error('Le GSM doit contenir uniquement des chiffres.');
   }else{
    setCustomer({ ...customer, [name]: value });
   }
    };

  const onChangeInputAdresse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // SetAdresse({ ...Adresse, [name]: value });
    address.adresse = value;
    customer.adresse = address;
  };

  const handleGouvernoratChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGouv = event.target.value;
    setAddress({ ...address, Gouvernorat: selectedGouv });
    setNomGouvernerat(selectedGouv);
    const gouvernorat = gouvernerats.Gouvernorat.find((g) => g.Nom === selectedGouv);
    setCities(gouvernorat ? gouvernorat.Villes : []);
  };
  const handleMatriculeFiscaleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = /^\d*$/.test(value);
  
    if (name === "part1") {
      // Vérifie que la valeur contient uniquement des chiffres
      if (!/^\d*$/.test(value)) return;
  
      // Met à jour Part1 (les 6 premiers chiffres)
      setMatriculeFiscale((prevMatricule) => ({
        ...prevMatricule,
        part1: value.slice(0, 6), // Limite à 6 chiffres
      }));
  
      // Met à jour Part2 (le dernier caractère de Part1)
      if (value.length === 7) {
        setMatriculeFiscale((prevMatricule) => ({
          ...prevMatricule,
          part2: value[6], // Le dernier caractère
        }));
      }
    } else if ((name=== 'part5') &&(!isNumeric)) {
      toast.error('Le derniére N° de matricule doit contenir uniquement des chiffres.');
     } else {
      // Pour les autres parties (part3, part4, part5)
      setMatriculeFiscale((prevMatricule) => ({
        ...prevMatricule,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    const fullMatricule = `${matriculeFiscale.part1}${matriculeFiscale.part2} /${matriculeFiscale.part3}/${matriculeFiscale.part4} ${matriculeFiscale.part5}`;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      matricule_fiscale: fullMatricule,
    }));
  }, [matriculeFiscale]);

  useEffect(() => {
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      adresse: address,
    }));
  }, [address]);


  const navigateToCustomer = () => {
    // 👇️ navigate to /
    navigate("/customer");
  };
  
  const navigateToCustomerAdmin = () => {
    // 👇️ navigate to /
    navigate("/admin/customer");
  };
  
  const navigateToCustomerSousAdmin = () => {
    // 👇️ navigate to /
    navigate("/sous-admin/customer");
  };

  const updateCompanySettings = async () => {
    // Valider le format de l'e-mail
  if (!validateEmail(customer.email)) {
    toast.error("Le format de l'e-mail est invalide.");
    return;
  }
    try {
      await axios.put(process.env.DASH_API_URL + `/updatecustomer/${id}`, {
        ...customer,
        adresse: address,
      }).then((response) => {
        setTimeout(() => {
          toast.success("dossier mis à jour avec succès");
        }, 150);
        setTimeout(() => {
           if(currentAdmin?.roles?.name === "Supper_admin"){navigateToCustomer();}
              if(currentAdmin?.roles?.name === "Administration"){navigateToCustomerAdmin();}
              if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToCustomerSousAdmin();}
        }, 3000);
      });
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des paramètres.");
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium intro-y">Modifier Paramètre</h2>
      </div>
      <ToastContainer position="bottom-left" />
      <div className="grid grid-cols-12 gap-6">
        {/* BEGIN: CompanySettings Menu */}
        <div className="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
          <div className="mt-5 intro-y box">
            <div className="relative flex items-center p-5"></div>
            
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              {viewInformation ? (
                <p className="flex items-center font-medium cursor-pointer text-primary">
                  <Lucide icon="Activity" className="w-4 h-4 mr-2" />{" "}
                  Informations Personnelles
                </p>
              ) : (
                <p
                  className="flex items-center cursor-pointer "
                  onClick={() => {
                    setViewInformation(true);
                    setViewAdress(false);
                    setViewContact(false);
                    ;
                  }}
                >
                  <Lucide icon="Activity" className="w-4 h-4 mr-2" />{" "}
                  Informations Personnelles
                </p>
              )}

              {viewAdress ? (
                <p className="flex items-center mt-5 font-medium text-primary cursor-pointer">
                  <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Information
                  Adresse
                </p>
              ) : (
                <p
                  className="flex items-center mt-5 cursor-pointer"
                  onClick={() => {
                    setViewInformation(false);
                    setViewAdress(true);
                    setViewContact(false);
                    ;
                  }}
                >
                  <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Information
                  Adresse
                </p>
              )}
            </div>
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              {viewContact ? (
                <p className="flex items-center font-medium  text-primary cursor-pointer">
                  <Lucide icon="Activity" className="w-4 h-4 mr-2" /> Mail et
                  2éme Téléphone
                </p>
              ) : (
                <p
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    setViewInformation(false);
                    setViewAdress(false);
                    setViewContact(true);
                    ;
                  }}
                >
                  <Lucide icon="Activity" className="w-4 h-4 mr-2" /> Mail et
                  2éme Téléphone
                </p>
              )}
            </div>
            <div className="flex p-5 border-t border-slate-200/60 dark:border-darkmode-400"></div>
          </div>
        </div>

        {/* END: CompanySettings Menu */}
        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          {/* BEGIN: Display Information */}
          {viewInformation && (
            <div className="intro-x box lg:mt-5">
              <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">Informations Personnelles</h2>
              </div>
              <div className="p-5">
                <div className="flex flex-col xl:flex-row">
                  <div className="flex-1 mt-6 xl:mt-0">
                    <div className="grid grid-cols-2 gap-x-5">
                      <div className="mt-2">
                        <FormLabel>N° de dossier:</FormLabel>
                        <FormInput
                          name="codecustomer"
                          onChange={onChangeValue}
                          type="text"
                          placeholder="N° de dossier"
                          value={customer.codecustomer}
                          disabled
                        />
                      </div>

                      <div className="mt-2">
                        <FormLabel>Maladies chroniques:</FormLabel>
                        <FormInput
                          id="nom"
                          name="raison_sociale"
                          onChange={onChangeValue}
                          value={customer.raison_sociale}
                          type="text"
                          placeholder="Maladies chroniques"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <FormLabel>Type d'image:</FormLabel>
                      <FormInput
                          id="nom"
                          name="name"
                          onChange={onChangeValue}
                          value={customer.name}
                          type="text"
                          placeholder="Type d'image"
                        />
  

                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  type="button"
                  className="w-24 mt-4"
                  onClick={updateCompanySettings}
                >
                  Modifier
                </Button>
              </div>
            </div>
          )}

          {viewAdress && (
            <div className="mt-5 intro-y box">
              <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">Information Adresse</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-12 gap-x-5">
                  <div className="col-span-12 xl:col-span-6">
                    <div className="mt-3">
                      <FormLabel htmlFor="Gouvernourat">Gouvernorat</FormLabel>
                      <FormInput
                        id="Gouvernorat"
                        type="text"
                        placeholder="Gouvernorat"
                        value={address.Gouvernorat}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="mt-3">
                      <FormLabel htmlFor="Ville">Ville :</FormLabel>
                      <FormInput
                        id="Ville"
                        type="text"
                        placeholder="Ville "
                        value={address.Ville}
                        onChange={() => {}}
                        disabled
                      />
                    </div>

                    <div className="mt-3">
                      <FormLabel htmlFor="Adreseadh">Adresse et Code Postal</FormLabel>
                      <FormInput
                        id="Adreseadh"
                        type="text"
                        placeholder="Adresse "
                        value={address.adresse}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-span-12 xl:col-span-6">
                    <div className="mt-3">
                      <FormLabel htmlFor="Gouvernorat-adh">Gouvernorat</FormLabel>
                      <FormSelect
                        id="gouvernorat"
                        className="block px-4 py-3 text-center mt-1 min-w-full xl:min-w-[350px]"
                        onChange={handleGouvernoratChange}
                        name="gouvernorat"
                        value={nomGouvernerat}
                      >
                        <option value="">Select Gouvernorat</option>
                        {gouvernerats.Gouvernorat.map((item: any, index: any) => (
                          <option key={index} value={item.Nom}>
                            {item.Nom}
                          </option>
                        ))}
                      </FormSelect>
                    </div>
                    <div className="mt-3">
                      <FormLabel htmlFor="Ville-adh">Ville</FormLabel>
                      <FormSelect
                        id="ville"
                        className="block px-4 py-3 text-center mt-1 min-w-full xl:min-w-[350px]"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          setAddress({ ...address, Ville: e.target.value });
                        }}
                        name="ville"
                      >
                        <option value="">Select Ville</option>
                        {cities.map((item: any, index: any) => (
                          <option key={index} value={item.value}>
                            {item.Nom}
                          </option>
                        ))}
                      </FormSelect>
                    </div>

                    <div className="mt-3">
                      <FormLabel htmlFor="adresseCodeadh">Adresse et Code Postal</FormLabel>
                      <FormInput
                        id="adresseCodeadh"
                        type="text"
                        placeholder="adresse et code postal "
                        onChange={onChangeInputAdresse}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="primary"
                    type="button"
                    className="w-24 mr-auto"
                    onClick={updateCompanySettings}
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
          )}

          {viewContact && (
            <div className="mt-5 intro-y box">
              <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">Coordonnée</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-x-5">
                  <div className="mt-3">
                    <FormLabel>Nom</FormLabel>
                    <FormInput
                      id="compte"
                      name="first_name"
                      onChange={onChangeValue}
                      type="text"
                      placeholder="Nom"
                      value={customer.first_name}
                    />
                  </div>
                  <div className="mt-3">
                    <FormLabel>Prénom</FormLabel>
                    <FormInput
                      id="compte"
                      name="last_name"
                      onChange={onChangeValue}
                      type="text"
                      placeholder="Prénom"
                      value={customer.last_name}
                    />
                  </div>
                  <div className="mt-3">
                    <FormLabel>N° Carte identité :</FormLabel>
                    <FormInput
                      name="num_carte_identite"
                      onChange={onChangeValue}
                      type="text"
                      value={customer.num_carte_identite}
                      placeholder="N° Carte identité"
                    />
                  </div>

                  <div className="mt-3">
                    <FormLabel>Sexe :</FormLabel>
                    <FormInput
                      id="compte"
                      name="sexe"
                      onChange={onChangeValue}
                      type="text"
                      placeholder="Sexe"
                      value={customer.sexe}
                    />
                  </div>

                  <div className="mt-3">
                    <FormLabel>Téléphone</FormLabel>
                    <FormInput
                      id="compte"
                      name="phone"
                      onChange={onChangeValue}
                      type="text"
                      placeholder="Téléphone"
                      value={customer.phone}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="primary"
                    type="button"
                    className="w-24 mr-auto"
                    onClick={updateCompanySettings}
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UpdateCustomer;