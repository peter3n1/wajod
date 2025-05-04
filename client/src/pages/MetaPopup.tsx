import { useEffect } from "react";
import MetaLoginPopup from "@/components/MetaLoginPopup";

export default function MetaPopup() {
  // Đảm bảo rằng popup luôn hiển thị ở giữa màn hình
  useEffect(() => {
    // Thêm data attribute để CSS có thể nhận diện đây là trang popup
    document.documentElement.setAttribute('data-meta-popup', 'true');
    
    // Tính toán vị trí giữa màn hình
    const centerWindow = () => {
      const width = 500;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      // Di chuyển cửa sổ đến vị trí trung tâm
      try {
        window.resizeTo(width, height);
        window.moveTo(left, top);
      } catch (error) {
        console.log('Unable to resize/move window, might be restricted by browser');
      }
    };
    
    // Thực hiện căn giữa khi trang được tải
    centerWindow();
    
    // Thêm listener để căn giữa cửa sổ khi kích thước trình duyệt thay đổi
    window.addEventListener("resize", centerWindow);
    
    return () => {
      document.documentElement.removeAttribute('data-meta-popup');
      window.removeEventListener("resize", centerWindow);
    };
  }, []);
  
  return <MetaLoginPopup />;
}