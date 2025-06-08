import React from "react";
import Button from "../../base-components/Button";
import { useState, MouseEvent, useEffect } from "react";

import Lucide from "../../base-components/Lucide";

import { useNavigate, useParams } from "react-router-dom";

import {
  FormInput,
  FormInline,
  FormSelect,
  FormLabel,
  FormHelp,
} from "../../base-components/Form";
import {
  Preview,
} from "../../base-components/PreviewComponent";
import { Dialog } from "../../base-components/Headless";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetCurrentAdmin } from "../../Services/adminService";

function AddRendezVous() {
  const [currentAdmin, setCurrentAdmin] = useState<any>([]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminData = await GetCurrentAdmin();
        setCurrentAdmin(adminData);
      } catch (error) {
        console.error("Erreur dans le composant", error);
      }
    };

    fetchAdmin();
  }, []);

  const [view1, setView1] = useState(true);
  const [view2, setView2] = useState(false);
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();

  const navigateToRendezVous = () => navigate("/rendezvous");
  const navigateToRendezVousAdmin = () => navigate("/admin/rendezvous");
  const navigateToRendezVousSousAdmin = () => navigate("/sous-admin/rendezvous");
  
  const getRendezVousById = async () => {
    try {
      const response = await axios.get(process.env.DASH_API_URL + `/rendezvous/addrendezvous/${id}`);
      const rendezvousData = response.data;

      setAddRendezVous({
        num_folder: rendezvousData.num_folder,
        name_patient: rendezvousData.name_patient,
        age: rendezvousData.age.toString(), // Convertir en string pour l'input
        name_medecin: rendezvousData.name_medecin,
        speciality: rendezvousData.speciality,
        date: rendezvousData.date.split('T')[0], // Extraire la date seule
        temps: formatTime(rendezvousData.temps), // Formater l'heure
        Maladie: rendezvousData.Maladie,
        booked_time: rendezvousData.booked_time
      });

      setIsEditMode(true);
    } catch (error: any) {
      if (error) {
        toast.error("RendezVous n'existe pas");
      }
    }
  };

  // Fonction pour formater l'heure
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const time = new Date(timeString);
    return time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  useEffect(() => {
    if (id) {
      getRendezVousById();
    }
  }, [id]);

  const [addRendezVous, setAddRendezVous] = useState({
    num_folder: "",
    name_patient: "",
    age: "",
    name_medecin: "",
    speciality: "",
    date: "",
    temps: "",
    Maladie: "",
    booked_time: new Date().toISOString() // Valeur par défaut
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddRendezVous({ ...addRendezVous, [name]: value });
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddRendezVous({ ...addRendezVous, [name]: value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const AjouterSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      

      if (isEditMode) {
        await axios.put(
          process.env.DASH_API_URL + `/update-rendezvous/${id}`,
          { ...addRendezVous },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        toast.success(<b>RendezVous mise à jour avec succès</b>);
    
        setTimeout(() => {
          setOpen(false);
          if(currentAdmin?.roles?.name === "Supper_admin") navigateToRendezVous();
          if(currentAdmin?.roles?.name === "Administration") navigateToRendezVousAdmin();
          if(currentAdmin?.roles?.name === "Sous-Admin") navigateToRendezVousSousAdmin();
        }, 1500);
      } else {
        // Validation des champs obligatoires
        if(!addRendezVous.num_folder) {
          toast.error("Le numéro est obligatoire");
          return;
        }
        if(!addRendezVous.name_patient) {
          toast.error("Le nom de patient est obligatoire");
          return;
        }
        if(!addRendezVous.age) {
          toast.error("L'âge est obligatoire");
          return;
        }
        if(!addRendezVous.name_medecin) {
          toast.error("Le nom du médecin est obligatoire");
          return;
        }

        await axios.post(
          process.env.DASH_API_URL + "/rendezvous/addrendezvous",
          {...addRendezVous},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        toast.success("Nouvelle RendezVous Ajoutée avec succès");
    
        setTimeout(() => {
          setOpen(false);
          if(currentAdmin?.roles?.name === "Supper_admin") navigateToRendezVous();
          if(currentAdmin?.roles?.name === "Administration") navigateToRendezVousAdmin();
          if(currentAdmin?.roles?.name === "Sous-Admin") navigateToRendezVousSousAdmin();
        }, 1500);
      }
    } catch (error: any) {
      if (error) {
        toast.error(<b>{error?.response?.data?.message}</b>);
      }
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
      }, 2000);
    }
  };

  const renderStepButton = (step: any, label: any, activeView: any, setActiveView: any) => (
    activeView ? (
      <>
        <Button variant="primary" className="w-10 h-10 rounded-full">{step}</Button>
        <div className="ml-3 text-base font-medium lg:w-32 lg:mt-3 lg:mx-auto">{label}</div>
      </>
    ) : (
      <>
        <Button
          className="w-10 h-10 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
          onClick={() => {
            setActiveView(true);
            setView1(step === 1);
            setView2(step === 2);
          }}
        >
          {step}
        </Button>
        <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
          {label}
        </div>
      </>
    )
  );

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const validateRequiredFields_1 = () => {
    const requiredFields = [
      addRendezVous.num_folder,
      addRendezVous.name_patient,
      addRendezVous.age,
      addRendezVous.name_medecin,
    ];
  
    return requiredFields.every(field => field.trim() !== "");
  };

  const validateRequiredFields_2 = () => {
    const requiredFields = [
      addRendezVous.speciality,
      addRendezVous.date,
      addRendezVous.temps,
      addRendezVous.Maladie,
    ];
  
    return requiredFields.every(field => field.trim() !== "");
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium intro-y">{isEditMode ? "Modifier RendezVous" : "Ajouter RendezVous"}</h2>
      </div>

      <Preview>
        <Dialog open={open} onClose={handleClose}>
          <Dialog.Panel className="my-[10%] mx-auto">
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">
                {isEditMode ? "Modifier RendezVous" : "Ajouter RendezVous"}
              </h2>
            </Dialog.Title>
            <Dialog.Description className="grid grid-cols-1 gap-4 gap-y-3">
              <div className="p-2 border rounded-md border-slate-200/60 dark:border-darkmode-400 ">
                <div className="flex items-center pb-1 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                  <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Vous êtes
                  sûr {isEditMode ? "de modifier RendezVous" : "d'ajouter RendezVous"}...!
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
                onClick={(e: any) => AjouterSubmit(e)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "En cours..." : "Confirmer"}
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      </Preview>

      <div className="z-10 flex items-center rigth-3 flex-1">
        <ToastContainer position="bottom-left" />
      </div>

      <div className="py-1 mt-1 intro-y box sm:py-1">
        <div className="p-1 mt-1 intro-y box">
          <div className="relative before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
            <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
              {renderStepButton(1, "Les informations", view1, setView1)}
            </div>
            <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
              {renderStepButton(2, "Plus les informations", view2, setView2)}
            </div>
          </div>
          
          {view1 && (
            <div className="p-5 mt-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" />
                Les informations de Rendez Vous
              </div>
              <div className="mt-2">
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">N°</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      id="num_folder"
                      name="num_folder"
                      onChange={onChangeInput}
                      type="text"
                      placeholder="N° Dossier"
                      value={addRendezVous.num_folder}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Nom du patient</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="name_patient"
                      onChange={onChangeInput}
                      value={addRendezVous.name_patient}
                      type="text"
                      placeholder="Nom du patient"
                    />
                  </div>
                </FormInline>
 
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Âge</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="age"
                      onChange={onChangeInput}
                      value={addRendezVous.age}
                      type="number"
                      placeholder="Âge"
                      min="0"
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Nom du médecin</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="name_medecin"
                      onChange={onChangeInput}
                      value={addRendezVous.name_medecin}
                      type="text"
                      placeholder="Nom du médecin"
                    />
                  </div>
                </FormInline>
              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">
                <Button
                  variant="secondary"
                  className="w-24"
                  onClick={() => {
                    if(currentAdmin?.roles?.name === "Supper_admin") navigateToRendezVous();
                    if(currentAdmin?.roles?.name === "Administration") navigateToRendezVousAdmin();
                    if(currentAdmin?.roles?.name === "Sous-Admin") navigateToRendezVousSousAdmin();
                  }}
                >
                  Annuler
                </Button>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-26 ml-2"
                  onClick={() => {
                    if (validateRequiredFields_1()) {
                      setView1(false);
                      setView2(true);
                    } else {
                      toast.error("Veuillez remplir tous les champs marqués d'un * sont obligatoires.");
                    }
                  }}
                >
                  suivant
                </Button>
              </div>
            </div>
          )}

          {view2 && (
            <div className="p-5 mt-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Plus les informations de Rendez Vous
              </div>

              <div className="mt-2">
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Spécialité</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormSelect
                      onChange={onChangeSelect}
                      name="speciality"
                      value={addRendezVous?.speciality}
                    >
                      <option value="">Sélectionner une spécialité</option>
                      <option value="Cardiologie">Cardiologie</option>
                      <option value="Radiologie">Radiologie</option>
                      <option value="Scanner">Scanner</option>
                    </FormSelect>
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Date</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="date"
                      onChange={onChangeInput}
                      type="date"
                      value={addRendezVous.date}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Temps</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="temps"
                      onChange={onChangeInput}
                      type="time"
                      value={addRendezVous.temps}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Maladie</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="Maladie"
                      onChange={onChangeInput}
                      type="text"
                      placeholder="Maladie"
                      value={addRendezVous.Maladie}
                    />
                  </div>
                </FormInline>
              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">
                <Button
                  variant="secondary"
                  className="w-24 ml-2"
                  onClick={() => {
                    if(currentAdmin?.roles?.name === "Supper_admin") navigateToRendezVous();
                    if(currentAdmin?.roles?.name === "Administration") navigateToRendezVousAdmin();
                    if(currentAdmin?.roles?.name === "Sous-Admin") navigateToRendezVousSousAdmin();
                  }}
                >
                  Annuler
                </Button>
                
                <Button
                  variant="soft-primary"
                  className="w-24 ml-2"
                  onClick={() => {
                    setView1(true);
                    setView2(false);
                  }}
                >
                  précédent
                </Button>

                <Button
                  variant="primary"
                  type="button"
                  className="w-26 ml-2"
                  onClick={() => { 
                    if (validateRequiredFields_2()) {
                      setOpen(true);
                    } else {
                      toast.error("Veuillez remplir tous les champs marqués d'un * sont obligatoires.");
                    }
                  }}
                >
                  {isEditMode ? "Modifier " : "Ajouter "} RendezVous
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddRendezVous;