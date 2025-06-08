import _ from "lodash";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormSwitch, FormSelect, FormInput } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Table from "../../base-components/Table";
import { Link, useNavigate } from "react-router-dom";
import {
  Preview,
} from "../../base-components/PreviewComponent";
import { Dialog } from "../../base-components/Headless";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetCurrentAdmin } from "../../Services/adminService"; // Importez la fonction du service

function ListMedecin() {
  const [data, setData] = useState([]);
  const [medecinData, setMedecinData] = useState<any>([]);
  const navigate = useNavigate();
  
  const [index, SetIndex] = useState(0);
  const [size, SetSize] = useState(100);
  const [View1Pagination, SetView1Pagination] = useState(true);
  const [View2Pagination, SetView2Pagination] = useState(false);

    const [open, setOpen] = useState(false);
    const handleClose = () => {
      setOpen(false);
    };

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
    

    const getMedecinById = async (id: any) => {
      try {
        await axios
          .get(process.env.DASH_API_URL + "/medecin/" + id)
          .then((response) => {
            setMedecinData(response?.data);
          });
      } catch (error) {}
    };

  const navigateToArticle = () => {
    // 👇️ navigate to /
    navigate("/add-medecin");
  };
  const navigateToAddArticleAdmin = () => {
    // 👇️ navigate to /
    navigate("/admin/add-medecin");
  };
  const navigateToAddArticleSousAdmin = () => {
    // 👇️ navigate to /
    navigate("/sous-admin/add-medecin");
  };
  const getAllMedecin = async () => {
    try {
      await axios
        .get(process.env.DASH_API_URL + "/getallmedecin")
        .then((response) => {
          setData(response?.data);
          setMedecinData(response?.data);
        }); 
    } catch (error: any) {
      if (error) {
        toast.error("Médecins n'existe pas");
      }
    }
  };

  const updateEtat = async (id: any) => {
    try {
        const response = await axios.put(
          process.env.DASH_API_URL + "/etatmedecin/" + id
        );
        toast.success(<b>{response?.data?.result}</b>);
    
        // Mettre à jour l'état local
        setData((prevTax:any) =>
          prevTax.map((t: any) =>
            t._id === id ? { ...t, isActive: !t.isActive } : t
          )
        );
      } catch (error: any) {
        toast.error(<b>Erreur lors de la mise à jour de l'état</b>);
      }
    };
    
    // Gérer le changement du switch
    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>, id: any) => {
      await updateEtat(id); // Mettre à jour l'état via l'API
      getAllMedecin();
    };

  
  useEffect(() => {
    getAllMedecin();
    const interval = setInterval(() => {
      getAllMedecin();
    }, 60000);
    return () => clearInterval(interval);
  }, [index, size]);

  const onChangeSelectpagination = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    SetSize(parseInt(value));
  };

  const handleClickpaginate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const element = event.target as HTMLButtonElement;

    SetIndex(parseInt(element.value));
  };
  
  
  
  const filterBySpecialite = (param: string) => {
    if (!param) {
      setData(medecinData);
    } else {
      let array = data.filter(
        (item: any, i: any) => item?.specialite.indexOf(param) > -1
      );

      if (array.length > 0) {
        setData(array);
        return array;
      } else {
        toast.error(<b>Specialite n'existe pas</b>);
      }
    }
  };

  

  const searchFilterFunction = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "specialite") {
      filterBySpecialite(value);
    }
  };
  return (
    <>
    <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Liste des Médecins</h2>

        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
        <Button variant="primary" className="mr-2 shadow-md" onClick={() => {
          if(currentAdmin?.roles?.name === "Supper_admin"){navigateToArticle();}
          if(currentAdmin?.roles?.name === "Administration"){navigateToAddArticleAdmin();}
          if(currentAdmin?.roles?.name === "Sous-Admin"){navigateToAddArticleSousAdmin();}
        }}>
            Ajouter Médecin
          </Button>
        </div>
      </div>
      
      <Preview>
          {/* BEGIN: Modal Content */}
          <Dialog
            open={open}
            onClose={handleClose}
          >
            <Dialog.Panel className="my-[10%] mx-auto">
              <Dialog.Description className="grid grid-cols-1 gap-4 gap-y-3">
              {medecinData?.picture === '/picture/medecins/' ? (
 <img
      alt="medecin"
      className="items-center text-center"
      src="/image/valise.avif"
    />
) : medecinData?.picture?.startsWith('/picture/medecins/') ? (
<img
      alt="medecin"
      className="items-center text-center"
      src={process.env.DASH_API_URL + medecinData?.picture}
    />
) : null}
              </Dialog.Description>
              <Dialog.Footer>
                <Button
                variant="secondary"
                className="w-24"
                onClick={handleClose}
              >
                Fermer
              </Button>
              </Dialog.Footer>
            </Dialog.Panel>
          </Dialog>
          {/* END: Modal Content */}
        </Preview>
      <ToastContainer position="bottom-left" /> 
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
  <form
    id="tabulator-html-filter-form"
    className="xl:flex  sm:mr-auto"
    onSubmit={(e) => {
      e.preventDefault();
    }}
  >
    <div className="mt-1 items-center xl:flex sm:flex sm:mr-4">
      <FormInput
        name="specialite"
        type="text"
        className="mt-2 w-full sm:w-full 2xl:w-full xl:w-full  lg:w-full sm:mt-0"
        placeholder="Specialite..."
        onChange={(text) => {
          searchFilterFunction(text);
        }}
      />
    </div>
    
  </form>
</div>
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  N°
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Nom
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Prénom
                </Table.Th>

                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Specialite
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  N° telephone
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  Image
                </Table.Th>
                
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
            {data?.map((r: any, i: any) => (
                <Table.Tr key={r._id} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  {i + 1}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {r?.first_name}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a href="" className="font-medium whitespace-nowrap">
                      {r?.last_name}
                    </a>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  {r?.speciality}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  {r?.phone}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  <div  onClick={() => {
    getMedecinById(r?._id);
    setOpen(true);
  }} className="text-center items-center w-10 h-10 image-fit zoom-in">
    {r?.picture === '/picture/medecin/' ? (
 <img
      alt="medecin"
      className="rounded-full items-center text-center shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
      src="/image/valise.avif"
    />
) : r?.picture?.startsWith('/picture/medecin/') ? (
<img
      alt="medecin"
      className="rounded-full items-center text-center shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
      src={process.env.DASH_API_URL + r?.picture}
    />
) : null}
  </div>
</Table.Td>
                  
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div
                      className={clsx([
                        "flex items-center justify-center",
                        { "text-success": r?.isActive === true },
                        { "text-danger": r?.isActive === false },
                      ])}
                    >
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                      {r?.isActive === true ? "Activé" : "Désactivé"}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                    {currentAdmin?.roles?.name === "Supper_admin" && (
          <Link className="flex items-center mr-3" to={`/update-medecin/${r?._id}`}>
            <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Modifier
          </Link>
        )}
        {currentAdmin?.roles?.name === "Administration" && (
          <Link className="flex items-center mr-3" to={`/admin/update-medecin/${r?._id}`}>
            <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Modifier
          </Link>
        )}
        {currentAdmin?.roles?.name === "Sous-Admin" && (
          <Link className="flex items-center mr-3" to={`/sous-admin/update-medecin/${r?._id}`}>
            <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Modifier
          </Link>
        )}
                      <FormSwitch className="flex  sm:justify-center">
                                                <FormSwitch.Input
                                                  // onClick={toggle}
                                                  name="etat"
                                                  checked={r?.isActive}
                                                  onChange={(e: any) => {
                                                    handleChange(e, r?._id);
                                                  }}
                                                  className="ml-3 mr-2 "
                                                  type="checkbox"
                                                />
                                              </FormSwitch>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Data List */}
        
        <div className="flex flex-wrap items-center mt-3 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            {View1Pagination && (
              <>
                <Pagination.Link>
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </Pagination.Link>

                <Pagination.Link>
                  <button value={1} onClick={handleClickpaginate}>
                    1
                  </button>
                </Pagination.Link>
                <Pagination.Link>
                  <button value={2} onClick={handleClickpaginate}>
                    2
                  </button>
                </Pagination.Link>
                <Pagination.Link>
                  <button value={3} onClick={handleClickpaginate}>
                    3
                  </button>
                </Pagination.Link>

                <Pagination.Link>
                  <Lucide
                    icon="ChevronRight"
                    className="w-4 h-4"
                    onClick={() => {
                      SetView1Pagination(false);
                      SetView2Pagination(true);
                      SetIndex(4);
                    }}
                  />
                </Pagination.Link>
              </>
            )}

            {View2Pagination && (
              <>
                <Pagination.Link>
                  <Lucide
                    icon="ChevronLeft"
                    className="w-4 h-4"
                    onClick={() => {
                      SetView1Pagination(true);
                      SetView2Pagination(false);
                    }}
                  />
                </Pagination.Link>

                <Pagination.Link>
                  <button value={4} onClick={handleClickpaginate}>
                    4
                  </button>
                </Pagination.Link>
                <Pagination.Link>
                  <button value={5} onClick={handleClickpaginate}>
                    5
                  </button>
                </Pagination.Link>
                <Pagination.Link>
                  <button value={6} onClick={handleClickpaginate}>
                    6
                  </button>
                </Pagination.Link>

                <Pagination.Link>
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </Pagination.Link>
              </>
            )}
          </Pagination>
          <FormSelect
            className="w-20 mt-3 !box sm:mt-0"
            onChange={onChangeSelectpagination}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </FormSelect>
        </div>
    </>
  );
}

export default ListMedecin;
