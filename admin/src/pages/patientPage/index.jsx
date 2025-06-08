import clsx from "clsx";
import { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormSwitch, FormInput } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetchData } from "../../hooks/useFetchData";
import apiService from "../../api/ApiService.js";

function index() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientStatus, setSelectedStatus] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [successDate, setSuccessDate] = useState(null);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const {
    data: patientResponse,
    loading,
    error,
  } = useFetchData("patient", [successDate], true);

  // Use useEffect to handle the data once it's loaded
  useEffect(() => {
    if (patientResponse && patientResponse.success && patientResponse.data) {
      setFilteredData(patientResponse.data);
    }
  }, [patientResponse]);

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch patients data");
    }
  }, [error]);

  const updatePatientStatus = async (id, status) => {
    try {
      const response = await apiService.put(
        "patient/status",
        id,
        { status: status === "active" ? "inactive" : "active" },
        true
      );

      setFilteredData((prevData) =>
        prevData.map((patient) =>
          patient._id === id
            ? {
                ...patient,
                status: patient.status === "active" ? "inactive" : "active",
              }
            : patient
        )
      );

      toast.success(response.message || "Patient status updated successfully");
      setSuccessDate(Date.now());
    } catch (error) {
      toast.error(
        error.error || "An error occurred while updating patient status"
      );
    }
  };

  const handleStatusChange = (id, status) => {
    setSelectedStatus(status);
    setSelectedPatientId(id);
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedPatientId) {
      updatePatientStatus(selectedPatientId, selectedPatientStatus);
    }
    setConfirmDialogOpen(false);
    setSelectedPatientId(null);
  };

  const cancelStatusChange = () => {
    setConfirmDialogOpen(false);
    setSelectedPatientId(null);
  };

  const searchFilterFunction = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    if (!value) {
      setFilteredData(patientResponse?.data || []);
    } else {
      const filtered = patientResponse?.data.filter(
        (item) =>
          (item.firstName && item.firstName.toLowerCase().includes(value.toLowerCase())) ||
          (item.lastName && item.lastName.toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase())) ||
          (item.phone && item.phone.includes(value))
      );

      if (filtered && filtered.length > 0) {
        setFilteredData(filtered);
      } else {
        setFilteredData([]); // Empty array if no matches
        toast.error("No patients found with that search term");
      }
    }
    // Reset to first page when search changes
    setCurrentPage(0);
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
        <h2 className="mr-auto text-lg font-medium">Liste des patients</h2>
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
              Voulez-vous vraiment modifier le statut de ce patient? <br />
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
                placeholder="Rechercher un patient..."
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
                  paginatedDataNew.map((patient, i) => (
                    <Table.Tr key={patient._id} className="intro-x">
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <p className="font-medium whitespace-nowrap">
                          {i + 1 + currentPage * rowsPerPage}
                        </p>
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {patient.lastName || "------"}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {patient.firstName || "------"}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {patient.phone || "------"}
                      </Table.Td>
                      <Table.Td className="text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {patient.email || "------"}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div
                          className={clsx([
                            "flex items-center justify-center",
                            { "text-success": patient.status === "active" },
                            { "text-danger": patient.status === "inactive" },
                          ])}
                        >
                          <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                          {patient.status === "active" ? "Activé" : "Désactivé"}
                        </div>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                        <div className="flex items-center justify-center">
                          <div
                            id="etat-patient"
                            className="flex items-center text-danger"
                          >
                            <FormSwitch className="flex sm:justify-center">
                              <FormSwitch.Input
                                name="etat"
                                checked={patient.status === "active"}
                                onChange={() =>
                                  handleStatusChange(patient._id, patient.status)
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
                      colSpan="7"
                      className="text-center py-4  border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      Aucun patient trouvé
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 intro-y">
              <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                <span className="text-sm text-slate-500">Afficher</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1 !w-[6rem] text-sm border border-slate-200 rounded focus:outline-none focus:border-primary"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
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
    </>
  );
}

export default index;