import React, { useState } from 'react';

import 'antd/dist/antd.css';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal, Select, Space, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import Search from 'antd/lib/input/Search';
import axios from 'axios';
import { useFormik } from 'formik';

export const App = () => {
  const API_URL = 'https://api.github.com';

  const [data, setData] = useState<any>();
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchResults = async (
    codeName: any,
    user: any,
    language: string,
    page: number,
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/search/code?q=${codeName}+user:${user}+language:${language}&per_page=10&page=${page}`,
      );
      setData(res.data);
      setTotalCount(res.data.total_count);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      throw new Error(e);
    }
  };

  type AvatarPropsType = {
    avatar: any;
  };
  // eslint-disable-next-line react/no-unstable-nested-components
  const ModalWithImage = ({ avatar }: AvatarPropsType) => (
    <div>
      <Modal visible={isOpen} footer={null} onCancel={() => setIsOpen(false)}>
        <img src={avatar} alt="avatar" />
      </Modal>
    </div>
  );

  const columns = [
    {
      title: 'File name',
      dataIndex: ['repository', 'owner', 'login'],
      render: (el: any, record: any) => (
        <div className="d-inline-flex">
          <div className="align-self-center">{el}</div>
          <button
            type="button"
            style={{ background: 'transparent', border: 'none' }}
            onClick={() => setIsOpen(true)}
          >
            <Avatar icon={<UserOutlined />} />
          </button>
          <ModalWithImage avatar={record.repository.owner.avatar_url} />
        </div>
      ),
    },
    { title: 'Description', dataIndex: ['repository', 'description'] },
    { title: 'Owner', dataIndex: ['repository', 'owner', 'login'] },
    {
      title: 'Github',
      dataIndex: 'html_url',
      render: (el: any) => (
        <a href={el} target="_blank" rel="noreferrer" className="pl-5">
          github
        </a>
      ),
    },
  ];

  type FormikErrorType = {
    codeName?: string;
    user?: any;
  };

  const formik = useFormik({
    initialValues: {
      codeName: '',
      user: '',
      language: '',
      page: 1,
    },
    validate: values => {
      const errors: FormikErrorType = {};
      if (!values.codeName) {
        errors.codeName = 'Required';
      }
      if (!values.user) {
        errors.user = 'Required';
      }
      return errors;
    },
    onSubmit: values => {
      fetchResults(values.codeName, values.user, values.language, values.page);
    },
  });

  return (
    <>
      <div className="d-flex justify-content-center py-5">
        <form onSubmit={formik.handleSubmit}>
          <Space direction="vertical">
            <Search
              placeholder="input search text"
              allowClear
              size="large"
              id="codeName"
              name="codeName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.codeName}
            />
            {formik.touched.codeName && formik.errors.codeName ? (
              <div style={{ color: 'red' }}>{formik.errors.codeName}</div>
            ) : null}

            <Search
              placeholder="input search user"
              allowClear
              size="large"
              id="user"
              name="user"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.user}
            />

            {formik.touched.user && formik.errors.user ? (
              <div style={{ color: 'red' }}>{formik.errors.user}</div>
            ) : null}

            <Select
              defaultValue={formik.values.language}
              labelInValue
              style={{
                width: 261,
              }}
              onChange={(value: any) => formik.setFieldValue('language', value.value)}
              value={formik.values.language}
            >
              <Option value="ruby">Ruby</Option>
              <Option value="go">Go</Option>
              <Option value="javascript">TypeScript</Option>
            </Select>

            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Space>
        </form>
        {/* <Search
          placeholder="input search text"
          allowClear
          size="large"
          className="w-25"
          onChange={fetchResults}
        /> */}
      </div>
      <div className="d-flex justify-content-center">
        <Table
          size="large"
          style={{ width: '50%' }}
          loading={loading}
          columns={columns}
          dataSource={data?.items}
          pagination={{
            pageSize: 10,
            total: totalCount,
            onChange: page =>
              fetchResults(
                formik.values.codeName,
                formik.values.user,
                formik.values.language,
                page,
              ),
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
        />
      </div>
    </>
  );
};
