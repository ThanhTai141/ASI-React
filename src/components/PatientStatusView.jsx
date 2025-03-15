import { useState } from 'react';
import PropTypes from 'prop-types';
import PatientTable from './PatientTable'; // Sử dụng PatientTable để hiển thị danh sách

function PatientStatusView({ patients, onPatientSelect }) {
  const [selectedStatus, setSelectedStatus] = useState('All'); // Mặc định hiển thị tất cả

  // Danh sách các status có thể chọn (bao gồm "All")
  const statusOptions = ['All', 'New', 'Contacted', 'Interested', 'Qualified', 'Negotiation', 'Churned', 'Lost', 'Unqualified', 'Won'];

  // Lọc danh sách bệnh nhân theo status đã chọn
  const filteredPatients = selectedStatus === 'All'
    ? patients
    : patients.filter(patient => patient.status === selectedStatus);

  return (
    <div className="p-4">
      {/* Thanh nav tabs - Đặt ở đầu component như một phần độc lập */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {statusOptions.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`
              px-4 py-2 rounded-t-md font-medium transition-colors duration-300
              ${selectedStatus === status
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bảng hiển thị danh sách bệnh nhân theo status */}
      <PatientTable patients={filteredPatients} onPatientSelect={onPatientSelect} />
    </div>
  );
}

// Định nghĩa prop types
PatientStatusView.propTypes = {
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
};

export default PatientStatusView;