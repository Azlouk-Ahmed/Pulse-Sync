import React from "react";
import Button from "../../base-components/Button";
import { useState, MouseEvent, useEffect } from "react";

import Lucide from "../../base-components/Lucide";

import { useNavigate } from "react-router-dom";

import { FormInput, FormInline, FormSelect, FormLabel } from "../../base-components/Form";
import {
  Preview,
} from "../../base-components/PreviewComponent";
import { Dialog } from "../../base-components/Headless";
import Gouvernerat from "../../utils/Gouvernerat.json";
import { Country } from "country-state-city";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AddCustomer() {
  const [View1, SetView1] = useState(true);
  const [View2, SetView2] = useState(false);
  const navigate = useNavigate();

  const [currentAdmin, setCurrentAdmin] = useState<any>([]);
  

  

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
  
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [customer, setCustomer] = useState({
    _id: "",
  
		codecustomer: "",
		email:"",
		adresse:{},
    raison_sociale:"",
    matricule_fiscale:"",
		first_name:"",
		last_name:"",
		phone:"",
    name:"",
		num_carte_identite:"",
    sexe:"",
		gsm:"",
		siteweb:"",
  });

  const [address, setAddress] = useState({
    pays: "",
    Gouvernorat: "",
    Ville: "",
    adresse: "",
  });
  const [Gouvernerats, SetGouvernerats] = useState(Gouvernerat);
  const [NomGouvernerat, SetNomGouvernerat] = useState<string>("");
  const [cities, setCities] = useState([
    {
      Nom: "",
      value: "",
    },
  ]);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "",
    isoCode: "",
  });
  
  const validateEmail = (email: string | null) => {
    if (email === null || email.trim() === "") {
      return true; // Accepte une chaîne vide ou null
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const onChangevalue = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const onChangeInputadresse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // SetAdresse({ ...Adresse, [name]: value });
    address.adresse = value;
    customer.adresse = address;
  };
  const handleGouvernoratChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedGouv = event.target.value;
    address.Gouvernorat = event.target.value;
    SetNomGouvernerat(selectedGouv);
    let gouvernorat = Gouvernerats.Gouvernorat.find(
      (g) => g.Nom === selectedGouv
    );
    setCities(gouvernorat ? gouvernorat?.Villes : []);
  };
  useEffect(() => {
    setSelectedCountry(Country.getAllCountries()[223]);
    address.pays = Country.getAllCountries()[223].name;
  }, []);
  
