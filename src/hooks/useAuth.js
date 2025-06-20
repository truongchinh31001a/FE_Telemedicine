import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [userID, setUserID] = useState(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token'); // Lấy token từ cookie
    if (token) {
      try {
        // Giải mã token để lấy thông tin
        const decodedToken = jwtDecode(token);

        const userID = decodedToken?.userId;
        const fullName = decodedToken?.fullname; // Chú ý: fullname viết thường

        setUserID(userID || null);
        setFullName(fullName || '');
      } catch (error) {
        console.error('Invalid token', error);
        setUserID(null);
        setFullName('');
      }
    } else {
      setUserID(null);
      setFullName('');
    }
    setLoading(false); // Kết thúc loading sau khi xử lý xong
  }, []);

  return { userID, fullName, loading };
};

export default useAuth;
