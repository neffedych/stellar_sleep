import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PatientForm from './PatientForm';
import Header from './Header';
import '../css/PatientList.css';



interface Agent {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  status: 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';
  lastSeen: string;
}

const AgentList: React.FC = () => {

  const [isFormVisible, setIsFormVisible] = useState(false);

 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [status, setStatus] = useState<Agent['status']>('Active');
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Agent>>({});

  


  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Inactive' | 'All'>('All');


  useEffect(() => {
    fetch('http://localhost:8000/api/patients/')
      .then(res => res.json())
      .then((data) => {
        const transformedAgents: Agent[] = data.map((item: any) => ({
          id: item.id,
          firstName: item.first_name,
          middleName: item.middle_name || '',
          lastName: item.last_name,
          dateOfBirth: item.date_of_birth,
          status: item.status,
          lastSeen: new Date(item.updated_at).toLocaleString(undefined, {
            dateStyle: 'short',
            timeStyle: 'short',
          }),
        }));
        
        setAgents(transformedAgents);
      })
      .catch((err) => console.error('Failed to fetch agents:', err));
  }, []);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const updateAgent = (name: string, dateOfBirth: string, status: Agent['status']) => {
    const newAgent = {
      first_name: firstName,
      middle_name: '',
      last_name: lastName,
      date_of_birth: dateOfBirth,
      status,
      provider_id: 'bd60654a-7217-4382-8f66-af08b5a3b477',
    };

    fetch('http://localhost:8000/api/patients/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgent),
    })
      .then(res => res.json())
      .then(createdAgent => {
        setAgents(prev => [...prev, createdAgent]);
      })
      .catch(err => console.error('Error adding agent:', err));
  };

  const handleEditClick = (patient: Agent) => {
    if (editingId === patient.id) {
      const payload = {
        first_name: editedData.firstName,
        middle_name: editedData.middleName || '',
        last_name: editedData.lastName,
        date_of_birth: editedData.dateOfBirth,
        status: editedData.status,
        provider_id: 'bd60654a-7217-4382-8f66-af08b5a3b477',
      };
  
      fetch(`http://localhost:8000/api/patients/${patient.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((updated) => {
          setAgents((prev) =>
            prev.map((agent) =>
              agent.id === updated.id
                ? {
                    ...agent,
                    name: `${updated.first_name} ${updated.last_name}`,
                    dateOfBirth: updated.date_of_birth,
                    status: updated.status,
                    lastSeen: new Date().toLocaleString(),
                  }
                : agent
            )
          );
          setEditingId(null);
          setEditedData({});
        });
    } else {
      setEditingId(patient.id);
      setEditedData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        dateOfBirth: patient.dateOfBirth || '',
        status: patient.status || 'Active',
        middleName: patient.middleName || '',
      });
    }
  };
  
  

  const deleteAgent = (id: string) => {
    fetch(`http://localhost:8000/api/patients/${id}/`, { method: 'DELETE' })
      .then(() => {
        setAgents(prev => prev.filter(agent => agent.id !== id));
      })
      .catch(err => console.error('Error deleting agent:', err));
  };

  const getFilteredAgents = (): Agent[] => {
    return agents.filter(agent => {
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && ['active', 'onboarding'].includes(agent.status.toLowerCase())) ||
        (statusFilter === 'Inactive' && ['inquiry', 'churned'].includes(agent.status.toLowerCase()));

      const matchesQuery = `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesQuery;
    });
  };

  return (
  <>
    <Header userName="Roma" onLogout={() => console.log('Logged out')} />
    <div className="container">
    

      <div>
        <div className="search-filter-container">
          <div className="general-func">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
              />
            </div>

            <div className="filter-container">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="input"
              >
                <option value="All">Status</option>
                <option value="Active">active</option>
                <option value="Onboarding">onboarding</option>
                <option value="Churned">churned</option>
                <option value="Inquiry">inquiry</option>
              </select>
            </div>
          </div>

          <button onClick={toggleFormVisibility} className="button">
            {isFormVisible ? 'Close' : 'Add Patient'}
          </button>
        </div>

        {isFormVisible && (
          <PatientForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            status={status}
            setStatus={setStatus}
            dateOfBirthError={dateOfBirthError}
            setDateOfBirthError={setDateOfBirthError}
            editingAgentId={null}
            providerId={"bd60654a-7217-4382-8f66-af08b5a3b477"}
            toggleFormVisibility={toggleFormVisibility}

          />
        )}
      </div>

      <div className="right-side">
        {getFilteredAgents().length === 0 ? (
          <p>No agents found.</p>
        ) : (
          <table className="agent-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredAgents().map((patient) => (
                <tr key={patient.id}>
                  <td>
                      {patient.firstName} {patient.lastName}
                  </td>
                  <td>{patient.dateOfBirth}</td>
                  <td>{patient.status}</td>
                  <td>{patient.lastSeen}</td>
                  <td>
                    <div className='action-items' style={{ display: 'flex', gap: '12px' }}>
                      <Link className='link-icon' to={`/patients/${patient.id}`}>
                        <img
                          src="/icons/link_icon.png" 
                          alt="View patient"
                          
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                      </Link>
                      <button className="delete-button" onClick={() => deleteAgent(patient.id)}>
                        X
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </> );
};

export default AgentList;
