import { useState, useEffect } from "react";
import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";
import clsx from "clsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RendezVous({ rdv }) {
  useEffect(() => {
    console.log("RDV data:", rdv);
  }, [rdv]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  const statusConfig = {
    pending: {
      icon: "Clock",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
      tooltip: "En attente de confirmation"
    },
    confirmed: {
      icon: "CheckCircle",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-300",
      tooltip: "Rendez-vous confirmé"
    },
    cancelled: {
      icon: "XCircle",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-300",
      tooltip: "Rendez-vous annulé"
    },
    completed: {
      icon: "CheckSquare",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
      tooltip: "Rendez-vous terminé"
    },
    ongoing: {
      icon: "Play",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      borderColor: "border-purple-300",
      tooltip: "Rendez-vous en cours"
    },
    missed: {
      icon: "AlertCircle",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
      tooltip: "Rendez-vous manqué"
    },
    requested: {
      icon: "MessageCircle",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      borderColor: "border-orange-300",
      tooltip: "Rendez-vous demandé"
    }
  };

  const defaultStatus = {
    icon: "HelpCircle",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-300",
    tooltip: "Statut inconnu"
  };

  const [activeTooltip, setActiveTooltip] = useState(null);

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || defaultStatus;
  };

  // Filter appointments based on search term
  const filteredAppointments = rdv && rdv.length > 0
    ? rdv.filter(item => {
        const searchString = searchTerm.toLowerCase();
        return (
          `${item.patient.firstName} ${item.patient.lastName}`.toLowerCase().includes(searchString) ||
          `${item.doctor.firstName} ${item.doctor.lastName}`.toLowerCase().includes(searchString) ||
          item.center.name.toLowerCase().includes(searchString) ||
          item.status.toLowerCase().includes(searchString)
        );
      })
    : [];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Items per page change handler
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Historique des Rendez-Vouse</h2>
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          {Object.keys(statusConfig).map((status) => (
            <div key={status} className="flex items-center text-xs">
              <span
                className={`w-3 h-3 rounded-full mr-1 ${statusConfig[status]?.bgColor}`}
              ></span>
              {formatStatus(status)}
            </div>
          ))}
        </div>
      </div>

      {/* Search and items per page controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center my-4">
        <div className="w-full sm:w-1/3 mb-3 sm:mb-0">
          <div className="relative">
            <input
              type="text"
              className="form-control pl-10 pr-4 py-2 w-full"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Lucide icon="Search" className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Afficher</span>
          <select
            className="form-select w-20"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span className="text-sm text-gray-600">entrées</span>
        </div>
      </div>

      <ToastContainer position="bottom-left" />

      <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
        <Table className="border-spacing-y-[10px] border-separate -mt-2">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="text-center">#</Table.Th>
              <Table.Th className="text-center">Patient</Table.Th>
              <Table.Th className="text-center">Docteur</Table.Th>
              <Table.Th className="text-center">Centre</Table.Th>
              <Table.Th className="text-center">Date</Table.Th>
              <Table.Th className="text-center">Durée</Table.Th>
              <Table.Th className="text-center">Statut</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                const statusInfo = getStatusConfig(item.status);
                return (
                  <Table.Tr key={item._id} className="intro-x">
                    <Table.Td className="text-center bg-white dark:bg-darkmode-600 shadow">
                      {indexOfFirstItem + index + 1}
                    </Table.Td>
                    <Table.Td className="text-center bg-white dark:bg-darkmode-600 shadow">
                      {item.patient.firstName} {item.patient.lastName}
                    </Table.Td>
                    <Table.Td className="text-center bg-white dark:bg-darkmode-600 shadow">
                      Dr. {item.doctor.firstName} {item.doctor.lastName}
                    </Table.Td>
                    <Table.Td className="text-center bg-white dark:bg-darkmode-600 shadow">
                      {item.center.name}
                    </Table.Td>
                    <Table.Td className="text-center bg-white dark:bg-darkmode-600 shadow">
                      {new Date(item.appointmentDate).toLocaleString("fr-FR", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </Table.Td>
                    <Table.Td className="text-center bg-white dark:bg-darkmode-600 shadow">
                      {item.duration || item.appointmentDuration} min
                    </Table.Td>
                    <Table.Td className="text-center bg-white dark:bg-darkmode-600 shadow">
                      <div className="relative inline-block">
                        <div
                          className={clsx([
                            "flex items-center justify-center px-3 py-1 rounded-full border text-xs font-medium transition-all",
                            statusInfo.bgColor,
                            statusInfo.textColor,
                            statusInfo.borderColor,
                          ])}
                          onMouseEnter={() => setActiveTooltip(item._id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          <Lucide icon={statusInfo.icon} className="w-4 h-4 mr-1" />
                          {formatStatus(item.status)}
                        </div>
                        {activeTooltip === item._id && (
                          <div className="absolute z-10 px-2 py-1 text-xs text-white bg-black rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            {statusInfo.tooltip}
                            <div className="absolute w-2 h-2 bg-black transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                          </div>
                        )}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} className="text-center bg-white dark:bg-darkmode-600 shadow py-4">
                  {rdv && rdv.length > 0 ? "Aucun résultat trouvé" : "Aucun rendez-vous trouvé"}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Pagination controls */}
      {filteredAppointments.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-5">
          <div className="text-sm text-gray-600 mb-3 sm:mb-0">
            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredAppointments.length)} sur {filteredAppointments.length} entrées
          </div>
          <div className="flex items-center">
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-primary border hover:bg-primary hover:text-white"
              }`}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
              // Show limited page numbers with ellipsis for better UX
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    className={`w-8 h-8 flex items-center justify-center rounded-md mx-1 ${
                      currentPage === pageNumber
                        ? "bg-primary text-white"
                        : "bg-white text-primary border hover:bg-primary hover:text-white"
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                (pageNumber === currentPage - 2 && currentPage > 3) ||
                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <div key={pageNumber} className="w-8 h-8 flex items-center justify-center">
                    ...
                  </div>
                );
              }
              return null;
            })}
            
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-primary border hover:bg-primary hover:text-white"
              }`}
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default RendezVous;