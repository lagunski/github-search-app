import React, { useState } from 'react';

import 'antd/dist/antd.css';
import './App.css';
import { Button, Input, Modal, Select, Space, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import { useFormik } from 'formik';

import { github } from '../../assets';

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
    pageSize: number,
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/search/code?q=${codeName}+user:${user}+language:${language}&per_page=${pageSize}&page=${page}`,
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
      dataIndex: 'name',
      align: 'left' as 'left',
    },
    {
      title: 'Avatar',
      dataIndex: ['repository', 'owner', 'avatar_url'],
      align: 'center' as 'center',
      render: (el: any) => (
        <>
          <button
            type="button"
            style={{ background: 'transparent', border: 'none' }}
            onClick={() => setIsOpen(true)}
          >
            <img src={el} alt="avatar" className="avatar" />
          </button>
          <ModalWithImage avatar={el} />
        </>
      ),
    },
    {
      title: 'Description',
      dataIndex: ['repository', 'description'],
      align: 'center' as 'center',
      render: (el: string) => (!el ? '—' : el),
    },
    {
      title: 'Owner',
      dataIndex: ['repository', 'owner', 'login'],
      align: 'center' as 'center',
    },
    {
      title: 'Github',
      dataIndex: 'html_url',
      align: 'center' as 'center',
      width: '10%',
      render: (el: any) => (
        <a href={el} target="_blank" rel="noreferrer" className="pl-5">
          <img src={github} alt="github" className="avatar" />
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
      pageSize: 10,
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
      fetchResults(
        values.codeName,
        values.user,
        values.language,
        values.page,
        values.pageSize,
      );
    },
  });

  return (
    <>
      <div className="d-flex justify-content-center py-5">
        <form onSubmit={formik.handleSubmit}>
          <Space direction="vertical" className="gap-1">
            <p className="mb-0 mt-2">Phrase</p>
            <Input
              placeholder="provide a phrase"
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

            <p className="mb-0 mt-2">User</p>
            <Input
              placeholder="provide a user"
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

            <p className="mb-0 mt-2">Language</p>
            <Select
              showSearch
              placeholder="choose a language"
              defaultValue={formik.values.language}
              labelInValue
              style={{
                width: 261,
              }}
              onChange={(value: any) => formik.setFieldValue('language', value.value)}
              value={formik.values.language}
            >
              <Option value="">All</Option>
              <Option value="ruby">Ruby</Option>
              <Option value="go">Go</Option>
              <Option value="javascript">TypeScript</Option>
            </Select>

            <Button htmlType="submit" type="primary" className="mt-2">
              Submit
            </Button>
          </Space>
        </form>
      </div>
      <div className="d-flex justify-content-center">
        <Table
          size="large"
          style={{ width: '50%' }}
          loading={loading}
          columns={columns}
          dataSource={data?.items}
          pagination={{
            total: totalCount,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onChange: (page, pageSize) => {
              fetchResults(
                formik.values.codeName,
                formik.values.user,
                formik.values.language,
                page,
                pageSize,
              );
            },
            showSizeChanger: true,
            position: ['bottomCenter'],
          }}
        />
      </div>
    </>
  );
};
