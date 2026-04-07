import { Modal } from "antd";
import CardProduct from "../Product/CardProduct/CardProduct";

type DialogProps = {
  open: boolean;
  onClose: () => void;
};

const Dialog = ({ open, onClose }: DialogProps) => {
  return (
    <Modal
      title="Tất cả sản phẩm mới"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
    >
      <div className="grid grid-cols-4 gap-6">
        <CardProduct />
        <CardProduct />
        <CardProduct />
        <CardProduct />
      </div>
    </Modal>
  );
};

export default Dialog;
