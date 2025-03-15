import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, Trash } from 'lucide-react';
import DeleteModal from './Deletemodal';

function PatientTable({ patients, onPatientSelect, onDeletePatient }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      onDeletePatient(patientToDelete.id); // Gọi hàm xóa từ component cha
    }
    setIsModalOpen(false);
    setPatientToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPatientToDelete(null);
  };

  return (
    <>
      <table className="w-full bg-white dark:bg-gray-950 border border-gray-200 rounded-md shadow-md">
        <thead>
          <tr>
            <th className="p-3 text-left text-black-600">Name</th>
            <th className="p-3 text-left text-black-600">Email</th>
            <th className="p-3 text-left text-black-600">Company</th>
            <th className="p-3 text-left text-black-600">Title</th>
            <th className="p-3 text-left text-black-600">Status</th>
            <th className="p-3 text-left text-black-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="border-t cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <td className="p-3">
                <div className="flex items-center">
                  <img
                    src={patient.avatar || null} // Tránh src=""
                    alt={patient.name}
                    className="w-8 h-8 rounded-full mr-2"
                    onError={(e) => (e.target.src = null)} // Xử lý lỗi tải ảnh
                  />
                  <span className="color-black">{patient.name}</span>
                </div>
              </td>
              <td className="p-3">{patient.email}</td>
              <td className="p-3">{patient.company}</td>
              <td className="p-3">{patient.title}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    patient.status
                  )}`}
                >
                  {patient.status}
                </span>
              </td>
              <td className="p-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onPatientSelect(patient)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <span className="text-xl">
                      <Eye />
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(patient)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <span className="text-xl">
                      <Trash />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal xác nhận xóa */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

// Hàm lấy màu cho status
function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'churned':
      return 'bg-red-200 text-red-800';
    case 'contacted':
      return 'bg-blue-200 text-blue-800';
    case 'new':
      return 'bg-green-200 text-green-800';
    case 'lost':
      return 'bg-gray-200 text-gray-800';
    case 'unqualified':
      return 'bg-yellow-200 text-yellow-800';
    case 'qualified':
      return 'bg-teal-200 text-teal-800';
    case 'won':
      return 'bg-purple-200 text-purple-800';
    case 'negotiation':
      return 'bg-indigo-200 text-indigo-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

PatientTable.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    })
  ).isRequired,
  onPatientSelect: PropTypes.func.isRequired,
  onDeletePatient: PropTypes.func.isRequired, // Thêm prop mới
};

export default PatientTable;