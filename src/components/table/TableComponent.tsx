import React from 'react';

import { Table } from 'antd';
import { FormikProps } from 'formik';

import { github } from '../../assets';
import { MyValues } from '../app/App';
import { ModalWithImage } from '../modal/Modal';

type TableComponentPropsType = {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  loading: boolean;
  data: any;
  totalCount: number;
  formik: FormikProps<MyValues>;
  setPage: (arg: number) => void;
  setPageSize: (arg: number) => void;
  fetchResults: (
    codeName: string,
    user: string,
    language: string,
    currentPage: number,
    size: number,
  ) => void;
};

export const TableComponent = ({
  isOpen,
  setIsOpen,
  loading,
  data,
  totalCount,
  formik,
  setPage,
  setPageSize,
  fetchResults,
}: TableComponentPropsType) => {
  const columns = [
    {
      title: 'File name',
      dataIndex: 'name',
      align: 'left' as 'left',
      width: '25%',
      key: Math.random().toString(),
    },
    {
      title: 'Avatar',
      dataIndex: ['repository', 'owner', 'avatar_url'],
      align: 'center' as 'center',
      width: '10%',
      key: Math.random().toString(),
      render: (el: string) => (
        <>
          <button
            type="button"
            style={{ background: 'transparent', border: 'none' }}
            onClick={() => setIsOpen(true)}
          >
            <img src={el} alt="avatar" className="avatar" />
          </button>
          <ModalWithImage isOpen={isOpen} setIsOpen={setIsOpen} avatar={el} />
        </>
      ),
    },
    {
      title: 'Description',
      dataIndex: ['repository', 'description'],
      align: 'center' as 'center',
      key: Math.random().toString(),
      render: (el: string) => (!el ? '—' : el),
    },
    {
      title: 'Owner',
      dataIndex: ['repository', 'owner', 'login'],
      align: 'center' as 'center',
      width: '20%',
      key: Math.random().toString(),
    },
    {
      title: 'Github',
      dataIndex: 'html_url',
      align: 'center' as 'center',
      width: '10%',
      key: Math.random().toString(),
      render: (el: string) => (
        <a href={el} target="_blank" rel="noreferrer" className="pl-5">
          <img src={github} alt="github" className="avatar" />
        </a>
      ),
    },
  ];
  return (
    <>
      <h3 className="d-flex justify-content-center">Search result</h3>
      <div className="d-flex justify-content-center">
        <Table
          style={{ width: '70%' }}
          scroll={{ x: true }}
          loading={loading}
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            total: totalCount,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            current: formik.values.page,
            pageSize: formik.values.pageSize,
            onChange: (current, size) => {
              setPage(current);
              setPageSize(size);
              // eslint-disable-next-line no-param-reassign
              formik.values.page = current;
              // eslint-disable-next-line no-param-reassign
              formik.values.pageSize = size;
              fetchResults(
                formik.values.codeName,
                formik.values.user,
                formik.values.language,
                current,
                size,
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
