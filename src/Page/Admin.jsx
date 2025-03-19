import { useState, useEffect } from 'react';
import { List, LayoutGrid } from 'lucide-react';
import { ThemeProvider } from '../context/ThemeContext.jsx'; 
import SetThemeLayout from '../components/SetThemeLayout.jsx';
import Sidebar from '../components/Sidebar.jsx'; 
import PatientTable from '../components/PatientTable.jsx'; 
import Dashboard from '../components/Dashboard.jsx';
import PatientGrid from '../components/PatientGrid.jsx'; 
import PatientForm from '../components/PatientForm.jsx'; 
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PatientDetailModal from '../components/PatientDetailModal.jsx'; 
import { menuItems as baseMenuItems } from '../components/MenuItem.js'; 
import Profile from '../components/Profile.jsx';
import '../App.css'; 
function Admin() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientsPerPage, setPatientsPerPage] = useState(12);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem('activeView') || 'dashboard';
  });
  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:3001/patients');
        const result = await response.json();
        const sortedPatients = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPatients(sortedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  const menuItems = baseMenuItems.map(item => ({
    ...item,
    isActive: activeView === item.id,
  }));

  const handleItemClick = (id) => {
    // Chỉ xử lý nếu id không phải là 'theme'
    if (id !== 'theme') { 
      setActiveView(id);
      if (id === 'logout') {
        console.log('Logging out...');
        
      }
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const handleCloseModal = () => {
    setSelectedPatient(null);
  };
  const handleLogout = () => {
    logout();
    toast.success('Logout successfully');
    localStorage.removeItem('user'); 
    localStorage.removeItem('token'); 
    navigate('/'); 
  };
  const handleDeletePatient = async (patientId) => {
    const originalPatients = [...patients];
    // Cập nhật state patients bằng cách loại bỏ bệnh nhân có id tương ứng
    setPatients(patients.filter((patient) => patient.id !== patientId));
    try {
      await fetch(`http://localhost:3001/patients/${patientId}`, {
        method: 'DELETE',
      });
      toast.success('Patient deleted successfully!');
    } catch (error) {
      console.error('Error deleting patient:', error);
      setPatients(originalPatients);
      toast.error('Failed to delete patient. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  useEffect(() => {
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages); 
    } else if (filteredPatients.length === 0) {
      setCurrentPage(1); 
    }
  },[filteredPatients, currentPage, patientsPerPage]);

  const handleAddPatient = (newPatient) => { // Loại bỏ tham số event
    setPatients(prev => [newPatient,...prev]); 
    toast.success('Patient added successfully!');
    setCurrentPage(1);
  };
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="p-6 text-gray-900 dark:text-white">
           <Dashboard/>
          </div>
        );
      case 'patients':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">List Clients</h1>
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => setViewMode('table')}
                >
                  <List />
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid />
                </button>
              </div>
            </div>
            <div className="mb-4 flex justify-end">
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 p-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={() => setIsFormOpen(true)}
              >
                Add new contact
              </button>
            </div>
            {viewMode === 'table' ? (
              <PatientTable patients={currentPatients} onPatientSelect={setSelectedPatient}  onDeletePatient={handleDeletePatient}/>
            ) : (
              <PatientGrid patients={currentPatients} onPatientSelect={setSelectedPatient} />
            )}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-gray-600 mb-4 dark:text-gray-300">
                {filteredPatients.length} contacts in total
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 mb-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 mb-4 py-1 border border-gray-300 rounded-md ${
                      currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                    } dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${
                      currentPage === page ? 'dark:bg-blue-600' : ''
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 mb-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
                >
                  →
                </button>
                <select
                  value={patientsPerPage}
                  onChange={(e) => setPatientsPerPage(parseInt(e.target.value))}
                  className="ml-2 mb-4 p-1 border border-gray-300 rounded-md text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="12">12 / page</option>
                  <option value="24">24 / page</option>
                  <option value="48">48 / page</option>
                </select>
              </div>
            </div>
          </>
        );
        case 'profile':
        return <Profile />;
      case 'logout':
        return (
          <div className="p-6 text-gray-900 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Logout</h1>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setActiveView('patients')} // Quay lại view "patients" nếu hủy
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                No
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <SetThemeLayout>
     
        <div className="flex gap-4  min-h-screen">
          <Sidebar menuItems={menuItems} onItemClick={handleItemClick} />
          <div className="flex-1">{renderContent()}</div>
          {selectedPatient && (
            <PatientDetailModal patient={selectedPatient} onClose={handleCloseModal} />
          )}
          {isFormOpen && (
            <PatientForm onClose={handleCloseForm} onSubmit={handleAddPatient} />
          )}
        </div>
      </SetThemeLayout>
    </ThemeProvider>
  );
}

export default Admin;