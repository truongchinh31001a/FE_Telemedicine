import axios from 'axios';

// Đảm bảo rằng cookie sẽ được gửi kèm với mỗi yêu cầu
axios.defaults.withCredentials = true;  // Đảm bảo gửi cookie trong mỗi yêu cầu

// Cấu hình base URL cho axios nếu cần thiết
axios.defaults.baseURL = 'http://localhost:3001'; // Đảm bảo URL của backend chính xác

export default axios;
