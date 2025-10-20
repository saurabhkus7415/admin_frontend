import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  Card,
  Table,
  Button,
  Modal,
  Typography,
  Spin,
  Alert,
  Input,
  message,
} from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Approvals() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectId, setRejectId] = useState<any>(null);
  const [rejectRemarks, setRejectRemarks] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await api("/api/approvals/pending");
      setItems(res.data || res);
    } catch (e: any) {
      setError(e.message || "Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: any) => {
    Modal.confirm({
      title: "Confirm Approval",
      content: "Are you sure you want to approve this request?",
      onOk: async () => {
        try {
          await api(`/api/approvals/${id}/approve`, { method: "POST" });
          message.success("Approved successfully!");
          load();
        } catch (e: any) {
          setError(e.message || "Approval failed");
        }
      },
    });
  };

  const handleReject = (id: any) => {
    setRejectId(id);
    setRejectRemarks("");
    setRejectModalVisible(true);
  };

  const submitReject = async () => {
    if (!rejectRemarks.trim()) {
      message.error("Please enter a valid reason for rejection");
      return;
    }
    try {
      await api(`/api/approvals/${rejectId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks: rejectRemarks }),
      });
      message.success("Rejected successfully!");
      setRejectModalVisible(false);
      load();
    } catch (e: any) {
      setError(e.message || "Reject failed");
    }
  };

  const openModal = (data: any) => {
    setModalData(data);
    setModalVisible(true);
  };

  const renderJSON = (data: any) => {
    if (typeof data !== "object" || data === null)
      return <span>{String(data)}</span>;
    return (
      <ul style={{ paddingLeft: 16 }}>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <Text strong>{key}:</Text>{" "}
            {typeof value === "object" && value !== null
              ? renderJSON(value)
              : String(value)}
          </li>
        ))}
      </ul>
    );
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "entity_type", key: "entity_type" },
    {
      title: "Data",
      dataIndex: "data_fields",
      key: "data_fields",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => openModal(record.data_fields)}>
          View JSON
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" onClick={() => handleApprove(record.id)}>
            Approve
          </Button>
          <Button danger onClick={() => handleReject(record.id)}>
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Pending Approvals
      </Title>

      {error && (
        <Alert
          type="error"
          message={error}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            scroll={{ y: 400, x: "max-content" }}
            dataSource={items}
            rowKey="id"
            bordered
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* JSON Modal */}
      <Modal
        title="Approval Data"
        open={modalVisible}
        footer={<Button onClick={() => setModalVisible(false)}>Close</Button>}
        onCancel={() => setModalVisible(false)}
        width={700}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {modalData ? renderJSON(modalData) : <span>No data</span>}
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        title="Reject Approval"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={submitReject}
        okText="Submit"
      >
        <Text>Enter reason for rejection:</Text>
        <TextArea
          value={rejectRemarks}
          onChange={(e) => setRejectRemarks(e.target.value)}
          rows={4}
          placeholder="Enter remarks..."
          style={{ marginTop: 8 }}
        />
      </Modal>
    </div>
  );
}
