import Lucide from "../../base-components/Lucide";
import {FormSwitch } from "../../base-components/Form";

import { useEffect, useState } from "react";

import Table from "../../base-components/Table";
import clsx from "clsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Roles() {
  const [data, setData] = useState([]);

  const getAllRole = async () => {
    try {
      await axios.get(process.env.DASH_API_URL + "/getallrole")
      .then((response) => {
        setData(response?.data);
        
      });
    } catch (error: any) {
          if (error) {
            toast.error("Roles n'existe pas");
          }
        }
  };

  const updateEtat = async (id: any) => {
    try {
      const response = await axios
        .put(process.env.DASH_API_URL + "/etatrole/" + id)
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
    getAllRole();
  };

  useEffect(() => {
    getAllRole();
  }, []);
  
  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium"> Roles</h2>
      </div>
     <ToastContainer position="bottom-left" />
      {/* BEGIN: HTML Table Data */}
              <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
                <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead className="th">
              <Table.Tr>
                <Table.Th className=" c text-center border-b-2 whitespace-nowrap">
                  N°
                </Table.Th>
                <Table.Th className="c text-center border-b-2 whitespace-nowrap">
                  Role
                </Table.Th>
                <Table.Th className="c text-center border-b-2 whitespace-nowrap">
                  Status
                </Table.Th>
                <Table.Th className="c text-center border-b-2 whitespace-nowrap">
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.map((r: any, i: any) => (
                <Table.Tr key={r._id} className="intro-x">
                  <Table.Td
                    data-label="Id"
                    className="c text-center first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                  >
                    <p className=" font-medium whitespace-nowrap">
                      {i + 1}
                    </p>
                  </Table.Td>
                  <Table.Td
                    data-label="Nom"
                    className="c first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                  >
                    {r?.name}
                  </Table.Td>
                  <Table.Td
                    data-label="Bloque"
                    className="c first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                  >
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
                  <Table.Td className="c first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                      <div
                        id="etat-role"
                        className="flex items-center text-danger"
                      >
                        <FormSwitch className="flex  sm:justify-center">
                          <FormSwitch.Input
                            // onClick={toggle}
                            name="isActive"
                            checked={r?.isActive}
                            onChange={(e: any) => {
                              handleChange(e, r?._id);
                            }}
                            className="ml-3 mr-0 "
                            type="checkbox"
                          />
                        </FormSwitch>
                      </div>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      {/* END: HTML Table Data */}
    </>
  );
}

export default Roles;
