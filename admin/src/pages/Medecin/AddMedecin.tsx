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
import { GetCurrentAdmin } from "../../Services/adminService"; // Importez la fonction du service


function AddMedecin() {
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

  const [view1, setView1] = useState(true);
  const [view2, setView2] = useState(false);
  const [view3, setView3] = useState(false);
  const { id } = useParams(); // Récupérer l'ID de l'employé à modifier depuis l'URL
  const [isEditMode, setIsEditMode] = useState(false); // Pour savoir si on est en mode édition

  const navigate = useNavigate();

  const navigateToMedecin = () => {
    // 👇️ navigate to /
    navigate("/medecin");
  };
  const navigateToMedecinAdmin = () => {
    // 👇️ navigate to /
    navigate("/admin/medecin");
  };
  const navigateToMedecinSousAdmin = () => {
    // 👇️ navigate to /
    navigate("/sous-admin/medecin");
  };
  
    const getMedecinById = async () => {
      try {
        const response = await axios.get(process.env.DASH_API_URL + `/medecin/${id}`);
        const medecinData = response.data;
  
        // Mettre à jour l'état avec les données de l'medecin
        setAddMedecin({
            num_folder:medecinData.num_folder,
            first_name:medecinData.first_name,
            phone:medecinData.phone,
            last_name:medecinData.last_name,
            speciality:medecinData.speciality,
            picture:medecinData.picture,
        });
  
        setIsEditMode(true); // Passer en mode édition
        setViewImage(true); // Afficher l'image si elle existe
      } catch (error: any) {
        if (error) {
          toast.error("Médecin n'existe pas");
        }
      }
    };
    useEffect(()=>{
        if (id) {
            getMedecinById(); // Si un ID est présent dans l'URL, récupérer les données de l'employé
          }
        }, [id]);

  const [addMedecin, setAddMedecin] = useState({
    num_folder:"",
    first_name:"",
    phone:"",
    last_name:"",
    speciality:"",
    picture:"",
    })

  const [viewImage, setViewImage] = useState(false);

const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
 setAddMedecin({ ...addMedecin, [name]: value });
 
};

const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  setAddMedecin({ ...addMedecin, [name]: value });
};

//update Company settings

const [file, setFile] = useState<File>();

const onChangeInputFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setFile(e.target.files[0]);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const result = await fetch(process.env.DASH_API_URL + "/picture_medecin", {
      method: "POST",
      body: formData,
    });
    const data = await result.json();

    addMedecin.picture = data?.result?.filename;
    setAddMedecin({ ...addMedecin });

    setViewImage(true);
  }
};
const handleUploadClick = async () => {
  if (!file) {
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const result = await fetch(process.env.DASH_API_URL + "/picture_medecin", {
    method: "POST",
    body: formData,
  });
  const data = await result.json();

  toast.success(<b>{data.message} </b>);

  addMedecin.picture = data?.result?.filename;
};
const [isSubmitting, setIsSubmitting] = useState(false);

// Soumettre l'ajout de la taxe
const AjouterSubmit = async (e: MouseEvent) => {
  e.preventDefault();
 // Vérifier si le formulaire est déjà en cours de soumission
 if (isSubmitting) {
  return;
}
// Désactiver le bouton
setIsSubmitting(true);
  try {
    if (isEditMode) {
      await axios.put(
        process.env.DASH_API_URL + `/update-medecin/${id}`,
        { ...addMedecin },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Afficher un message de succès
      toast.success(
        <b>
           Médecin mise à jour avec succès
        </b>
      );
  
      // Fermer la modal après un court délai
      setTimeout(() => {
        setOpen(false); // Fermer la modal
        if(currentAdmin?.roles?.name === "Supper_admin"){navigateToMedecin();}
        if(currentAdmin?.roles?.name === "Administration"){navigateToMedecinAdmin();}
        if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToMedecinSousAdmin();}
      }, 1500); // Délai de 1,5 seconde avant la navigation
      
    } else {
      if(addMedecin.num_folder === ""){
        toast.error(
          "Le Réference est Obligatoire"
      );
      }
      if(addMedecin.first_name === ""){
        toast.error(
          "Le Désignation est Obligatoire"
      );
      }
      await axios.post(
        process.env.DASH_API_URL + "/addmedecin",
        { ...addMedecin },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Afficher un message de succès
      toast.success(
          "Nouvelle Médecin Ajoutée avec succès"
      );
  
      // Fermer la modal après un court délai
      setTimeout(() => {
        setOpen(false); // Fermer la modal
        
        if(currentAdmin?.roles?.name === "Supper_admin"){navigateToMedecin();}
        if(currentAdmin?.roles?.name === "Administration"){navigateToMedecinAdmin();}
        if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToMedecinSousAdmin();}
      }, 1500); // Délai de 1,5 seconde avant la navigation
    }
  
  }catch (error: any) {
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
            setView3(step === 3);
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
      // Convertir les valeurs en chaînes de caractères si nécessaire
      const requiredFields = [
        addMedecin.num_folder.toString(), // Assurez-vous que c'est une chaîne
        addMedecin.first_name.toString(), // Assurez-vous que c'est une chaîne
        addMedecin.last_name.toString(), // Assurez-vous que c'est une chaîne
      ];
    
      // Vérifier si tous les champs obligatoires de base sont remplis
      const areBasicFieldsValid = requiredFields.every(field => field.trim() !== "");
    
      // Sinon, retourner simplement la validation des champs de base
      return areBasicFieldsValid;
    };
    const validateRequiredFields_2 = () => {
      // Convertir les valeurs en chaînes de caractères si nécessaire
      const requiredFields = [
        addMedecin.phone.toString(), // Assurez-vous que c'est une chaîne
        addMedecin.speciality.toString(), // Assurez-vous que c'est une chaîne
      ];
    
      // Vérifier si tous les champs obligatoires de base sont remplis
      const areBasicFieldsValid = requiredFields.every(field => field.trim() !== "");
    
      // Sinon, retourner simplement la validation des champs de base
      return areBasicFieldsValid;
    };
  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium intro-y">{isEditMode ? "Modifier Médecin" : "Ajouter Médecin"}</h2>
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
                {isEditMode ? "Modifier Médecin" : "Ajouter Médecin"}
                </h2>
              </Dialog.Title>
              <Dialog.Description className="grid grid-cols-1 gap-4 gap-y-3">
                <div className="p-2 border rounded-md border-slate-200/60 dark:border-darkmode-400 ">
                  <div className="flex items-center pb-1 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                    <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Vous êtes
                    sûr {isEditMode ? "de modifier Médecin" : "d'ajouter Médecin"}...!
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
                  AjouterSubmit(e);
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
              {renderStepButton(1, "Les informations", view1, setView1)}

            </div>
            <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
              {renderStepButton(2, "N° de telephone", view2, setView2)}

            </div>
            <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
              {renderStepButton(3, "Photo de profil", view3, setView3)}

            </div>
          </div>
          {view1 && (
            <div className="p-5 mt-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" />{" "}
                information de Médecin
              </div>
              <div className="mt-2">
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">N° Dossier</div>
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
                      value={addMedecin.num_folder}
                    />


                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">
                          Nom
                        </div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                        *
                      </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="first_name"
                      onChange={onChangeInput}
                      value={addMedecin.first_name}
                      type="text"
                      placeholder="Nom"
                    />
                  </div>
                </FormInline>
 
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">
                          Prénom
                        </div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                        *
                      </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="last_name"
                      onChange={onChangeInput}
                      value={addMedecin.last_name}
                      type="text"
                      placeholder="Prénom"
                    />
                  </div>
                </FormInline>



              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">
                <Button
                  variant="secondary"
                  className="w-24"
                  onClick={() => {
                    if(currentAdmin?.roles?.name === "Supper_admin"){navigateToMedecin();}
                    if(currentAdmin?.roles?.name === "Administration"){navigateToMedecinAdmin();}
                    if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToMedecinSousAdmin();}
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
                      setView3(false);
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
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> N° de telephone
              </div>

              <div className="mt-2">

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">N° telephone</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                        *
                      </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="phone"
                      onChange={onChangeInput}
                      type="text"
                      placeholder="N° telephone"
                      value={addMedecin.phone}
                    />
                  </div>
                </FormInline>

<FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
  <FormLabel className="xl:w-64 xl:!mr-10">
    <div className="text-left">
      <div className="flex items-center">
        <div className="font-medium">Specialite</div>
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
    value={addMedecin?.speciality}
    >
      <option value="Specialite">Specialite</option>
      <option value="Cardiologie">Cardiologie</option>
      <option value="Radiologie">Radiologie</option>
      <option value="Scanner">Scanner</option>

    </FormSelect>
  </div>
</FormInline>


                

              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">

<Button
  variant="secondary"
  className="w-24 ml-2"
  onClick={() => {
    if(currentAdmin?.roles?.name === "Supper_admin"){navigateToMedecin();}
        if(currentAdmin?.roles?.name === "Administration"){navigateToMedecinAdmin();}
        if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToMedecinSousAdmin();}
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
                    setView3(false);
                  }}
                >
                  précédent
                </Button>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-26 ml-2"
                  onClick={() => {
                    if (validateRequiredFields_2()) {
                      setView1(false);
                      setView2(false);
                      setView3(true);
                    }  else {
                        toast.error("Veuillez remplir tous les champs marqués d'un * sont obligatoires.");
                      
                    }
                  }}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {view3 && (
            <div className="p-5 mt-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Photo de profil
              </div>

              <div className="mt-2">
                

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Image</div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                  <div className="flex flex-col w-full items-center justify-center xl:justify-end pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                      {viewImage && (
                        <img
                          className="rounded-xl"
                          alt="image diaporama"
                          src={isEditMode ? 
                            process.env.DASH_API_URL + addMedecin?.picture 
                            : process.env.DASH_API_URL +
                            "/picture/medein/" +
                            addMedecin?.picture }
                        />
                      )}

                      <div className=" flex-1 flex-col  items-center mt-2 xl:flex-col">
                        <FormInput
                          type="file"
                          id="avatar"
                          name="files"
                          className="mt-3 "
                          onChange={onChangeInputFile}
                        />
                      </div>

                      <Button
                        variant="primary"
                        className="w-24 ml-2  mt-3 mb-3"
                        onClick={handleUploadClick}
                      >
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </FormInline>

              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">

<Button
  variant="secondary"
  className="w-24 ml-2"
  onClick={() => {
    if(currentAdmin?.roles?.name === "Supper_admin"){navigateToMedecin();}
        if(currentAdmin?.roles?.name === "Administration"){navigateToMedecinAdmin();}
        if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToMedecinSousAdmin();}
  }}
>
  Annuler
</Button>
                
                <Button
                  variant="soft-primary"
                  className="w-24 ml-2"
                  onClick={() => {
                    setView1(false);
                    setView2(true);
                    setView3(false);
                  }}
                >
                  précédent
                </Button>

                <Button
                  variant="primary"
                  type="button"
                  className="w-26 ml-2"
                  onClick={() => { 
                    setOpen(true)
                  }}
                >
                  {isEditMode ? "Modifier " : "Ajouter "} Médecin
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddMedecin;
