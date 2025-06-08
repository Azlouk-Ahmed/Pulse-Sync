import { useAuthContext } from '../hooks/useAuthContext.js';
import { useFetchData } from "../hooks/useFetchData";
import Lucide from "../base-components/Lucide";
import Table from "../base-components/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Exams() {
  const { auth } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredExams, setFilteredExams] = useState([]);

  if (!auth) {
    return (
      <div className="p-4 text-red-500">Something is wrong with authentication</div>
    );
  }

  const { data: exams } = useFetchData(
    auth.user.specialization === "prescripteur" ? "examen/doc" : "rdg/exams",
    [],
    true
  );

  // Filter and paginate data whenever exams data or search term changes
  useEffect(() => {
    if (exams && exams.data) {
      const filtered = exams.data.filter(item => {
        const patientName = `${item.patientId.firstName} ${item.patientId.lastName}`.toLowerCase();
        const doctorName = `Dr. ${item.doctorId.firstName} ${item.doctorId.lastName}`.toLowerCase();
        const centerName = item.center.name.toLowerCase();
        const diagnosis = item.diagnosis ? item.diagnosis.toLowerCase() : '';
        const searchLower = searchTerm.toLowerCase();
        
        return patientName.includes(searchLower) || 
               doctorName.includes(searchLower) || 
               centerName.includes(searchLower) || 
               diagnosis.includes(searchLower);
      });
      setFilteredExams(filtered);
      // Reset to first page when search changes
      if (searchTerm) {
        setCurrentPage(1);
      }
    }
  }, [exams, searchTerm]);

  // Calculate pagination values
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredExams.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredExams.length / rowsPerPage);

  // Page change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Rows per page change handler
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">
          {auth.user.specialization === "prescripteur" ? "Historique des Examens" : "Historique des Examens de vos reports"}
        </h2>
        
        {/* Search Box */}
        <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
          <div className="relative w-56 text-slate-500">
            <input
              type="text"
              className="form-control w-56 box pr-10"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Lucide
              icon="Search"
              className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
            />
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-left" />

      <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible mt-5">
        <Table className="border-spacing-y-[10px] border-separate -mt-2">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="text-center">#</Table.Th>
              <Table.Th className="text-center">Patient</Table.Th>
              <Table.Th className="text-center">Docteur</Table.Th>
              <Table.Th className="text-center">Centre</Table.Th>
              <Table.Th className="text-center">Date</Table.Th>
              <Table.Th className="text-center">Diagnostic</Table.Th>
              <Table.Th className="text-center">Radiologie</Table.Th>
              <Table.Th className="text-center">Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentRecords && currentRecords.length > 0 ? (
              currentRecords.map((item, index) => {
                return (
                  <Table.Tr key={item._id} className="intro-x">
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {indexOfFirstRecord + index + 1}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {item.patientId.firstName} {item.patientId.lastName}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      Dr. {item.doctorId.firstName} {item.doctorId.lastName}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {item.center.name}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {new Date(item.dateExamen).toLocaleString("fr-FR", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {item.diagnosis}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      {item.needsRadiology 
                        ? item.radiologyTypes.join(', ') 
                        : 'Non requis'}
                    </Table.Td>
                    <Table.Td className="text-center sm-min-w-40 bg-white dark:bg-darkmode-600 shadow">
                      <Link to={`/appointments/${auth.user.specialization === "prescripteur" ? item.appointment : item.itemId}`}>
                        <Lucide icon='Eye' />
                      </Link>      
                    </Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td colSpan={9} className="text-center bg-white dark:bg-darkmode-600 shadow py-4">
                  {searchTerm ? 'Aucun examen trouvé pour cette recherche' : 'Aucun examen trouvé'}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredExams.length > 0 && (
        <div className="flex flex-wrap items-center col-span-12 mt-5 intro-y sm:flex-row sm:flex-nowrap">
          <div className="flex w-full sm:w-auto">
            <div className="text-slate-500 mr-2 mt-2">Afficher</div>
            <select 
              className="form-select box w-20" 
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
            <div className="text-slate-500 ml-2 mt-2">entrées</div>
          </div>
          
          <nav className="w-full sm:w-auto sm:ml-auto">
            <ul className="flex w-full pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <a 
                  className="page-link" 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) paginate(currentPage - 1);
                  }}
                >
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </a>
              </li>
              {[...Array(totalPages).keys()].map(number => (
                <li 
                  key={number + 1} 
                  className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                >
                  <a 
                    className="page-link" 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      paginate(number + 1);
                    }}
                  >
                    {number + 1}
                  </a>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a 
                  className="page-link" 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) paginate(currentPage + 1);
                  }}
                >
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}

export default Exams;