import { FC, useState, FormEvent, ChangeEvent } from "react";
import { FormInput } from "../../base-components/Form";
import Button from "../../base-components/Button";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCenterForm: FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    governorate: "",
    address: "",
    phone: "",
    email: "",
    openTime: "",
    closingTime: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    if (image) {
      payload.append("img", image);
    }

    try {
      await axios.post("/api/center", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Center created successfully!");
      setFormData({
        name: "",
        governorate: "",
        address: "",
        phone: "",
        email: "",
        openTime: "",
        closingTime: "",
      });
      setImage(null);
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Something went wrong.";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
          onChange={handleChange}
          placeholder={label}
          className="block px-4 py-3 mt-4 w-full"
        />
      ))}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block px-4 py-3 mt-4 w-full border rounded-md text-sm text-slate-700 dark:bg-darkmode-500 dark:text-slate-200"
      />

      <Button type="submit" variant="primary" className="mt-6 w-full">
        Add Center
      </Button>
    </form>
  );
};

export default AddCenterForm;