const [isSubmitting, setIsSubmitting] = useState(false);

  const AddCustomer = async (e: MouseEvent) => {
     // Valider le format de l'e-mail
      if (!validateEmail(customer.email)) {
        toast.error("Le format de l'e-mail est invalide.");
        return;
      }
      // Vérifier si le formulaire est déjà en cours de soumission
      if (isSubmitting) {
       return;
     }
     // Désactiver le bouton
     setIsSubmitting(true);
    try {
      // ajouter un nouvel dossier
        
        await axios
          .post(process.env.DASH_API_URL + "/addcustomer", {
            ...customer,
          })
          .then((response) => {
            setTimeout(() => {
              toast.success("Nouvel dossier ajouté avec succès");
            }, 150);
            setTimeout(() => {
              if(currentAdmin?.roles?.name === "Supper_admin"){navigateToCustomer();}
              if(currentAdmin?.roles?.name === "Administration"){navigateToCustomerAdmin();}
              if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToCustomerSousAdmin();}
            }, 3000);
          });
    } catch (error: any) {
        if (error) {
          toast.error(<b>{error?.response?.data?.message}</b>);
        }
      }finally {
       // Réactiver le bouton après la soumission (qu'elle réussisse ou échoue)
    setTimeout(() => {
      setIsSubmitting(false);
      handleClose(); // Fermer la popup après la soumission
    }, 2000); // Délai de 2 secondes avant de réactiver le bouton et fermer la popup
    }
  };
  const validateRequiredFields = () => {
    const requiredFields = [
      customer.codecustomer,
      customer.raison_sociale,
      address.adresse,
    ];
  
    return requiredFields.every(field => field.trim() !== "");
  };
  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium intro-y">Ajouter Dossier</h2>
      </div>

      <Preview>
          {/* BEGIN: Modal Content */}
          <Dialog
            open={open}
            onClose={handleClose}
          >
            <Dialog.Panel className="my-[10%] mx-auto">
              <Dialog.Title>
                <h2 className="mr-auto text-base font-medium">
                  Ajouter Dossiers
                </h2>
              </Dialog.Title>
              <Dialog.Description className="grid grid-cols-1 gap-4 gap-y-3">
                <div className="p-2 border rounded-md border-slate-200/60 dark:border-darkmode-400 ">
                  <div className="flex items-center pb-1 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                    <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Vous êtes
                    sûr de création Nouvelle dossier ...!
                  </div>
    
                </div>
              </Dialog.Description>
              <Dialog.Footer>
                <Button
                variant="secondary"
                className="w-24"
                onClick={handleClose}
              >
                Annuler
              </Button>

              <Button
                variant="primary"
                className="w-24 ml-2"
                onClick={(e: any) => {
                  AddCustomer(e);
                }}
                disabled={isSubmitting} // Désactiver le bouton pendant la soumission
                >
                  {isSubmitting ? "En cours..." : "Confirmer"} {/* Afficher un texte différent pendant la soumission */}
                 
              </Button>
              </Dialog.Footer>
            </Dialog.Panel>
          </Dialog>
          {/* END: Modal Content */}
        </Preview>
              <div className="z-10 flex items-center rigth-3 flex-1  ">
                <ToastContainer position="bottom-left" />
              </div>
      <div className="py-1 mt-1 intro-y box sm:py-1">
        <div className="p-1 mt-1 intro-y box">
          <div className="relative before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
            <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
              {View1 ? (
                <>
                  <Button variant="primary" className="w-10 h-10 rounded-full">
                    1
                  </Button>
                  <div className="ml-3 text-base font-medium lg:w-full lg:mt-3 lg:mx-auto">
                  informations personnelles
                  </div>
                </>
              ) : (
                <>
                  <Button
                    className="w-10 h-10 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                   /*  onClick={() => {
                      SetView1(true);
                      SetView2(false);
                    }} */
                  >
                    1
                  </Button>
                  <div className="ml-3 text-base lg:w-full lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                  informations personnelles
                  </div>
                </>
              )}
            </div>
            <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
              {View2 ? (
                <>
                  <Button variant="primary" className="w-10 h-10 rounded-full">
                    2
                  </Button>
                  <div className="ml-3 text-base font-medium lg:w-full lg:mt-3 lg:mx-auto">
                    Contact
                  </div>
                </>
              ) : (
                <>
                  <Button
                    className="w-10 h-10 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                   /*  onClick={() => {
                      SetView1(false);
                      SetView2(true);

                      return true;
                    }} */
                  >
                    2
                  </Button>
                  <div className="ml-3 text-base  lg:w-full lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                    plus information
                  </div>
                </>
              )}
            </div>
          </div>

          {View1 && (
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Informations Personnelles
              </div>
              <div className="mt-2">
                <FormInline className="flex-col items-start pt-2 mt-2 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">N° de dossier</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                        *
                      </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="codecustomer"
                      onChange={onChangevalue}
                      type="text"
                      placeholder="N° de dossier"
                      value={customer?.codecustomer}
                      
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Maladies chroniques</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                        *
                      </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      id="nom"
                      name="raison_sociale"
                      onChange={onChangevalue}
                      value={customer?.raison_sociale}
                      type="text"
                      placeholder="Maladies chroniques"
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Type d'image :</div>
                        
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      id="nom"
                      name="name"
                      onChange={onChangevalue}
                      type="text"
                      placeholder="Type d'image"
                      value={customer.name}
                    />
                  </div>
                </FormInline>
    

 

<FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
  <FormLabel className="xl:w-64 xl:!mr-10">
    <div className="text-left">
      <div className="flex items-center">
        <div className="font-medium">Téléphone :</div>
      </div>
    </div>
  </FormLabel>

  <div className="flex-1 w-full mt-2 xl:mt-0">
    <FormInput
      id="compte"
      name="phone"
      onChange={onChangevalue}
      type="text"
      placeholder="Téléphone"
      value={customer.phone}
    />
  </div>
</FormInline>
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Gouvernant :</div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                  <FormSelect
                              id="gouvernorat"
                              className="block px-4 py-3 text-center mt-1  min-w-full xl:min-w-[350px]"
                              onChange={handleGouvernoratChange}
                              name="gouvernorat"
                              value={NomGouvernerat}
                            >
                              <option value=""> Select Gouvernorat</option>

                              {Gouvernerats.Gouvernorat.map(
                                (item: any, index: any) => (
                                  <option key={index} value={item.Nom}>
                                    {item.Nom}
                                  </option>
                                )
                              )}
                            </FormSelect>
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Ville :</div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                  <FormSelect
                              id="ville"
                              className="block px-4 py-3 text-center mt-1  min-w-full xl:min-w-[350px]"
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                              ) => {
                                address.Ville = e.target.value;
                              }}
                              name="ville"
                            >
                              <option value=""> Select Ville</option>

                              {cities.map((item: any, index: any) => (
                                <option key={index} value={item.value}>
                                  {item.Nom}
                                </option>
                              ))}
                            </FormSelect>
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Adresse :</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                        *
                      </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      id="compte"
                      name="adresse"
                      type="text"
                      placeholder="Adresse"
                      onChange={onChangeInputadresse}
                    />
                  </div>
                </FormInline>
              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">
                <Button
                  variant="secondary"
                  className="w-24"
                  onClick={() => {
                    
              if(currentAdmin?.roles?.name === "Supper_admin"){navigateToCustomer();}
              if(currentAdmin?.roles?.name === "Administration"){navigateToCustomerAdmin();}
              if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToCustomerSousAdmin();}
                  }}
                >
                  Annuler
                </Button>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-26 ml-2"
                 onClick={() => {
                    if (validateRequiredFields()) {
                      SetView1(false);
                      SetView2(true);
                    } else {
                      toast.error("Veuillez remplir tous les champs obligatoires.");
                    }
                  }}
                >
                  suivant
                </Button>
              </div>
            </div>
          )}

          {View2 && (
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Contact
              </div>

              <div className="mt-2">
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Nom :</div>
                        
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      id="compte"
                      name="first_name"
                      onChange={onChangevalue}
                      type="text"
                      placeholder="Nom"
                      value={customer.first_name}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Prénom :</div>
                        
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      id="compte"
                      name="last_name"
                      onChange={onChangevalue}
                      type="text"
                      placeholder="Prénom"
                      value={customer.last_name}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">N° Carte identité :</div>
                        
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="num_carte_identite"
                      onChange={onChangevalue}
                      type="text"
                      value={customer.num_carte_identite}
                      placeholder="N° Carte identité"
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Sexe :</div>
                        
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      id="compte"
                      name="sexe"
                      onChange={onChangevalue}
                      type="text"
                      placeholder="Sexe"
                      value={customer.sexe}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">N° telephone :</div>
                        
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="phone"
                      onChange={onChangevalue}
                      type="text"
                      value={customer.phone}
                      placeholder="N° telephone"
                    />
                  </div>
                </FormInline>

                
              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">
                
              <Button
                  variant="secondary"
                  className="w-24 ml-2"
                  onClick={() => {
                    
              if(currentAdmin?.roles?.name === "Supper_admin"){navigateToCustomer();}
              if(currentAdmin?.roles?.name === "Administration"){navigateToCustomerAdmin();}
              if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToCustomerSousAdmin();}
                  }}
                >
                  Annuler
                </Button>
                
                <Button
                  variant="soft-primary"
                  className="w-24 ml-2"
                  onClick={() => {
                    SetView2(false);
                    SetView1(true);
                  }}
                >
                  précédent
                </Button>

                <Button
                  variant="primary"
                  type="button"
                  className="w-26 ml-2"
                  onClick={() => {
                      setOpen(true);
                  }}
                >
                  Ajouter dossier
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddCustomer;
