
import { useEffect, useState } from "react";
import "./App.css";

const API = "/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  async function loadStudents() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Không tải được dữ liệu");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({ studentId: "", name: "", email: "" });
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Thao tác thất bại");
      }

      setMessage(editingId
        ? "Cập nhật sinh viên thành công!"
        : "Thêm sinh viên thành công!"
      );

      resetForm();
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleEdit(student) {
    setEditingId(student._id);
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
    setMessage("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Không thể xóa sinh viên");
      }

      setMessage("Đã xóa sinh viên thành công!");
      if (editingId === id) resetForm();
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>QUẢN LÝ SINH VIÊN</h1>
        <p>Cloud Computing Laboratory - MERN Stack</p>
      </header>

      <section className="card">
        <h2>{editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="studentId"
            placeholder="Mã sinh viên"
            value={form.studentId}
            onChange={handleChange}
            required
          />

          <input
            name="name"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="actions">
            <button type="submit">
              {editingId ? "Lưu thay đổi" : "Thêm sinh viên"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="card">
        <div className="list-header">
          <h2>Danh sách sinh viên ({students.length})</h2>
          <button onClick={loadStudents}>Làm mới</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>MSSV</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <button onClick={() => handleEdit(student)}>
                      Sửa
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(student._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan="5">Chưa có sinh viên nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
