import React, { useEffect, useState } from 'react';

import 'antd/dist/antd.css';
import './App.css';
import axios from 'axios';
import { FormikProps, useFormik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { Form } from '../form/Form';
import { TableComponent } from '../table/TableComponent';

export type MyValues = {
  codeName: string;
  user: string;
  language: string;
  page: number;
  pageSize: number;
};

export const App = () => {
  const API_URL = 'https://api.github.com';

  const [data, setData] = useState<any>();
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchResults = async (
    codeName: string,
    user: string,
    language: string,
    currentPage: number,
    size: number,
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/search/code?q=${codeName}+user:${user}+language:${language}&per_page=${size}&page=${currentPage}`,
      );
      setData(res.data);
      setTotalCount(res.data.total_count);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      toast.warning(e.response.data.message);
    }
  };

  type FormikErrorType = {
    codeName?: string;
    user?: string;
  };

  const formik: FormikProps<MyValues> = useFormik<MyValues>({
    initialValues: {
      codeName: '',
      user: '',
      language: '',
      page,
      pageSize,
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

  useEffect(() => {
    if (formik.values.codeName || formik.values.user) {
      fetchResults(
        formik.values.codeName,
        formik.values.user,
        formik.values.language,
        formik.values.page,
        formik.values.pageSize,
      );
    }
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem('codeName') && window.localStorage.getItem('user')) {
      formik.values.codeName = window.localStorage.getItem('codeName') as string;
      formik.values.user = window.localStorage.getItem('user') as string;
      formik.values.language = window.localStorage.getItem('language') as string;
      formik.values.page = Number(window.localStorage.getItem('page') as string);
      formik.values.pageSize = Number(window.localStorage.getItem('pageSize') as string);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('codeName', formik.values.codeName);
    window.localStorage.setItem('user', formik.values.user);
    window.localStorage.setItem('language', formik.values.language);
    window.localStorage.setItem('page', String(formik.values.page));
    window.localStorage.setItem('pageSize', String(formik.values.pageSize));
  }, [
    formik.values.codeName,
    formik.values.user,
    formik.values.language,
    formik.values.page,
    formik.values.pageSize,
  ]);

  return (
    <>
      <Form formik={formik} />
      <TableComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loading={loading}
        data={data?.items}
        totalCount={totalCount}
        formik={formik}
        setPage={setPage}
        setPageSize={setPageSize}
        fetchResults={fetchResults}
      />
      <ToastContainer autoClose={2000} />
    </>
  );
};
