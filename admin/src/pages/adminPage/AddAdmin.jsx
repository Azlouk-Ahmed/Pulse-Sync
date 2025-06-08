import Button from "../../base-components/Button";
import { useState } from "react";

import Lucide from "../../base-components/Lucide";

import { useNavigate } from "react-router-dom";

import { FormInput, FormInline, FormSelect, FormLabel } from "../../base-components/Form";
import {
    Preview,
} from "../../base-components/PreviewComponent";
import { Dialog } from "../../base-components/Headless";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetchData } from "../../../../patient/src/hooks/useFetchData";

function AddAdmin() {
  const [View1, SetView1] = useState(true);
  const [View2, SetView2] = useState(false);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const navigateToAdmins = () => {
    navigate("/admins");
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [admin, setAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sex: "male",
    age: "",
    phone: "",
    password: "",
    role: "admin",
    status: "active",
    center: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");
 


  const { data: centers, loading, error } = useFetchData("center");

  const validateEmail = (email) => {
    if (email === null || email.trim() === "") {
      return true; // Accept empty or null
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onChangeValue = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric fields
    if ((name === 'age' || name === 'phone') && !/^\d*$/.test(value)) {
      toast.error(`Le champ ${name === 'age' ? "âge" : "téléphone"} doit contenir uniquement des chiffres.`);
      return;
    }
    
    setAdmin({ ...admin, [name]: value });
  };

  const onChangePasswordConfirm = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addAdmin = async (e) => {
    // Validate email format
    if (!validateEmail(admin.email)) {
      toast.error("Le format de l'e-mail est invalide.");
      return;
    }
    
    // Check if passwords match
    if (admin.password !== passwordConfirm) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    // Disable button
    setIsSubmitting(true);
    
    try {
      await axios
        .post(process.env.DASH_API_URL + "/addadmin", {
          ...admin,
        })
        .then((response) => {
          setTimeout(() => {
            toast.success("Administrateur ajouté avec succès");
          }, 150);
          setTimeout(() => {
            navigateToAdmins();
          }, 3000);
        });
    } catch (error) {
      if (error) {
        toast.error(<b>{error?.response?.data?.message}</b>);
      }
    } finally {
      // Re-enable button after submission
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
      }, 2000);
    }
  };

  const validateRequiredFields = () => {
    const requiredFields = [
      admin.firstName,
      admin.lastName,
      admin.email,
      admin.age,
      admin.phone,
      admin.password,
      passwordConfirm,
    ];

    console.log("Required Fields:", requiredFields); // Debugging line
  
    return requiredFields.every(field => String(field).trim() !== "");
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium intro-y">Ajouter Administrateur</h2>
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
                Ajouter Administrateur
              </h2>
            </Dialog.Title>
            <Dialog.Description className="grid grid-cols-1 gap-4 gap-y-3">
              <div className="p-2 border rounded-md border-slate-200/60 dark:border-darkmode-400 ">
                <div className="flex items-center pb-1 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                  <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Vous êtes
                  sûr de création Nouvel administrateur ...!
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
                onClick={(e) => {
                  addAdmin(e);
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "En cours..." : "Confirmer"}
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
        {/* END: Modal Content */}
      </Preview>
      
      <div className="z-10 flex items-center rigth-3 flex-1">
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
                    Informations personnelles
                  </div>
                </>
              ) : (
                <>
                  <Button
                    className="w-10 h-10 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                  >
                    1
                  </Button>
                  <div className="ml-3 text-base lg:w-full lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                    Informations personnelles
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
                    Authentification
                  </div>
                </>
              ) : (
                <>
                  <Button
                    className="w-10 h-10 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                  >
                    2
                  </Button>
                  <div className="ml-3 text-base lg:w-full lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                    Authentification
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
                        <div className="font-medium">Prénom</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="firstName"
                      onChange={onChangeValue}
                      type="text"
                      placeholder="Prénom"
                      value={admin.firstName}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Nom</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="lastName"
                      onChange={onChangeValue}
                      value={admin.lastName}
                      type="text"
                      placeholder="Nom"
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Email</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="email"
                      onChange={onChangeValue}
                      type="email"
                      placeholder="Email"
                      value={admin.email}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Sexe</div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormSelect
                      name="sex"
                      onChange={onChangeValue}
                      value={admin.sex}
                    >
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </FormSelect>
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
                      onChange={onChangeValue}
                      type="text"
                      placeholder="Âge"
                      value={admin.age}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Téléphone</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="phone"
                      onChange={onChangeValue}
                      type="text"
                      placeholder="Téléphone"
                      value={admin.phone}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Centre</div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    {centers &&<FormSelect
                      name="center"
                      onChange={onChangeValue}
                      value={admin.center}
                    >
                      <option value="">Sélectionnez un centre</option>
                      {centers?.data.map((center) => (
                        <option key={center._id} value={center._id}>
                          {center.name}
                        </option>
                      ))}
                    </FormSelect>}
                  </div>
                </FormInline>
              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">
                <Button
                  variant="secondary"
                  className="w-24"
                  onClick={navigateToAdmins}
                >
                  Annuler
                </Button>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-26 ml-2"
                  onClick={() => {
                
                      SetView1(false);
                      SetView2(true);
                    
                  }}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {View2 && (
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Authentification
              </div>

              <div className="mt-2">
                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Rôle</div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormSelect
                      name="role"
                      onChange={onChangeValue}
                      value={admin.role}
                    >
                      <option value="admin">Admin</option>
                      <option value="superAdmin">Super Admin</option>
                    </FormSelect>
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Mot de passe</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="password"
                      onChange={onChangeValue}
                      type="password"
                      placeholder="Mot de passe"
                      value={admin.password}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Confirmer le mot de passe</div>
                        <div className="px-2 py-0.5 text-red-600 dark:bg-darkmode-300 dark:text-red-400 text-lg">
                          *
                        </div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormInput
                      name="passwordConfirm"
                      onChange={onChangePasswordConfirm}
                      type="password"
                      placeholder="Confirmer le mot de passe"
                      value={passwordConfirm}
                    />
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-1 mt-1 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Statut</div>
                      </div>
                    </div>
                  </FormLabel>

                  <div className="flex-1 w-full mt-2 xl:mt-0">
                    <FormSelect
                      name="status"
                      onChange={onChangeValue}
                      value={admin.status}
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </FormSelect>
                  </div>
                </FormInline>
              </div>
              <div className="flex items-center justify-between col-span-12 mt-5 intro-y sm:justify-end">
                <Button
                  variant="secondary"
                  className="w-24 ml-2"
                  onClick={navigateToAdmins}
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
                  Précédent
                </Button>

                <Button
                  variant="primary"
                  type="button"
                  className="w-26 ml-2"
                  onClick={() => {
                    if (admin.password !== passwordConfirm) {
                      toast.error("Les mots de passe ne correspondent pas.");
                    } else {
                      setOpen(true);
                    }
                  }}
                >
                  Ajouter admin
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddAdmin;