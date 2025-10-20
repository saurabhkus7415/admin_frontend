import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Table, Card, Typography, Spin, Alert } from 'antd';

const { Title, Text } = Typography;

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/students')
      .then((res: any) => setStudents(res.data || res))
      .catch((e: any) => setError(e.message || 'Failed to fetch students'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Student ID', dataIndex: 'student_id', key: 'student_id' },
    { title: 'Class', dataIndex: 'class', key: 'class' },
    { title: 'School Code', dataIndex: 'school_code', key: 'school_code' },
    { title: 'createdAt', dataIndex: 'createdAt', key: 'createdAt' },

  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Title level={4}>Students</Title>
        <Text type="secondary">Total: {students.length}</Text>
      </div>

      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={students}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ y: 400, x: 'max-content' }}
          />
        )}
      </Card>
    </div>
  );
}
