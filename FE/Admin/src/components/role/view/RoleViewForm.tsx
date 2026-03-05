import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { RoleType } from '@/types/role/RoleTpye';

const { TextArea } = Input;

interface Props {
  data?: RoleType;
}

const RoleViewForm: React.FC<Props> = ({ data }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        code: data.code,
        description: data.description,
        isActive: data.isActive ? 'Active' : 'Inactive',
      });
    }
  }, [data, form]);

  return (
    <Form form={form} layout="vertical" style={{ maxWidth: 520 }}>
      <Form.Item label="Tên role" name="name">
        <Input readOnly />
      </Form.Item>

      <Form.Item label="Mã role" name="code">
        <Input readOnly />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <TextArea rows={4} readOnly showCount maxLength={255} />
      </Form.Item>

      <Form.Item label="Trạng thái" name="isActive">
        <Input readOnly />
      </Form.Item>
    </Form>
  );
};

export default RoleViewForm;
