import { useState } from "react";
import { FormInput } from "../../base-components/Form";
import Button from "../../base-components/Button";
import "react-toastify/dist/ReactToastify.css";

function AddDoc() {

    const [formData, setFormData] = useState({
        name: "",
        governorate: "",
        address: "",
        phone: "",
        email: "",
        openTime: "",
        closingTime: "",
      });
  return (
    <div>
        <h5 className="mt-10">abc</h5>

        <form

      className="w-full max-w-xl mx-auto p-6 bg-white rounded-md shadow-md dark:bg-darkmode-600"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Add New Center</h2>
      {[
        { name: "name", label: "Name" },
        { name: "governorate", label: "Governorate" },
        { name: "address", label: "Address" },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email (optional)" },
        { name: "openTime", label: "Open Time" },
        { name: "closingTime", label: "Closing Time" },
      ].map(({ name, label }) => (
        <FormInput
          key={name}
          type="text"
          name={name}
          value={(formData as any)[name]}
          placeholder={label}
          className="block px-4 py-3 mt-4 w-full"
        />
      ))}

 
      <Button type="submit" variant="primary" className="mt-6 w-full">
        Add Center
      </Button>
    </form>

    </div>
  )
}

export default AddDoc