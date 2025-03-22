import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import * as yup from 'yup';
import PropTypes from 'prop-types';

// const API_URL = 'http://localhost:3001/patients';

// Schema validation
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  company: yup.string().required('Company is required'),
  title: yup.string().required('Title is required'),
  status: yup.string().required('Status is required'),
});

function PatientForm({ onClose, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', company: '', title: '', status: '' },
  });

  const handleFormSubmit = async (data) => {
    const newPatient = {
      ...data,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
     createdAt: new Date().toISOString(),
    };
  
    try {
      const response = await axios.post('http://localhost:3001/patients', newPatient);
      onSubmit(response.data); 
      onClose();
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 dark:bg-gray-300   bg-opacity-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
        <h2 className="text-xl font-bold mb-4 dark:text-black">Add New Patient</h2>
        <form  onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {['name', 'email', 'company', 'title'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                {...register(field)}
                className="mt-1 block dark:text-black w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field].message}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select {...register('status')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 dark:text-black focus:ring-blue-200">
              {['New', 'Contacted', 'Interested', 'Qualified', 'Negotiation', 'Churned', 'Lost', 'Unqualified', 'Won'].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
}

PatientForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PatientForm;
