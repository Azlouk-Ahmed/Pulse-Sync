import Button from "../../base-components/Button";
import React, { useState, MouseEvent, useEffect } from "react";

import Lucide from "../../base-components/Lucide";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FormInput,
  FormInline,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import {
  Preview,
} from "../../base-components/PreviewComponent";
import { Dialog } from "../../base-components/Headless";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetCurrentAdmin } from "../../Services/adminService"; // Importez la fonction du service



const initialState = {
  _id: "",
  first_name:"",
  last_name:"",
  Date:"",
  Sexe:"",
  Adresse:"",
  phone:"",
};

function FeedPatient() {
  const navigate = useNavigate(); 
  const [patient, setPatient] = useState(initialState);
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  
  
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

  const FeedPatient =  async () => {
    try {
      await axios
        .put(`${process.env.DASH_API_URL}/patient/${id}/update-patient` ,{
          ...patient,
        })
        .then((response) => {
          console.log(response?.data);
          toast.success(<b>Patient Modifier avec succès </b>);
        });
       setTimeout(() => {
        if(currentAdmin?.roles?.name === "Supper_admin"){navigatetoPatient();}
        if(currentAdmin?.roles?.name === "Administration"){navigatetoPatientAdmin();}
          }, 3000);
    } catch (error) {}
  };
  const getpatientById = async () => {
    try {
      await axios
        .get(process.env.DASH_API_URL + "/patient/" + id)
        .then((response) => {
          const patientData = response?.data;
          setPatient({
            _id: patientData._id,
            first_name: patientData.first_name,
            last_name: patientData.last_name,
            Date: patientData.Date,
            Sexe: patientData.Sexe,
            Adresse: patientData.Adresse, 
            phone: patientData.phone,
          });
        });
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'article:", error);
    }
  };

  useEffect(() => {
    getpatientById();
  }, []);

  const onChangeInputAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      // Test if the value contains only numbers
      const isNumeric = /^\d*$/.test(value);
     if ((name=== 'phone') &&(!isNumeric)) {
        toast.error('Le phone de patient doit contenir uniquement des chiffres.');
       } else{
        setPatient({ ...patient, [name]: value });
       }
  };

  const navigatetoPatient = () => {
    navigate("/patient");
  };

  const navigatetoPatientAdmin = () => {
    navigate("/admin/patient");
  };
    const [open, setOpen] = useState(false);
    const handleClose = () => {
      setOpen(false);
    };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium intro-y">
          Modifier Patient
        </h2>
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
                  Améliorer de Patient
                </h2>
              </Dialog.Title>
              <Dialog.Description className="grid grid-cols-1 gap-4 gap-y-3">
                <div className="p-2 border rounded-md border-slate-200/60 dark:border-darkmode-400 ">
                  <div className="flex items-center pb-1 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                    <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Vous êtes
                    sûr d'ameliorer Patient ...!
                  </div>
    
                </div>
              </Dialog.Description>
              <Dialog.Footer>
                <Button
                variant="secondary"
                className="w-24"
                onClick={() => {
                  if(currentAdmin?.roles?.name === "Supper_admin"){navigatetoPatient();}
                  if(currentAdmin?.roles?.name === "Administration"){navigatetoPatientAdmin();}
                 }}>
                Annuler
              </Button>

              <Button
                variant="primary"
                className="w-24 ml-2"
                onClick={() => {
                  FeedPatient();
                }}
              >
                Modifier
              </Button>
              </Dialog.Footer>
            </Dialog.Panel>
          </Dialog>
          {/* END: Modal Content */}
        </Preview>

      {/* BEGIN: Wizard Layout */}
      <div className="z-10 flex items-center rigth-3 flex-1  ">
      <ToastContainer position="bottom-left" />
      </div>
      <div className="py-10 mt-5 intro-y box sm:py-8">
        <div className="p-5 mt-1 intro-y box">
          <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
            <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
              <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> information
              de Patient
            </div>
            <div className="mt-5">



<FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
  <FormLabel className="xl:w-64 xl:!mr-10">
    <div className="text-left">
      <div className="flex items-center">
        <div className="font-medium">Nom</div>
      </div>
    </div>
  </FormLabel>

  <div className="flex-1 w-full mt-3 xl:mt-0">
    <FormInput
       id="first_name"
       name="first_name"
       onChange={onChangeInputAdd}
       type="text"
       placeholder="Nom"
       value={patient.first_name}
       disabled
    />
  </div>
</FormInline>
<FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
  <FormLabel className="xl:w-64 xl:!mr-10">
    <div className="text-left">
      <div className="flex items-center">
        <div className="font-medium">Prénom</div>
      </div>
    </div>
  </FormLabel>

  <div className="flex-1 w-full mt-3 xl:mt-0">
    <FormInput
       id="last_name"
       name="last_name"
       onChange={onChangeInputAdd}
       type="text"
       placeholder="Prénom"
       value={patient.last_name}
       disabled
    />
  </div>
</FormInline>
<FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
  <FormLabel className="xl:w-64 xl:!mr-10">
    <div className="text-left">
      <div className="flex items-center">
        <div className="font-medium">Date de naissance</div>
      </div>
    </div>
  </FormLabel>

  <div className="flex-1 w-full mt-3 xl:mt-0">
    <FormInput
       id="Date"
       name="Date"
       onChange={onChangeInputAdd}
       type="text"
       placeholder="Date"
       value={patient.Date}
       disabled
    />
  </div>
</FormInline>
<FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
  <FormLabel className="xl:w-64 xl:!mr-10">
    <div className="text-left">
      <div className="flex items-center">
        <div className="font-medium">Sexe</div>
      </div>
    </div>
  </FormLabel>

  <div className="flex-1 w-full mt-3 xl:mt-0">
    <FormInput
       id="Sexe"
       name="Sexe"
       onChange={onChangeInputAdd}
       type="text"
       placeholder="Sexe"
       value={patient.Sexe}
       disabled
    />
  </div>
</FormInline>

              <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                <FormLabel className="xl:w-64 xl:!mr-10">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-medium">Adresse</div>
                    </div>
                  </div>
                </FormLabel>

                <div className="flex-1 w-full mt-3 xl:mt-0">
                  <FormInput
                   id="Adresse"
                   name="Adresse"
                   onChange={onChangeInputAdd}
                   type="text"
                   placeholder="Saisir La adresse"
                   value={patient.Adresse}
                  />
                </div>
              </FormInline>

              <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                <FormLabel className="xl:w-64 xl:!mr-10">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-medium">Téléphone</div>
                    </div>
                  </div>
                </FormLabel>

                <div className="flex-1 w-full mt-3 xl:mt-0">
                  <FormInput
                    id="phone"
                    name="phone"
                    onChange={onChangeInputAdd}
                    type="text"
                    placeholder="Saisir numero de telephone"
                    value={patient.phone}
                    disabled
                  />
                </div>
              </FormInline>

            </div>
            <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">
              <Button
                variant="secondary"
                className="w-24"
                onClick={() => {
                  if(currentAdmin?.roles?.name === "Supper_admin"){navigatetoPatient();}
                  if(currentAdmin?.roles?.name === "Administration"){navigatetoPatientAdmin();}
                 }}
              >
                Annuler
              </Button>

              <Button
                variant="primary"
                type="submit"
                className="w-26 ml-2"
                onClick={() => {
                  setOpen(true)
                }}
              >
                Modifier Patient
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* END: Wizard Layout */}
    </>
  );
}

export default FeedPatient;
