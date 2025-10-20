// import React, { useEffect, useState } from "react";
// import { api } from "../lib/api";
// import { Table, Card, Modal, Button, Typography, Spin, Alert, Tag } from "antd";

// const { Title } = Typography;

// export default function Audit() {
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalData, setModalData] = useState<any>(null);

//   useEffect(() => {
//     api("/api/audit-trail")
//       .then((res: any) => setItems(res.data || res))
//       .catch((e: any) => setError(e.message || "Failed to fetch audit data"))
//       .finally(() => setLoading(false));
//   }, []);

//   const openModal = (record: any) => {
//     let data: any = null;
//     try {
//       if (typeof record.entity_id === "string") {
//         data = JSON.parse(record.entity_id);
//       } else {
//         data = record.entity_id;
//       }
//     } catch (err) {
//       data = record.entity_id;
//     }
//     setModalData(data);
//     setModalVisible(true);
//   };

//   const renderJSONAsTable = (data: any) => {
//     if (!data || (Array.isArray(data) && data.length === 0)) return <span>No data</span>;

//     if (Array.isArray(data) && typeof data[0] === "object") {
//       const columns = Object.keys(data[0]).map((key) => ({
//         title: key,
//         dataIndex: key,
//         key,
//         render: (value: any) => (value === null ? "-" : String(value)),
//       }));

//       return (
//         <Table
//           columns={columns}
//           dataSource={data}
//           rowKey={(record) => record.id || JSON.stringify(record)}
//           pagination={false}
//           bordered
//           scroll={{ y: 400, x: "max-content" }}
//         />
//       );
//     }

//     if (typeof data === "object") {
//       const rows = Object.entries(data).map(([key, value]) => ({
//         key,
//         value: typeof value === "object" && value !== null ? JSON.stringify(value) : String(value),
//       }));

//       return (
//         <Table
//           columns={[
//             { title: "Field", dataIndex: "key", key: "key" },
//             { title: "Value", dataIndex: "value", key: "value" },
//           ]}
//           dataSource={rows}
//           rowKey="key"
//           pagination={false}
//           bordered
//           scroll={{ y: 400, x: "max-content" }}
//         />
//       );
//     }

//     return <span>{String(data)}</span>;
//   };

//   // Format timestamp
//   const formatDateTime = (ts: string) => {
//     if (!ts) return "-";
//     const date = new Date(ts);
//     return new Intl.DateTimeFormat("en-GB", {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: false,
//     }).format(date);
//   };

//   const columns = [
//     { title: "ID", dataIndex: "id", key: "id" },
//     {
//       title: "Action",
//       dataIndex: "action",
//       key: "action",
//       render: (text: string) =>
//         text === "approve" ? (
//           <Tag color="green">Approved</Tag>
//         ) : text === "reject" ? (
//           <Tag color="red">Rejected</Tag>
//         ) : (
//           <Tag>{text}</Tag>
//         ),
//     },
//     { title: "Entity", dataIndex: "entity_type", key: "entity_type", render: (text: string) => <Tag color="blue">{text}</Tag> },
//     {
//       title: "Details",
//       key: "entity_data",
//       render: (_: any, record: any) => <Button type="link" onClick={() => openModal(record)}>View</Button>,
//     },
//     { title: "User", dataIndex: "user_id", key: "user_id" },
//     { title: "Remarks", dataIndex: "remarks", key: "remarks" },
//     {
//       title: "Time",
//       dataIndex: "timestamp",
//       key: "timestamp",
//       render: (_: any, record: any) => formatDateTime(record.timestamp || record.created_at),
//     },
//   ];

//   return (
//     <div>
//       <Title level={4} style={{ marginBottom: 16 }}>Audit Trail</Title>

//       {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}

//       <Card>
//         {loading ? (
//           <div style={{ textAlign: "center", padding: 50 }}>
//             <Spin size="large" />
//           </div>
//         ) : (
//           <Table
//             columns={columns}
//             dataSource={items}
//             rowKey="id"
//             bordered
//             pagination={{ pageSize: 10 }}
//             scroll={{ y: 400, x: "max-content" }}
//           />
//         )}
//       </Card>

//       <Modal
//         title="Entity Data"
//         open={modalVisible}
//         footer={<Button onClick={() => setModalVisible(false)}>Close</Button>}
//         onCancel={() => setModalVisible(false)}
//         width={800}
//         bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
//       >
//         {renderJSONAsTable(modalData)}
//       </Modal>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Table, Card, Modal, Button, Typography, Spin, Alert, Tag } from "antd";

const { Title } = Typography;

export default function Audit() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    api("/api/audit-trail")
      .then((res: any) => setItems(res.data || res))
      .catch((e: any) => setError(e.message || "Failed to fetch audit data"))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (record: any) => {
    let data: any = null;
    try {
      const rawData = record.entity_id || record.data_fields;

      if (typeof rawData === "string") {
        data = JSON.parse(rawData);
      } else {
        data = rawData;
      }

      if (Array.isArray(data) && data.length === 1) {
        data = data[0];
      }
    } catch (err) {
      data = record.entity_id || record.data_fields;
    }

    setModalData(data);
    setModalVisible(true);
  };

  const renderJSONAsTable = (data: any) => {
    if (!data) return <span>No Data Available</span>;

    if (Array.isArray(data)) {
      if (data.length === 0) return <span>No Data</span>;
      return (
        <Table
          columns={Object.keys(data[0]).map((key) => ({
            title: key,
            dataIndex: key,
            key,
            render: (value: any) =>
              typeof value === "object" ? JSON.stringify(value, null, 2) : String(value),
          }))}
          dataSource={data}
          rowKey={(record) => record.id || JSON.stringify(record)}
          pagination={false}
          bordered
          scroll={{ y: 400, x: "max-content" }}
        />
      );
    }

    if (typeof data === "object") {
      const rows = Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === "object" && value !== null ? JSON.stringify(value, null, 2) : String(value),
      }));

      return (
        <Table
          columns={[
            { title: "Field", dataIndex: "key", key: "key" },
            { title: "Value", dataIndex: "value", key: "value" },
          ]}
          dataSource={rows}
          rowKey="key"
          pagination={false}
          bordered
          scroll={{ y: 400, x: "max-content" }}
        />
      );
    }

    return <span>{String(data)}</span>;
  };

  const formatDateTime = (ts: string) => {
    if (!ts) return "-";
    const date = new Date(ts);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: string) =>
        text === "approve" ? (
          <Tag color="green">Approved</Tag>
        ) : text === "reject" ? (
          <Tag color="red">Rejected</Tag>
        ) : (
          <Tag>{text}</Tag>
        ),
    },
    {
      title: "Entity",
      dataIndex: "entity_type",
      key: "entity_type",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Details",
      key: "entity_data",
      render: (_: any, record: any) => <Button type="link" onClick={() => openModal(record)}>View</Button>,
    },
    { title: "User", dataIndex: "user_id", key: "user_id" },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (_: any, record: any) => formatDateTime(record.timestamp || record.created_at),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Audit Trail</Title>

      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}

      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={items}
            rowKey="id"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ y: 400, x: "max-content" }}
          />
        )}
      </Card>

      <Modal
        title="Entity Data"
        open={modalVisible}
        footer={<Button onClick={() => setModalVisible(false)}>Close</Button>}
        onCancel={() => setModalVisible(false)}
        width={800}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {renderJSONAsTable(modalData)}
      </Modal>
    </div>
  );
}
