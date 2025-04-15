import React, { useState } from "react";
import "../css/PatientForm.css";

interface PatientFormProps {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  dateOfBirth: string;
  setDateOfBirth: React.Dispatch<React.SetStateAction<string>>;
  status: "Inquiry" | "Onboarding" | "Active" | "Churned";
  setStatus: React.Dispatch<React.SetStateAction<"Inquiry" | "Onboarding" | "Active" | "Churned">>;
  dateOfBirthError: boolean;
  setDateOfBirthError: React.Dispatch<React.SetStateAction<boolean>>;
  editingAgentId: string | null;
  providerId: string;
  toggleFormVisibility: () => void; 
  refreshPatientList: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  dateOfBirth,
  setDateOfBirth,
  status,
  setStatus,
  dateOfBirthError,
  setDateOfBirthError,
  editingAgentId,
  toggleFormVisibility,
  refreshPatientList
  
}) => {
  const providerId = "4417d7f4-9e0b-45e4-abaf-6f031c07e0ae"; 
  const [firstAddress, setFirstAddress] = useState("");
  const [secondAddress, setSecondAddress] = useState("");
  const [customFields, setCustomFields] = useState<{ fieldName: string; fieldValue: string }[]>([]);
  


  const handleAddCustomField = () => {
    setCustomFields([...customFields, { fieldName: "", fieldValue: "" }]);
  };

  const handleFieldChange = (index: number, key: "fieldName" | "fieldValue", value: string) => {
    const updatedFields = [...customFields];
    updatedFields[index][key] = value;
    setCustomFields(updatedFields);
  };

  const validateDateOfBirth = (date: string) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(date);
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateOfBirth(value);
    setDateOfBirthError(!validateDateOfBirth(value) && value.length > 0);
  };

  const createPayload = () => {
    return {
      first_name: firstName,
      middle_name: "", 
      last_name: lastName,
      date_of_birth: dateOfBirth,
      status: status.toLowerCase(),
      provider_id: providerId,
    };
  };

  const handleSubmit = async () => {
    
    const payload = createPayload();
  
    try {
      const response = await fetch("http://localhost:8000/api/patients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create patient");
      }
  
      const createdPatient = await response.json();

      const addressResponse = await fetch("http://localhost:8000/api/addresses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: createdPatient.id,
          first_address: firstAddress,
          second_address: secondAddress || "",
        }),
      });

      for (const field of customFields) {
        if (!field.fieldName || !field.fieldValue) continue; 
  
        const fieldNameResponse = await fetch("http://localhost:8000/api/custom-fields/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field_name: field.fieldName,
            field_type: 'text',
          }),
        });
  
        if (!fieldNameResponse.ok) {
          console.error("Failed to create custom field:", field.fieldName);
          continue; 
        }
  

        const customField = await fieldNameResponse.json();
        const customFieldId = customField.id;
  
        const patientCustomFieldResponse = await fetch("http://localhost:8000/api/patient-custom-fields/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: createdPatient.id,
            custom_field_id: customFieldId,
            field_value: field.fieldValue,
          }),
        });
  
        if (!patientCustomFieldResponse.ok) {
          console.error("Failed to create patient custom field for:", field.fieldName);
        }
      }
      if (!addressResponse.ok) {
        throw new Error("Failed to create address");
      }
  
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setStatus("Inquiry");
      setDateOfBirthError(false);
      setFirstAddress("");

      refreshPatientList();
      toggleFormVisibility();
    } catch (error) {
      console.error("Error creating patient or address:", error);
    }
  };

  return (
    <div className="patient-form">
      <h3 className="form-title">{editingAgentId ? "Edit Patient" : "Add New Patient"}</h3>
      
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="form-input"
      />
      
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="form-input"
      />

      <input
        type="date"
        placeholder="Date of Birth"
        value={dateOfBirth}
        onChange={handleDateOfBirthChange}
        className={`form-input ${dateOfBirthError ? "input-error" : ""}`}
      />
      <div className="error-text">
        {dateOfBirthError ? "Invalid date format" : "\u00A0"}
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "Inquiry" | "Onboarding" | "Active" | "Churned")}
        className="form-input"
      >
        <option value="Inquiry">Inquiry</option>
        <option value="Onboarding">Onboarding</option>
        <option value="Active">Active</option>
        <option value="Churned">Churned</option>
      </select>

      <input
        type="text"
        placeholder="Address (required)"
        value={firstAddress}
        onChange={(e) => setFirstAddress(e.target.value)}
        className="form-input"
      />

      <input
        type="text"
        placeholder="2nd Address (optional)"
        value={secondAddress}
        onChange={(e) => setSecondAddress(e.target.value)}
        className="form-input"
      />
      <div className="custom-fields-wrapper">
        {customFields.map((field, index) => (
          <div key={index} className="custom-field-group">
            <input
              type="text"
              placeholder="Field Name"
              value={field.fieldName}
              onChange={(e) => handleFieldChange(index, "fieldName", e.target.value)}
              className="input custom-input"
            />
            <input
              type="text"
              placeholder="Field Value"
              value={field.fieldValue}
              onChange={(e) => handleFieldChange(index, "fieldValue", e.target.value)}
              className="input custom-input"
            />
          </div>
        ))}
        <button type="button" className="add-button" onClick={handleAddCustomField}>
          ➕ Add Field
        </button>
      </div>


      <button
        onClick={handleSubmit}
        disabled={!firstName || !lastName || !dateOfBirth || dateOfBirthError}
        className="form-button"
      >
        {editingAgentId ? "Update Patient" : "Add Patient"}
      </button>
    </div>
  );
};

export default PatientForm;
