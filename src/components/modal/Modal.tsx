import { Modal } from 'antd';

type ModalPropsType = {
  avatar: string;
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
};

export const ModalWithImage = ({ avatar, isOpen, setIsOpen }: ModalPropsType) => (
  <div>
    <Modal visible={isOpen} footer={null} onCancel={() => setIsOpen(false)}>
      <img src={avatar} alt="avatar" />
    </Modal>
  </div>
);
