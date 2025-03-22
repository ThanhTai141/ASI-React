import  { useState, useEffect } from 'react';
import axios from 'axios';
import { startOfDay, startOfMonth, startOfYear, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dữ liệu demo giả lập
  const mockRevenue = {
    daily: 5000,
    monthly: 150000,
    yearly: 1800000,
  };

  const mockTopSellingProducts = [
    { name: 'Product A', sales: 1200 },
    { name: 'Product B', sales: 800 },
    { name: 'Product C', sales: 500 },
  ];

  const mockMostViewedProducts = [
    { name: 'Product A', views: 5000 },
    { name: 'Product D', views: 3200 },
    { name: 'Product E', views: 2000 },
  ];

  // Lấy dữ liệu users từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu người  dùng :', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const calculateNewUsers = () => {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const startOfCurrentMonth = startOfMonth(now);
    const startOfCurrentYear = startOfYear(now);

    const dailyUsers = users.filter((user) => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return differenceInDays(startOfToday, userDate) === 0; // Chỉ tính user trong ngày hôm nay
    }).length;

    const monthlyUsers = users.filter((user) => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return differenceInMonths(startOfCurrentMonth, userDate) === 0; // Chỉ tính user trong tháng này
    }).length;

    const yearlyUsers = users.filter((user) => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return differenceInYears(startOfCurrentYear, userDate) === 0; // Chỉ tính user trong năm này
    }).length;

    return { daily: dailyUsers, monthly: monthlyUsers, yearly: yearlyUsers };
  };

  const newUsers = calculateNewUsers();

  const revenueData = {
    labels: ['Daily', 'Monthly', 'Yearly'],
    datasets: [
      {
        label: 'Doanh Thu (VNĐ)',
        data: [mockRevenue.daily, mockRevenue.monthly, mockRevenue.yearly],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const topSellingData = {
    labels: mockTopSellingProducts.map((p) => p.name),
    datasets: [
      {
        label: 'Số Lượng Bán',
        data: mockTopSellingProducts.map((p) => p.sales),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const mostViewedData = {
    labels: mockMostViewedProducts.map((p) => p.name),
    datasets: [
      {
        label: 'Số Lượt Xem',
        data: mockMostViewedProducts.map((p) => p.views),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Thống Kê' },
    },
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mt-  mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-3xl  font-bold mb-4 text-center">Dashboard </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {/* Thống kê người dùng mới */}
        <div className="bg-white dark:bg-gray-900  dark:text-gray-200 p-4 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-lg  font-semibold mb-2"> New Users</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 border rounded text-center">
                <h3 className="text-sm">Daily</h3>
                <p className="text-xl font-bold">{newUsers.daily}</p>
              </div>
              <div className="p-2 border rounded text-center">
                <h3 className="text-sm">Monthly</h3>
                <p className="text-xl font-bold">{newUsers.monthly}</p>
              </div>
              <div className="p-2 border rounded text-center">
                <h3 className="text-sm">Yearly</h3>
                <p className="text-xl font-bold">{newUsers.yearly}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900  p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Doanh Thu (Demo)</h2>
          <div className="flex-1  min-h-[200px]">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Sản Phẩm Bán Chạy Nhất (Demo)</h2>
          <div className="flex-1 min-h-[200px]">
            <Bar data={topSellingData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col md:col-span-3">
          <h2 className="text-lg font-semibold mb-2">Sản Phẩm Được Xem Nhiều Nhất (Demo)</h2>
          <div className="flex-1 min-h-[200px]">
            <Bar data={mostViewedData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;