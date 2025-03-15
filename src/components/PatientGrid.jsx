import PropTypes from 'prop-types';
import { Eye} from 'lucide-react';
function PatientGrid({ patients, onPatientSelect }) {
 
  return (
      
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {patients.map(patient => (
        <div
          key={patient.id}
          className="bg-white dark:bg-gray-950 dark:hover:bg-gray-600 dark:shadow-md p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow "
          // onClick={() => onPatientSelect(patient)}
        >
          <div className="flex items-center mb-2">
            <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full mr-3" />
            <div>
              <h3 className="text-sm font-medium">{patient.name}</h3>
              <p className="text-xs text-gray-500">{patient.email}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-2">Company: {patient.company}</p>
          <p className="text-xs text-gray-500 mb-2">Title: {patient.title}</p>
          <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(patient.status)}`}>
              {patient.status}
            </span>
            <div className="flex space-x-2">
              <button onClick={() => onPatientSelect(patient)} className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer">
                <Eye />
              </button>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'churned': return 'bg-red-200 text-red-800';
    case 'contacted': return 'bg-blue-200 text-blue-800';
    case 'new': return 'bg-green-200 text-green-800';
    case 'lost': return 'bg-gray-200 text-gray-800';
    case 'unqualified': return 'bg-yellow-200 text-yellow-800';
    case 'qualified': return 'bg-teal-200 text-teal-800';
    case 'won': return 'bg-purple-200 text-purple-800';
    case 'negotiation': return 'bg-indigo-200 text-indigo-800';
    default: return 'bg-gray-200 text-gray-800';
  }
}

// Định nghĩa prop types
PatientGrid.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
  onPatientSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PatientGrid;

