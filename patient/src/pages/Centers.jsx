import { useState } from 'react';
import Center from "../components/center/Center";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useFetchData } from '../hooks/useFetchData';

const governorates = [
  "Tunis", "Ariana", "Ben Arous", "Manouba",
  "Nabeul", "Zaghouan", "Bizerte", "Beja",
  "Jendouba", "Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan",
  "Kasserine", "Sidi Bouzid", "Gabes", "Medenine",
  "Tataouine", "Gafsa", "Tozeur", "Kebili"
];

function Centers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const {data,loading,error} = useFetchData('/center');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGovernorateChange = (event) => {
    setSelectedGovernorate(event.target.value);
  };

  const filteredGovernorates = governorates.filter((gov) => {
    const matchesSearch = gov.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGovernorate = selectedGovernorate ? gov === selectedGovernorate : true;
    return matchesSearch && matchesGovernorate;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Search + Select */}
      <div className="flex items-center gap-5 justify-between">
        {/* Search Input */}
        <div className="field flex input-field items-center w-1/3 bg-white h-10">
          <i className="fa-solid fa-magnifying-glass w-10 text-center"></i>
          <input
            type="text"
            className="!border-0 w-full"
            placeholder="Search for center name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Select Dropdown */}
        <FormControl className='bg-white' sx={{ width: 300 }}>
          <InputLabel id="governorate-select-label" >Governorate</InputLabel>
          <Select
            labelId="governorate-select-label"
            id="governorate-select"
            value={selectedGovernorate}
            label="Governorate"
            onChange={handleGovernorateChange}
          >
            <MenuItem value="">All Governorates</MenuItem> {/* Allow reset */}
            {governorates.map((gov) => (
              <MenuItem key={gov} value={gov}>
                {gov}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="btn">
            search
        </div>
      </div>

      {/* Centers List */}
      <div className="flex flex-wrap gap-y-10 justify-between px-5">
        {data && data.data.length>0 && data.data.map((center) => (
          <Center key={center.id} data={center} />
        ))}
        {data && data.data.length === 0 && <p>No centers found.</p>}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        </div>
    </div>
  );
}

export default Centers;
