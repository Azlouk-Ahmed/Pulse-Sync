import React, { useState } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import Lucide from "../../base-components/Lucide/index.tsx";
import { Dialog } from "../../base-components/Headless";

function RadiologyReport({ exam }) {
    const { data } = useFetchData(`rdg/abc/${exam}`, [], true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    
    if (!data || !data.data) {
        return (
            <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-lg my-6">
                <h3 className="text-warning font-medium mb-2 flex items-center gap-5">
                    <Lucide icon="Clock" />
                    Radiology Required
                </h3>
                <div className="flex flex-wrap gap-2">
                    Still waiting for the radiology exam
                </div>
            </div>
        );
    }

    const { examen, patient, radiologist, images, notes } = data.data;

    const openImageDialog = (image) => {
        setSelectedImage(image);
        setIsImageDialogOpen(true);
    };

    return (
        <div className="grid grid-cols-12 gap-6 mt-5">
            {/* Image Dialog */}
            <Dialog
                open={isImageDialogOpen}
                onClose={() => setIsImageDialogOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 overflow-y-auto flex min-h-full items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900 mb-4"
                        >
                            Radiology Image
                        </Dialog.Title>
                        
                        {selectedImage && (
                            <div className="space-y-4">
                                <div className="bg-gray-100 rounded-lg overflow-hidden">
                                    <img 
                                        src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${selectedImage.url}`}
                                        alt="Radiology image"
                                        className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {selectedImage.description}
                                    </p>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                        onClick={() => setIsImageDialogOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Main Card */}
            <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
                <div className="box p-5 mb-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-200/60">
                        <div>
                            <h2 className="text-lg font-medium">Radiology Report</h2>
                            <div className="text-slate-500 mt-1">
                                Exam Date: {new Date(examen.dateExamen).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="mt-3 md:mt-0">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {examen.radiologyTypes.join(', ')}
                            </span>
                        </div>
                    </div>

                    {/* Patient Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Patient Information</h3>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                                    <Lucide icon="User" className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">
                                        {patient.firstName} {patient.lastName}
                                    </div>
                                    <div className="text-slate-500 text-xs">
                                        {patient.sex}, {patient.age} years
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Referring Doctor</h3>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                                    <Lucide icon="User" className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">
                                        {examen.doctorId.firstName} {examen.doctorId.lastName}
                                    </div>
                                    <div className="text-slate-500 text-xs">
                                        {examen.doctorId.specialization}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Radiology Images */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-500 mb-3">Radiology Images</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {images.map((image, index) => (
                                <div 
                                    key={index} 
                                    className="border rounded-md overflow-hidden group cursor-pointer"
                                    onClick={() => openImageDialog(image)}
                                >
                                    <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                                        <img 
                                            src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${image.url}`}
                                            alt={`Radiology image ${index + 1}`} 
                                            className="object-cover rounded-lg w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Lucide icon="Eye" className="text-white w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="p-2 text-xs truncate" title={image.description}>
                                        {image.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Radiologist Notes */}
                    <div className='box'>
                        <h3 className="text-sm font-medium text-slate-500 mb-2">Radiologist Notes</h3>
                        <div className="box p-4 rounded-md whitespace-pre-line">
                            {notes || "No notes provided"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                <div className="box p-5">
                    <h3 className="text-sm font-medium text-slate-500 mb-4">Radiologist Details</h3>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                            <img 
                                src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${radiologist.img}`}
                                alt={`${radiologist.firstName} ${radiologist.lastName}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="font-medium text-lg">
                            {radiologist.firstName} {radiologist.lastName}
                        </div>
                        <div className="text-slate-500 text-sm mb-2">
                            {radiologist.specialization}
                        </div>
                        <div className="text-xs text-slate-400 mb-4">
                            {radiologist.experence} years of experience
                        </div>
                        <div className="w-full border-t border-slate-200/60 pt-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Contact:</span>
                                <span>{radiologist.contactNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Email:</span>
                                <span className="truncate max-w-[150px]">{radiologist.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box p-5 mt-5">
                    <h3 className="text-sm font-medium text-slate-500 mb-4">Generalist Details</h3>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                            <img 
                                src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${examen.doctorId.img}`}
                                alt={`${examen.doctorId.firstName} ${examen.doctorId.lastName}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="font-medium text-lg">
                            {examen.doctorId.firstName} {examen.doctorId.lastName}
                        </div>
                        <div className="text-slate-500 text-sm mb-2">
                            {examen.doctorId.specialization}
                        </div>
                        <div className="text-xs text-slate-400 mb-4">
                            {examen.doctorId.experence} years of experience
                        </div>
                        <div className="w-full border-t border-slate-200/60 pt-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Contact:</span>
                                <span>{examen.doctorId.contactNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Email:</span>
                                <span className="truncate max-w-[150px]">{examen.doctorId.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RadiologyReport;