import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [userID, setUserID] = useState(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');  // Lấy token từ cookie
    if (token) {
      try {
        // Giải mã token để lấy userID
        const decodedToken = jwtDecode(token);

        const userID = decodedToken?.userId;  
        if (userID) {
          setUserID(userID);  // Lưu userID vào state
        } else {
          setUserID(null);
        }
      } catch (error) {
        console.error('Invalid token', error);
        setUserID(null);
      }
    } else {
      setUserID(null);
    }
  }, []);

  useEffect(() => {
    // Khi có userID, gọi API để lấy thông tin người dùng
    if (userID) {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch(`http://localhost:3050/api/user/${userID}`);
          const data = await response.json();

          if (response.ok && data?.fullName) {
            setFullName(data.fullName);  // Lưu fullName vào state
          } else {
            console.error('Failed to fetch user info');
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setLoading(false);  // Set loading thành false khi lấy dữ liệu xong
        }
      };

      fetchUserInfo();
    }
  }, [userID]);

  return { fullName, loading };
};

export default useAuth;
