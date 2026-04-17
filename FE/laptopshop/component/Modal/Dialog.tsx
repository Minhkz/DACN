import { Modal, Spin } from "antd";
import CardProduct from "../Product/CardProduct/CardProduct";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  content?: ProductDetailDto[];
  isLoading?: boolean;
};

const Dialog = ({ open, onClose, content, isLoading }: DialogProps) => {
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
        {isLoading ? (
          <div className="col-span-4 flex justify-center">
            <Spin />
          </div>
        ) : (
          (content ?? []).map((product) => (
            <CardProduct key={product.id} product={product} />
          ))
        )}
      </div>
    </Modal>
  );
};

export default Dialog;
