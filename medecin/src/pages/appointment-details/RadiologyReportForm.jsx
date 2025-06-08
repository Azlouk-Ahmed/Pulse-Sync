import React, { useState } from 'react';
import { Menu, Dialog } from "../../base-components/Headless";
import apiService from "../../api/ApiService.js";
import { FormTextarea } from '../../base-components/Form';
import Button from '../../base-components/Button';

function RadiologyReportForm({ isFormOpen, setIsFormOpen, doctor, patient, examen, appointment }) {
  const [images, setImages] = useState([{ url: '', description: '', file: null }]);
  const [notes, setNotes] = useState('');
  
  console.log("Form props:", { doctor, patient, examen, appointment });
  
  const handleAddImage = () => {
    setImages([...images, { url: '', description: '', file: null }]);
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const handleImageChange = (index, field, value) => {
    const newImages = [...images];
    newImages[index][field] = value;
    setImages(newImages);
  };
  
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      const newImages = [...images];
      newImages[index] = {
        ...newImages[index],
        url: tempUrl,
        file: file // Store the actual file object for upload
      };
      setImages(newImages);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!doctor || !patient || !examen || !appointment) {
      console.error("Missing required fields:", { doctor, patient, examen, appointment });
      alert("Missing required information. Please ensure doctor, patient, exam, and appointment details are provided.");
      return;
    }

    const formData = new FormData();
    formData.append('notes', notes);
    formData.append('examen', examen);
    formData.append('patient', patient);
    formData.append('radiologist', doctor);
    formData.append('appointment', appointment);

    // Only append images that have files
    images.forEach((image, index) => {
      if (image.file) {
        formData.append('images', image.file);
        formData.append('descriptions[]', image.description || '');
      }
    });

    for (let [key, value] of formData.entries()) {
  if (value instanceof File) {
    console.log(`${key}: [File] name=${value.name}, type=${value.type}, size=${value.size} bytes`);
  } else {
    console.log(`${key}: ${value}`);
  }
}


    try {
      const response = await apiService.post("rdg", formData, true, true);
      console.log('Upload success:', response);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Upload failed:', err);
      alert(`Failed to submit report: ${err.message || 'Unknown error'}`);
    }
  };
  
  return (
    <Dialog
      open={isFormOpen}
      onClose={() => setIsFormOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 overflow-y-auto radio flex min-h-full items-center justify-center p-4">
        <Dialog.Panel className="!w-10/12 max-w-3xl transform overflow-y-scroll max-h-[90%] rounded-2xl box p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title
            as="h3"
            className="text-xl font-medium leading-6 -900 mb-4 border-b pb-2"
          >
            New Radiology Report
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display status field */}
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium -700">
                  Images
                </label>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddImage}
                >
                  Add Image
                </Button>
              </div>
              
              {images.map((image, index) => (
                <div key={index} className="border intro-x rounded-lg p-4">
                  <div className=" flex flex-col gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                      <label className="block text-sm font-medium ">
                        Image Upload
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="mt-1 block w-full text-sm 
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                         file:text-primary
                       "
                      />
 <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remove
                      </Button>
                        </div>
                      
                      {image.url && (
                        <div className="mt-2">
                          <img 
                            src={image.url} 
                            alt="Preview" 
                            className="h-32 w-auto object-contain rounded border"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium ">
                        Image Description
                      </label>
                      <FormTextarea
                        value={image.description}
                        onChange={(e) => handleImageChange(index, 'description', e.target.value)}
                        rows={4}
                        placeholder="Describe the image find..."
                      />
                      
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium ">
                Additional Notes
              </label>
              <FormTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Enter any additional notes about the examination..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                onClick={() => setIsFormOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Save Report
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default RadiologyReportForm;