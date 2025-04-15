import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import '../css/PatientDetails.css';

interface Patient {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  status: "Inquiry" | "Onboarding" | "Active" | "Churned";
  lastSeen: string;
  createdAt: string;
  dateOfBirth: string;
}

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<{ firstAddress: string; secondAddress: string } | null>(null);
  const [customFields, setCustomFields] = useState<{ fieldName: string; fieldValue: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [updatedPatient, setUpdatedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/patients/${id}/`);
        if (!response.ok) throw new Error("Failed to fetch patient details");

        const data = await response.json();
        const patientData = {
          id: data.id,
          firstName: data.first_name,
          middleName: data.middle_name,
          lastName: data.last_name,
          dateOfBirth: data.date_of_birth,
          status: data.status,
          lastSeen: new Date(data.updated_at).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          }),
          createdAt: new Date(data.created_at).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          }),
        };
        setPatient(patientData);
        setUpdatedPatient(patientData);
        
        const addressResponse = await fetch(`http://localhost:8000/api/addresses/`);
        if (!addressResponse.ok) throw new Error("Failed to fetch addresses");

        const addressArray = await addressResponse.json();
        const matchedAddress = addressArray.find((addr: any) => addr.user_id === patientData.id);

        if (matchedAddress) {
          setAddress({
            firstAddress: matchedAddress.first_address,
            secondAddress: matchedAddress.second_address,
          });
        }

        const fieldsResponse = await fetch("http://localhost:8000/api/custom-fields/");
        if (!fieldsResponse.ok) throw new Error("Failed to fetch custom fields");
        const allFields = await fieldsResponse.json();

        const patientFieldsResponse = await fetch(`http://localhost:8000/api/patient-custom-fields/?patient_id=${patientData.id}/`);
        if (!patientFieldsResponse.ok) throw new Error("Failed to fetch patient custom fields");

        const patientFieldValues = await patientFieldsResponse.json();

        const combined = patientFieldValues.map((fieldVal: any) => {
          const fieldMeta = allFields.find((f: any) => f.id === fieldVal.custom_field_id);
          return {
            fieldName: fieldMeta?.field_name || "Unknown Field",
            fieldValue: fieldVal.field_value,
          };
        });

        setCustomFields(combined);

      } catch (error: any) {
        console.error(error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      if (updatedPatient && updatedPatient.id) {
        const response = await fetch(`http://localhost:8000/api/patients/${updatedPatient.id}/`, {
          method: "PATCH",  
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPatient),
        });

        if (!response.ok) {
          console.error("Failed to update patient data");
          return;
        }

        const updatedData = await response.json();
        setPatient(updatedData); 
        setIsEditing(false); 
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Something went wrong");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedPatient) {
      const { name, value } = e.target;
      setUpdatedPatient((prevState) => {
        if (!prevState) return prevState;  
      
        return {
          ...prevState,
          [name]: value,  
        };
      });
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2>Patient Details</h2>
      {patient && (
        <>
          <div className="patient-info">
            <div>
              <p>
                <strong>First Name: </strong> 
                {isEditing ? (
                  <input 
                    type="text" 
                    name="firstName" 
                    value={updatedPatient?.firstName || ''} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  patient.firstName
                )}
              </p>
              {patient.middleName && (
                <p>
                  <strong>Middle Name: </strong> 
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="middleName" 
                      value={updatedPatient?.middleName || ''} 
                      onChange={handleInputChange} 
                    />
                  ) : (
                    patient.middleName
                  )}
                </p>
              )}
              <p>
                <strong>Last Name: </strong> 
                {isEditing ? (
                  <input 
                    type="text" 
                    name="lastName" 
                    value={updatedPatient?.lastName || ''} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  patient.lastName
                )}
              </p>
              <p>
                <strong>Date of Birth: </strong>
                {isEditing ? (
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={updatedPatient?.dateOfBirth || ''} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  patient.dateOfBirth
                )}
              </p>
              <p>
                <strong>Status: </strong>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="status" 
                    value={updatedPatient?.status || ''} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  patient.status
                )}
              </p>
            </div>
            <div>
              <p><strong>Main Address:</strong> {address?.firstAddress}</p>
              {address?.secondAddress && (
                <p><strong>Second Address:</strong> {address.secondAddress}</p>
              )}
            </div>
            <div>
              <p><strong>Created at:</strong> {patient.createdAt}</p>
              <p><strong>Last Seen:</strong> {patient.lastSeen}</p>
            </div>
          </div>

          {!isEditing && <button className="button" onClick={handleEditClick}>Edit</button>}
          
          {isEditing && <button className="button" onClick={handleSaveClick}>Save</button>}
        </>
      )}
      <Link to="/" className="back-button">Back to List</Link>
    </div>
  );
};

export default PatientDetails;
