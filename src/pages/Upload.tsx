import React, { useState } from "react";
import {
  Button,
  Radio,
  Upload as AntdUpload,
  Card,
  Table,
  Typography,
  Alert,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import { api } from "../lib/api";

const { Title, Text } = Typography;

function validateHeaders(headers: string[], required: string[]) {
  const lower = headers.map((h) => h.trim().toLowerCase());
  return required.every((r) => lower.includes(r));
}

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"students" | "teachers">("students");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const requiredMap: Record<string, string[]> = {
    students: ["name", "class", "academic_year", "student_id", "school_code"],
    teachers: [
      "name",
      "teacher_id",
      "academic_year",
      "school_code",
      "designation",
    ],
  };
function filterEmptyRows(rows: any[]) {
  return rows.filter((row) =>
    Object.values(row).some((value) => value !== null && value !== undefined && String(value).trim() !== "")
  );
}
  const checkAndUpload = async () => {
    if (!file) {
      setMsg("⚠️ Please select a file first");
      setIsError(true);
      return;
    }

    const name = file.name.toLowerCase();
    setMsg("");
    setPreview([]);
    setIsError(false);

    // CSV validation
    if (name.endsWith(".csv")) {
      const text = await file.text();
      const parsed = Papa.parse(text, { preview: 1, header: true });
      const headers = parsed.meta.fields || [];

      if (!validateHeaders(headers, requiredMap[type])) {
        setMsg("⚠️ Missing required headers: " + requiredMap[type].join(", "));
        setIsError(true);
        return;
      }
    }

    // XLSX validation is server-side, unsupported types are rejected
    if (!name.endsWith(".csv") && !name.endsWith(".xlsx")) {
      setMsg("⚠️ Unsupported file type. Only CSV or XLSX allowed.");
      setIsError(true);
      return;
    }

    const form = new FormData();
    form.append("file", file);

    try {
      setUploading(true);
      const res = await api("/api/upload/" + type, {
        method: "POST",
        body: form,
      });

      // Backend validation errors
      if (res.error) {
        let errorMsg = `❌ Upload failed: ${res.error}`;

        if (res.invalid && Array.isArray(res.invalid)) {
          const details = res.invalid
            .map(
              (row: any) =>
                `Row ${row.row}: ${row.errors.join(
                  ", "
                )}\nData: ${JSON.stringify(row.data)}`
            )
            .join("\n\n");
          errorMsg += "\n\n" + details;
        }

        setMsg(errorMsg);
        setIsError(true);
        return;
      }

      // Success
      setMsg("✅ Upload successful: " + JSON.stringify(res));
      setIsError(false);

      // Preview first 5 rows for CSV
      if (name.endsWith(".csv")) {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true });
        const filtered = filterEmptyRows(parsed.data);
        setPreview(filtered.slice(0, 5));
      }
    } catch (err: any) {
      setMsg("❌ Upload failed: " + (err.message || JSON.stringify(err)));
      setIsError(true);
    } finally {
      setUploading(false);
    }
  };

  // Columns for preview table
  const columns = preview[0]
    ? Object.keys(preview[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key,
        render: (val: any) => <Text>{String(val)}</Text>,
      }))
    : [];

  return (
    <Card
      style={{ maxWidth: 800, margin: "40px auto" }}
      title={<Title level={3}>Upload CSV / XLSX</Title>}
    >
      <Radio.Group
        onChange={(e) => setType(e.target.value)}
        value={type}
        style={{ marginBottom: 16 }}
      >
        <Radio value="students">Students</Radio>
        <Radio value="teachers">Teachers</Radio>
      </Radio.Group>

      <AntdUpload
        beforeUpload={(file) => {
          setFile(file);
          return false;
        }}
        accept=".csv,.xlsx"
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </AntdUpload>

      <Button
        type="primary"
        onClick={checkAndUpload}
        loading={uploading}
        style={{ marginTop: 16, display: "block" }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>

      {msg && (
        <Alert
          message={msg}
          type={isError ? "error" : "success"}
          showIcon
          style={{ marginTop: 16, whiteSpace: "pre-wrap" }}
        />
      )}

      {preview.length > 0 && (
        <Table
          dataSource={preview.map((row, i) => ({ key: i, ...row }))}
          columns={columns}
          pagination={false}
          bordered
          style={{ marginTop: 24 }}
          size="small"
        />
      )}

      <Text
        type="secondary"
        style={{ display: "block", marginTop: 12, fontSize: 12 }}
      >
        CSV header validation is performed client-side. XLSX files are validated
        on the server.
      </Text>
    </Card>
  );
}
