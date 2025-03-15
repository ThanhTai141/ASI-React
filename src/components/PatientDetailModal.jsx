import { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

// Định nghĩa schema validation
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  company: yup.string().required('Company is required'),
  title: yup.string().required('Title is required'),
  status: yup.string().required('Status is required'),
}).required();

function PatientDetailModal({ patient, onClose }) {
  // Sử dụng useForm từ react-hook-form để quản lý form, với Yup làm resolver để validate
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: patient,
  });

  const phone = "+1-942-854-5181"; 
  const timezone = "UTC (Coordinated Universal Time)";
  const createdDate = "November 04, 2024";

  const handleUpdate = async (data,e) => {
    e.preventDefault();
    try {
      const updatedPatient = { ...data, id: patient.id, avatar: patient.avatar };
      const response = await fetch(`http://localhost:3001/patients/${patient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPatient),
      });
      if (!response.ok) {
        throw new Error('Failed to update patient');
      }
      onClose(); 
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3001/patients/${patient.id}`, {
        method: 'DELETE',
      });
      toast.success('Patient deleted successfully!');
      onClose(); 
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  
  const handleStatusChange = async (newStatus) => {
    try {
      const updatedPatient = { ...patient, status: newStatus };//gan status tu patient
      await fetch(`http://localhost:3001/patients/${patient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPatient),//
      });
      onClose(); 
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-screen bg-black bg-rgba(0, 0, 0, 0.5)  bg-opacity-50 flex items-center justify-end z-50 transition-opacity duration-300"
      style={{ opacity: patient ? 1 : 0, pointerEvents: patient ? 'auto' : 'none' }}>
      <div className="bg-white p-6 dark:bg-gray-950 dark:text-white rounded-l-lg shadow-lg w-150px h-full transform transition-transform duration-300"
        style={{ transform: patient ? 'translateX(0)' : 'translateX(100%)' }}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="flex items-center mb-4">
          <img src={patient.avatar} alt={patient.name} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h2 className="text-xl  font-bold">{patient.name}</h2>
          </div>
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <label className="block text-sm  font-medium text-gray-700">Name</label>
              <input
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                {...register('company')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <textarea
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md dark:bg-black dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value={patient.status}>{patient.status}</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Qualified">Qualified</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Churned">Churned</option>
                <option value="Lost">Lost</option>
                <option value="Unqualified">Unqualified</option>
                <option value="Won">Won</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => { setIsEditing(false); reset(patient); }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Email</span>
              <span className="ml-2">{patient.email}</span>
              <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={() => setIsEditing(true)}>
                <span className="text-lg">✎</span>
              </button>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Company</span>
              <span className="ml-2">{patient.company}</span>
              <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={() => setIsEditing(true)}>
                <span className="text-lg">✎</span>
              </button>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Title</span>
              <span className="ml-2">{patient.title}</span>
              <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={() => setIsEditing(true)}>
                <span className="text-lg">✎</span>
              </button>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Phone</span>
              <span className="ml-2">{phone}</span>
              <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={() => setIsEditing(true)}>
                <span className="text-lg">✎</span>
              </button>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Timezone</span>
              <span className="ml-2">{timezone}</span>
              <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={() => setIsEditing(true)}>
                <span className="text-lg">✎</span>
              </button>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Lifecycle stage</span>
              <span className="ml-2 text-red-600">{patient.status}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-500"></span>
              <div className="flex space-x-1">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-800"
                  onClick={() => handleStatusChange('New')}
                >
                  New
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-800"
                  onClick={() => handleStatusChange('Contacted')}
                >
                  Contacted
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-800"
                  onClick={() => handleStatusChange('Interested')}
                >
                  Interested
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-800"
                  onClick={() => handleStatusChange('Qualified')}
                >
                  Qualified
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-800"
                  onClick={() => handleStatusChange('Negotiation')}
                >
                  Negotiation
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-800"
                  onClick={() => handleStatusChange('Churned')}
                >
                  Churned
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Created on</span>
              <span className="ml-2">{createdDate}</span>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => {
                  handleDelete();
                  onClose();
                }}
              >
                Delete Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

PatientDetailModal.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PatientDetailModal;