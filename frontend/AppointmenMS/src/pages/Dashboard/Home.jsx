import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { FiUser, FiClock, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { GiCircuitry } from 'react-icons/gi';

const Home = () => {
  const [appointments, setAppointments] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'soon', 'ongoing', 'expired'

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    start: '', 
    end: '', 
    participants: '' 
  });
  const [modalError, setModalError] = useState('');

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentTime, setCurrentTime] = useState(moment().tz(moment.tz.guess()));
  const token = localStorage.getItem('token');
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  );
  const [profileData, setProfileData] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/appointments',
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const userApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: { Authorization: `Bearer ${token}` }
  });

  // Live clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(moment().tz(userTimezone)), 1000);
    return () => clearInterval(timer);
  }, [userTimezone]);

  const formatDate = (dateStr, tz = userTimezone) => {
    return moment(dateStr).tz(tz).format('YYYY-MM-DD HH:mm:ss');
  };

  const formatDateWithTz = (dateStr, tz = userTimezone) => {
    return `${moment(dateStr).tz(tz).format('YYYY-MM-DD HH:mm:ss')} (${tz})`;
  };

const fetchProfileData = async () => {
  setProfileLoading(true);
  try {
    const res = await userApi.get('/auth/profile');
    setProfileData(res.data);
    // Set timezone sesuai profil
    setUserTimezone(res.data.preferred_timezone || 'UTC'); // Tambahkan ini
  } catch (err) {
    console.error('Error fetching profile:', err);
  } finally {
    setProfileLoading(false);
  }
};

  const groupAppointmentsByMonth = (appts) => {
    const grouped = {};
    appts.forEach(appt => {
      const monthKey = moment(appt.start).tz(userTimezone).format('MMMM YYYY');
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(appt);
    });
    
    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => new Date(a.start) - new Date(b.start));
    });
    
    setGroupedAppointments(grouped);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/');
      setAppointments(res.data.appointments || []);
      groupAppointmentsByMonth(res.data.appointments || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProfileData().then(() => fetchAppointments());
  }, []);

  const getStatus = appt => {
    const now = moment().tz(userTimezone);
    const start = moment(appt.start).tz(userTimezone);
    const end = moment(appt.end).tz(userTimezone);
    
    if (end.isBefore(now)) return 'EXPIRED';
    if (start.isBefore(now) && end.isAfter(now)) return 'ONGOING';
    if (start.diff(now, 'minutes') <= 60 && start.isAfter(now)) return 'SOON';
    return 'UPCOMING';
  };

  const statusStyles = {
    UPCOMING: {
      bg: 'bg-gray-800',
      border: 'border-cyan-500',
      text: 'text-cyan-400',
      icon: <FiClock className="text-cyan-400" />,
      statusText: 'text-cyan-400',
      shadow: 'shadow-lg shadow-cyan-500/20'
    },
    SOON: {
      bg: 'bg-amber-900/30',
      border: 'border-amber-500',
      text: 'text-amber-400',
      icon: <FiAlertTriangle className="text-amber-400" />,
      statusText: 'text-amber-400',
      shadow: 'shadow-lg shadow-amber-500/20'
    },
    ONGOING: {
      bg: 'bg-green-900/30',
      border: 'border-green-500',
      text: 'text-green-400',
      icon: <FiClock className="text-green-400" />,
      statusText: 'text-green-400',
      shadow: 'shadow-lg shadow-green-500/20'
    },
    EXPIRED: {
      bg: 'bg-gray-900/50',
      border: 'border-gray-600',
      text: 'text-gray-500',
      icon: <FiClock className="text-gray-500" />,
      statusText: 'text-gray-500 line-through',
      shadow: 'shadow-md shadow-gray-500/10',
      cardOpacity: 'opacity-80'
    }
  };

  const openModal = appt => {
    setModalError('');
    if (appt) {
      setEditMode(true);
      setCurrentAppt(appt);
      setFormData({
        title: appt.title,
        description: appt.description || '',
        start: moment(appt.start).tz(userTimezone).format('YYYY-MM-DDTHH:mm'),
        end: moment(appt.end).tz(userTimezone).format('YYYY-MM-DDTHH:mm'),
        participants: appt.participants ? appt.participants.map(u => typeof u === 'object' ? u.username : u).join(', ') : ''
      });
    } else {
      setEditMode(false);
      setCurrentAppt(null);
      setFormData({ title: '', description: '', start: '', end: '', participants: '' });
    }
    setModalOpen(true);
  };
  
  const closeModal = () => { setModalError(''); setModalOpen(false); };

  const handleChange = e => { 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
    setModalError(''); 
  };

  const validateBusinessHours = (start, end) => {
    const startHour = moment(start).tz(userTimezone).hour();
    const endHour = moment(end).tz(userTimezone).hour();
    return startHour >= 8 && endHour <= 17;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const startDate = new Date(formData.start), endDate = new Date(formData.end);
    
    if (endDate <= startDate) return setModalError('End time must be after start time.');
    
    if (!validateBusinessHours(formData.start, formData.end)) {
      return setModalError('Appointments must be between 08:00 and 17:00 in your timezone.');
    }
    
    try {
      const payload = { 
        title: formData.title,
        description: formData.description,
        start: formData.start,
        end: formData.end,
        participants: formData.participants.split(',').map(s => s.trim()).filter(s => s)
      };
      
      if (formData.participants.trim()) {
        payload.participants = formData.participants.split(',').map(s => s.trim()).filter(s => s);
      }
      
      if (editMode && currentAppt) {
        await api.put(`/${currentAppt._id}`, payload);
      } else {
        await api.post('/', payload);
      }
      
      fetchAppointments();
      closeModal();
      Swal.fire({ 
        icon: 'success', 
        title: editMode ? 'Appointment Updated!' : 'Appointment Created!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      setModalError(err.response?.data?.message || 'Error saving appointment');
      console.error('Error submitting form:', err);
    }
  };

  const handleDelete = (apptId) => {
    Swal.fire({
      title: 'Delete this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/${apptId}`);
          fetchAppointments();
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (err) {
          console.error('Delete error:', err);
          Swal.fire('Error', err.response?.data?.message || 'Could not delete appointment', 'error');
        }
      }
    });
  };

  const openProfile = async () => {
    setProfileModalOpen(true);
    await fetchProfileData(); // Panggil fungsi fetch data
  };
  
  const closeProfile = () => setProfileModalOpen(false);
  
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-900 min-h-screen text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-cyan-900/10 to-transparent -z-10"></div>
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-cyan-900/10 to-transparent -z-10"></div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <GiCircuitry className="text-cyan-400 w-8 h-8" />
          <h1 className="text-3xl font-bold tracking-wide">Appointments MS</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-gray-800 px-3 py-2 rounded-lg">
            <FiClock />
            <span>{currentTime.format('YYYY-MM-DD HH:mm:ss')}</span>
            <span className="text-xs text-cyan-300">({userTimezone})</span>
          </div>
          <button 
            onClick={() => openModal()} 
            className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/30"
          >
            Buat Appointment 
          </button>
          <FiUser 
            onClick={openProfile} 
            className="w-7 h-7 cursor-pointer text-cyan-300 hover:text-white transition" 
          />
        </div>
      </div>

      {/* Enhanced Filter Tabs */}
      <div className="flex space-x-2 mb-6 bg-gray-800 p-1 rounded-lg overflow-x-auto">
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'all' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
          onClick={() => setFilter('all')}
        >
          Semua Appointments
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'upcoming' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
          onClick={() => setFilter('upcoming')}
        >
          Akan Datang
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'soon' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
          onClick={() => setFilter('soon')}
        >
          Akan Dimulai Segera
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'ongoing' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
          onClick={() => setFilter('ongoing')}
        >
          Sedang Berjalan
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'expired' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
          onClick={() => setFilter('expired')}
        >
          
        </button>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center">
          <FiClock className="animate-spin w-12 h-12 text-cyan-500" />
        </div>
      ) : error ? (
        <div className="bg-red-700 text-red-100 px-4 py-2 rounded-lg">{error}</div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedAppointments).length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400">No appointments found</p>
            </div>
          )}
          
          {Object.keys(groupedAppointments).sort((a, b) => {
            return moment(a, 'MMMM YYYY').diff(moment(b, 'MMMM YYYY'));
          }).map(month => {
            let filteredAppointments = groupedAppointments[month];
            
            // Apply filter based on selected tab
            if (filter !== 'all') {
              filteredAppointments = filteredAppointments.filter(appt => {
                const status = getStatus(appt);
                if (filter === 'upcoming') return status === 'UPCOMING';
                if (filter === 'soon') return status === 'SOON';
                if (filter === 'ongoing') return status === 'ONGOING';
                if (filter === 'expired') return status === 'EXPIRED';
                return true;
              });
            }

            if (filteredAppointments.length === 0) return null;

            return (
              <div key={month} className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-cyan-300 border-b border-cyan-800 pb-2">
                  {month}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAppointments.map(appt => {
                    const status = getStatus(appt);
                    const styles = statusStyles[status];
                    
                    return (
                      <div 
                        key={appt._id} 
                        className={`p-5 rounded-xl border ${styles.bg} ${styles.border} ${styles.shadow} ${styles.cardOpacity || ''} transition-all hover:scale-[1.02]`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h2 className={`text-xl font-semibold ${styles.text}`}>
                            {appt.title}
                          </h2>
                          <div className="flex items-center">
                            {styles.icon}
                            <span className={`ml-2 text-sm uppercase font-bold ${styles.statusText}`}>
                              {status}
                            </span>
                          </div>
                        </div>
                        
                        {appt.description && (
                          <p className={`text-sm mb-3 ${status === 'EXPIRED' ? 'text-gray-500' : 'text-gray-300'}`}>
                            {appt.description}
                          </p>
                        )}
                        
                        <div className="mb-3">
                          <div className="flex items-center text-sm mb-1">
                            <FiClock className={`mr-1 ${styles.text}`} />
                            <span className={status === 'EXPIRED' ? 'text-gray-500' : ''}>
                              {formatDateWithTz(appt.start)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FiClock className={`mr-1 ${styles.text}`} />
                            <span className={status === 'EXPIRED' ? 'text-gray-500' : ''}>
                              {formatDateWithTz(appt.end)}
                            </span>
                          </div>
                        </div>
                        

                        
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => openModal(appt)} 
                            className={`px-3 py-1 rounded transition-all ${status === 'EXPIRED' ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-cyan-700 text-white hover:bg-cyan-600'} hover:shadow-md`}
                          >
                            Ubah
                          </button>
                          <button 
                            onClick={() => handleDelete(appt._id)} 
                            className={`px-3 py-1 rounded transition-all ${status === 'EXPIRED' ? 'bg-gray-800 text-gray-500 hover:bg-gray-700' : 'bg-red-700 text-white hover:bg-red-600'} hover:shadow-md`}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50 bg-black bg-opacity-50">
          <div className="pointer-events-auto bg-gray-900 border border-cyan-500 rounded-lg p-6 w-full max-w-md mx-4 shadow-lg shadow-cyan-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-cyan-400 font-bold">
                {editMode ? 'Ubah Appointment' : 'Buat Appointment'}
              </h2>
              <button onClick={closeModal} className="text-cyan-400 hover:text-white text-2xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {modalError && (
                <p className="text-red-400 text-sm bg-red-900/30 p-2 rounded">
                  {modalError}
                </p>
              )}
              <div>
                <label className="block text-sm mb-1 text-cyan-300">Judul</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full bg-gray-800 border border-cyan-600 rounded px-3 py-2 focus:outline-none focus:border-cyan-400 text-white" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-cyan-300">Deskripsi</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full bg-gray-800 border border-cyan-600 rounded px-3 py-2 focus:outline-none focus:border-cyan-400 text-white" 
                />
              </div>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm mb-1 text-cyan-300">Awal</label>
                  <input 
                    type="datetime-local" 
                    name="start" 
                    value={formData.start} 
                    onChange={handleChange} 
                    className="w-full bg-gray-800 border border-cyan-600 rounded px-3 py-2 focus:outline-none focus:border-cyan-400 text-white" 
                    required 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1 text-cyan-300">Akhir</label>
                  <input 
                    type="datetime-local" 
                    name="end" 
                    value={formData.end} 
                    onChange={handleChange} 
                    className="w-full bg-gray-800 border border-cyan-600 rounded px-3 py-2 focus:outline-none focus:border-cyan-400 text-white" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-cyan-300">Peserta</label>
                <input 
                  type="text" 
                  name="participants" 
                  value={formData.participants} 
                  onChange={handleChange} 
                  className="w-full bg-gray-800 border border-cyan-600 rounded px-3 py-2 focus:outline-none focus:border-cyan-400 text-white" 
                  placeholder="John, Doe, Alex" 
                />
                <small className="text-gray-400 block mt-1">
                  Masukkan username pisahkan dengan koma
                </small>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2 border border-cyan-600 text-cyan-400 rounded hover:bg-cyan-900/30 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition hover:shadow-md hover:shadow-cyan-500/30"
                >
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


{profileModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50 bg-black bg-opacity-50">
    <div className="pointer-events-auto bg-gray-900 border border-cyan-500 rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg shadow-cyan-500/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-cyan-400 font-bold">Profil User</h2>
        <button onClick={closeProfile} className="text-cyan-400 hover:text-white text-2xl">
          &times;
        </button>
      </div>
      {profileLoading ? (
        <div className="flex justify-center py-8">
          <FiClock className="animate-spin w-8 h-8 text-cyan-500" />
        </div>
      ) : profileData ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-cyan-800 flex items-center justify-center">
              <FiUser className="w-10 h-10 text-cyan-200" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <p className="flex justify-between">
              <span className="text-gray-400">Nama :</span> 
              <span className="text-cyan-300 font-medium">{profileData.name}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-400">Username :</span> 
              <span className="text-cyan-300 font-medium">{profileData.username}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-400">Zona Waktu:</span> 
              <span className="text-cyan-300 font-medium">
                {profileData.preferred_timezone || 'UTC'}
              </span>
            </p>
          </div>
          
          <button 
            onClick={logout} 
            className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-lg transition duration-200 flex items-center justify-center hover:shadow-md hover:shadow-red-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      ) : (
        <div className="text-red-400 bg-red-900/30 p-4 rounded-lg">
          <p>Error loading profile. Please try again.</p>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default Home;