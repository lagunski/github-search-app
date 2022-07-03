import React from 'react';

import { Button, Input, Select, Space } from 'antd';

export const Form = ({ formik }: any) => (
  <div className="d-flex justify-content-center py-5">
    <form onSubmit={formik.handleSubmit}>
      <Space direction="vertical" className="gap-1">
        <p className="mb-0 mt-2">Phrase</p>
        <Input
          placeholder="provide a phrase"
          allowClear
          autoComplete="off"
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
          autoComplete="off"
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
          style={{
            width: 261,
          }}
          onChange={(value: any) => formik.setFieldValue('language', value)}
          value={formik.values.language}
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="ruby">Ruby</Select.Option>
          <Select.Option value="go">Go</Select.Option>
          <Select.Option value="javascript">JavaScript</Select.Option>
        </Select>

        <Button htmlType="submit" type="primary" className="mt-2">
          Submit
        </Button>
      </Space>
    </form>
  </div>
);
