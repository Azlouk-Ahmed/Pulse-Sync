import clsx from "clsx";
import { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormSwitch, FormInput,FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetchData } from "../../hooks/useFetchData";
import apiService from '../../api/ApiService.js';
import { PiMicroscope, PiPulse } from "react-icons/pi";
import { useAuthContext } from '../../hooks/useAuthContext.js';




function DoctorsList() {
  const {auth} = useAuthContext();
  if(!auth) {
    return (
      <div>something is wrong</div>
    )
  }
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorStatus, setSelectedStatus] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [successDate, setSuccessDate] = useState(null);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: doctorResponse, loading, error } = useFetchData(auth.user.role === "superAdmin"? "doctor" : "doctor/staff",[successDate],true);
  const { data: centerResponse, loading:l, error:e } = useFetchData("center");

  // New form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    center: "",
    specialization: "",
    experience: "",
    contactNumber: "",
    desc: "No description provided"
  });

  // Selected display states
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use useEffect to handle the data once it's loaded
  useEffect(() => {
    if (doctorResponse && doctorResponse.success && doctorResponse.data) {
      setFilteredData(doctorResponse.data);
    }
  }, [doctorResponse]);

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch doctors data");
    }
  }, [error]);

  const updateDoctorStatus = async (id,status) => {
    try {

      const response = await apiService.put("doctor/status",id, {status: status === "active" ? "inactive" : "active"}, true);

      setFilteredData(prevData => 
        prevData.map(doctor => 
          doctor._id === id 
            ? { ...doctor, status: doctor.status === "active" ? "inactive" : "active" } 
            : doctor
        )
      );
      
      toast.success(response.message || "Doctor status updated successfully");
    } catch (error) {
      toast.error(error.error ||"An error occurred while updating doctor status");
    }
  };

  const handleStatusChange = (id,status) => {
    setSelectedStatus(status)
    setSelectedDoctorId(id);
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedDoctorId) {
      updateDoctorStatus(selectedDoctorId, selectedDoctorStatus);
    }
    setConfirmDialogOpen(false);
    setSelectedDoctorId(null);
  };

  const cancelStatusChange = () => {
    setConfirmDialogOpen(false);
    setSelectedDoctorId(null);
  };

  const searchFilterFunction = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    if (!value) {
      setFilteredData(doctorResponse?.data || []);
    } else {
      const filtered = doctorResponse?.data.filter(
        (item) =>
          item.firstName.toLowerCase().includes(value.toLowerCase()) ||
          item.lastName.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.specialization.toLowerCase().includes(value.toLowerCase()) ||
          (item.contactNumber && item.contactNumber.includes(value))
      );

      if (filtered && filtered.length > 0) {
        setFilteredData(filtered);
      } else {
        setFilteredData([]); // Empty array if no matches
        toast.error("No doctors found with that search term");
      }
    }
    // Reset to first page when search changes
    setCurrentPage(0);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle center selection
  const handleCenterSelect = (centerId, centerName) => {
    setFormData(prev => ({
      ...prev,
      center: centerId
    }));
    setSelectedCenter(centerName);
  };

  // Handle specialization selection
  const handleSpecializationSelect = (value, name) => {
    setFormData(prev => ({
      ...prev,
      specialization: value
    }));
    setSelectedSpecialization(name);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      center: "",
      specialization: "",
      experience: "",
      contactNumber: "",
      desc: "No description provided"
    });
    setSelectedCenter(null);
    setSelectedSpecialization(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || 
        !formData.center || !formData.specialization || !formData.experience || !formData.contactNumber) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.post("doctor", formData, true,false);

      console.log("consolas", response)
      
      // Update the doctor list with new data
      if (response.success) {
        toast.success("Médecin ajouté avec succès");
        
        // Add the new doctor to the list if response includes the doctor object
        if (response.data) {
          setFilteredData(prevData => [response.data, ...prevData]);
        }

        setSuccessDate(Date.now())

        
        resetForm();
        setIsOpen(false);
      } else {
        toast.error(response.message || "Échec de l'ajout du médecin");
      }
    } catch (error) {
      toast.error(error.error || "Une erreur s'est produite lors de l'ajout du médecin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate pagination
  const startIndex = index * size;
  const endIndex = Math.min(startIndex + size, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndexPagination = currentPage * rowsPerPage;
  const endIndexPagination = Math.min(startIndexPagination + rowsPerPage, filteredData.length);
  const paginatedDataNew = filteredData.slice(startIndexPagination, endIndexPagination);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0); // Reset to first page
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Liste des médecins</h2>

        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
            <Button
              variant="primary"
              className="mr-2 shadow-md"
              onClick={() => setIsOpen(true)}
            >
              Ajouter Médecine
            </Button>
        </div>
      </div>

      <ToastContainer position="bottom-left" />

      {/* Confirmation Dialog */}
       <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="AlertTriangle"
              className="w-16 h-16 mx-auto mt-3 text-warning"
            />
            <div className="mt-5 text-3xl">Êtes-vous sûr?</div>
            <div className="mt-2 text-slate-500">
              Voulez-vous vraiment modifier le statut de ce médecin? <br />
              Ce processus ne peut pas être annulé.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={cancelStatusChange}
              className="w-24 mr-1"
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              onClick={confirmStatusChange}
            >
              Confirmer
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
     

      {/* Data List */}
      <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
          <form
            id="tabulator-html-filter-form"
            className="xl:flex sm:mr-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="mt-1 items-center xl:flex sm:flex sm:mr-4">
              <FormInput
                type="text"
                className="mt-2 w-full sm:w-full 2xl:w-full xl:w-full lg:w-full sm:mt-0"
                placeholder="Rechercher un médecin..."
                value={searchTerm}
                onChange={searchFilterFunction}
              />
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-lg font-medium">
                Chargement des données...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center text-danger">
              <div className="text-lg font-medium">
                Erreur lors du chargement des données
              </div>
              <div>Veuillez réessayer plus tard</div>
            </div>
          </div>
        ) : (
          <>
            <Table className="border-spacing-y-[10px] border-separate -mt-2">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-0 whitespace-nowrap">N°</Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Nom
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Prénom
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Spécialisation
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Centre Médical
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Gouvernorat
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Téléphone
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Email
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Status
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    ACTIONS
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedDataNew.length > 0 ? (
                  paginatedDataNew.map((doctor, i) => (
                    <Table.Tr key={doctor._id} className="intro-x">
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <p className="font-medium whitespace-nowrap">
                          {i + 1 + currentPage * rowsPerPage}
                        </p>
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {doctor.lastName || "------"}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {doctor.firstName || "------"}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {doctor.specialization}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {doctor.center?.name || "------"}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {doctor.center?.governorate || "------"}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {doctor.contactNumber || "------"}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {doctor.email || "------"}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div
                          className={clsx([
                            "flex items-center justify-center",
                            { "text-success": doctor.status === "active" },
                            { "text-danger": doctor.status === "inactive" },
                          ])}
                        >
                          <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                          {doctor.status === "active" ? "Activé" : "Désactivé"}
                        </div>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                        <div className="flex items-center justify-center">
                          <div
                            id="etat-doctor"
                            className="flex items-center text-danger"
                          >
                            <FormSwitch className="flex sm:justify-center">
                              <FormSwitch.Input
                                name="etat"
                                checked={doctor.status === "active"}
                                onChange={() =>
                                  handleStatusChange(doctor._id, doctor.status)
                                }
                                className="ml-3 mr-2"
                                type="checkbox"
                              />
                            </FormSwitch>
                          </div>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td
                      colSpan={10}
                      className="text-center py-4 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      Aucun médecin trouvé
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 intro-y">
              <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                <span className="text-sm text-slate-500">Afficher</span>
                <FormSelect
                  value={rowsPerPage}
                  onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                  className="px-3 !w-[6rem] py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </FormSelect>
                <span className="text-sm text-slate-500">entrées</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">
                  Affichage de {startIndexPagination + 1} à {endIndexPagination} sur {filteredData.length} entrées
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1"
                >
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </Button>
                
                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i ? "primary" : "outline-secondary"}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                      className="px-3 py-1 min-w-[2rem]"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1"
                >
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

 

      {/* Add Doctor Dialog - Enhanced with state management */}

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
              Ajouter un médecin
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
              <label className="block">Mot de passe</label>
              <FormInput 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block">Centre Médical</label>
              {centerResponse && centerResponse.data && (
                <Menu>
                  <Button variant="secondary" className="w-full flex justify-between items-center">
                    <Menu.Button as="div" className="w-full text-left">
                      {selectedCenter || "Sélectionner un centre"}
                    </Menu.Button>
                    <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                  </Button>
                  <Menu.Items placement="top-start">
                    {centerResponse.data.map((center) => (
                      <Menu.Item 
                        key={center._id} 
                        onClick={() => handleCenterSelect(center._id, center.name)}
                      >
                        <div className="flex gap-5 items-center">
                          <div className="w-10 h-10 rounded-md overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src={`${import.meta.env.VITE_UPLOADS_DIR || ""}${
                                center.img
                              }`}
                              alt={center.name}
                            />
                          </div>
                          <div className="text-base text-slate-500">
                            {center.name}
                          </div>
                        </div>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              )}
            </div>
            <div>
              <label className="block">Spécialisation</label>
              <Menu>
                <Button variant="secondary" className="w-full flex justify-between items-center">
                  <Menu.Button as="div" className="w-full text-left">
                    {selectedSpecialization || "Sélectionner une spécialisation"}
                  </Menu.Button>
                  <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                </Button>
                <Menu.Items placement="top-start">
                  <Menu.Item onClick={() => handleSpecializationSelect("prescripteur", "Prescripteur")}>
                    <div className="flex gap-5 items-center">
                      <PiPulse />
                      <div className="text-base text-slate-500">
                        Prescripteur
                      </div>
                    </div>
                  </Menu.Item>
                  <Menu.Item onClick={() => handleSpecializationSelect("radiologue", "Radiologue")}>
                    <div className="flex gap-5 items-center">
                      <PiMicroscope size={15}/>
                      <div className="text-base text-slate-500">
                        Radiologue
                      </div>
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
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
                  "Ajouter"
                )}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
     
    </>
  );
}

export default DoctorsList;