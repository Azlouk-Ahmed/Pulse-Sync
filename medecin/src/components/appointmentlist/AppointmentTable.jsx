import { useState, useEffect } from "react";
import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";
import {FormSelect, FormInput} from "../../base-components/Form";
import clsx from "clsx";
import { Link } from "react-router-dom";
import _ from "lodash";

function AppointmentTable({appointments}) {
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

  // Fallback icon and style for unknown statuses
  const defaultStatus = {
    icon: "HelpCircle",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-300",
    tooltip: "Statut inconnu"
  };

  const [activeTooltip, setActiveTooltip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);

  // Initialize filtered data when appointments change
  useEffect(() => {
    if (appointments && appointments.data) {
      setFilteredData(appointments.data);
    }
  }, [appointments]);

  // Handle search functionality
  useEffect(() => {
    if (appointments && appointments.data) {
      const filtered = appointments.data.filter(
        (item) =>
          item.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to first page when search changes
    }
  }, [searchTerm, appointments]);

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Safe getter for status config - returns defaultStatus if the status doesn't exist
  const getStatusConfig = (status) => {
    return statusConfig[status] || defaultStatus;
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Historique des Rendez-Vous</h2>
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

      {/* Search and Pagination Size Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-5">
        <div className="relative w-full sm:w-56 mb-2 sm:mb-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lucide icon="Search" className="w-4 h-4 text-gray-500" />
          </div>
          <FormInput
            type="text"
            className="!pl-10 w-full"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center ">
          <span className="mr-2 text-sm">Afficher</span>
          <FormSelect
            className=""
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when page size changes
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </FormSelect>
          <span className="ml-2 text-sm min-w-[90px]">par page</span>
        </div>
      </div>

      <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible mt-5">
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
              <Table.Th className="text-center">Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                const statusInfo = getStatusConfig(item.status);
                return (
                  <Table.Tr key={item._id} className="intro-x">
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {indexOfFirstItem + index + 1}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {item.patient.firstName} {item.patient.lastName}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      Dr. {item.doctor.firstName} {item.doctor.lastName}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {item.center.name}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {new Date(item.appointmentDate).toLocaleString("fr-FR", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {item.duration || item.appointmentDuration} min
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
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
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      <Link to={`/appointments/${item._id}`}>
                        <Lucide icon="Eye" className="w-4 h-4 cursor-pointer" />
                      </Link>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8} className="text-center bg-white dark:bg-darkmode-600 shadow py-4">
                  Aucun rendez-vous trouvé
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-5">
          <div className="text-sm text-gray-600 mb-2 sm:mb-0">
            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredData.length)} sur {filteredData.length} rendez-vous
          </div>
          <div className="flex items-center justify-center space-x-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show current page and 1 page before and after (if they exist)
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                (pageNumber === currentPage - 2 && pageNumber > 1) ||
                (pageNumber === currentPage + 2 && pageNumber < totalPages)
              ) {
                // Show ellipsis
                return (
                  <span key={pageNumber} className="w-8 h-8 flex items-center justify-center">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AppointmentTable;