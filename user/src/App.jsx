/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button } from "@mui/material"; // ✅ Missing imports
import axios from "axios";
import { useEffect, useState } from "react";

import Section1BusinessInfo from "./components/BusinessForm/Step1";
import Section2OwnerInfo from "./components/BusinessForm/Step2";
import Section3AddressInfo from "./components/BusinessForm/Step3";
import Section4TaxInfo from "./components/BusinessForm/Step4";
import Section5RentalOwnership from "./components/BusinessForm/Step5";
import Section6BusinessDetails from "./components/BusinessForm/Step6";
import Section7EmployeesVehicles from "./components/BusinessForm/Step7";
import Section8FileUploads from "./components/BusinessForm/Step8";

function App() {
  const API = import.meta.env.VITE_API_BASE;

  // --- Text & Select Inputs ---
  const [formDataState, setFormDataState] = useState({
    BusinessType: "",
    dscRegNo: "",
    businessName: "",
    tinNo: "",
    TradeName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    extName: "",
    sex: "",
    eMailAdd: "",
    telNo: "",
    mobileNo: "",
    region: "",
    province: "",
    cityOrMunicipality: "",
    barangay: "",
    addressLine1: "",
    zipCode: "",
    pinAddress: "",
    totalFloorArea: "",
    numberOfEmployee: "",
    maleEmployee: "",
    femaleEmployee: "",
    numVehicleVan: "",
    numVehicleTruck: "",
    numVehicleMotor: "",
    numNozzle: "",
    weighScale: "",
    Taxregion: "",
    Taxprovince: "",
    TaxcityOrMunicipality: "",
    Taxbarangay: "",
    TaxaddressLine1: "",
    TaxzipCode: "",
    TaxpinAddress: "",
    ownPlace: "",
    taxdec: "",
    lessorName: "",
    monthlyRent: "",
    tIGE: "",
    officeType: "",
    officeTypeOther: "",
    lineOfBusiness: "",
    productService: "",
    Units: "",
    capital: "",
  });

  // --- Files ---
  const [filesState, setFilesState] = useState({
    proofOfReg: null,
    proofOfRightToUseLoc: null,
    locationPlan: null,
    brgyClearance: null,
    marketClearance: null,
    occupancyPermit: null,
    cedula: null,
    photoOfBusinessEstInt: null,
    photoOfBusinessEstExt: null,
    tIGEfiles: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // --- Fetch Uploaded Files ---
  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API}/api/files`);
      setUploadedFiles(res.data);
    } catch (err) {
      console.error("Error fetching files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // --- Handle Text Inputs ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle File Inputs ---
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFilesState((prev) => ({ ...prev, [name]: files[0] }));
  };

  // --- Handle Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append text/select values
    Object.keys(formDataState).forEach((key) => {
      formData.append(key, formDataState[key]);
    });

    // Append files
    Object.keys(filesState).forEach((key) => {
      if (filesState[key]) formData.append(key, filesState[key]);
    });

    try {
      await axios.post(`${API}/api/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted!");
      fetchFiles(); // ✅ refresh after submit
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  };

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        {/* ✅ Pass correct state + handler */}
        <Section1BusinessInfo
          formData={formDataState}
          handleChange={handleChange}
        />
        <Section2OwnerInfo
          formData={formDataState}
          handleChange={handleChange}
        />
        <Section3AddressInfo
          formData={formDataState}
          handleChange={handleChange}
        />
        <Section4TaxInfo formData={formDataState} handleChange={handleChange} />
        <Section5RentalOwnership
          formData={formDataState}
          handleChange={handleChange}
        />
        <Section6BusinessDetails
          formData={formDataState}
          handleChange={handleChange}
        />
        <Section7EmployeesVehicles
          formData={formDataState}
          handleChange={handleChange}
        />
        <Section8FileUploads handleFileChange={handleFileChange} />

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Submit
        </Button>
      </Box>

      <hr />

      <h2>Uploaded Applications</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Uploaded At</th>
            <th>Files</th>
          </tr>
        </thead>
        <tbody>
          {uploadedFiles.map((file) => (
            <tr key={file.id}>
              <td>{file.id}</td>
              <td>{file.status}</td>
              <td>{new Date(file.createdAt).toLocaleString()}</td>
              <td>
                {Object.keys(filesState).map((key) =>
                  file[`${key}_filename`] ? (
                    <div key={key}>
                      <a
                        href={`${API}/api/files/${file.id}/${key}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file[`${key}_filename`]}
                      </a>{" "}
                      (
                      <a
                        href={`${API}/api/files/${file.id}/${key}/download`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        download
                      </a>
                      )
                    </div>
                  ) : null
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
