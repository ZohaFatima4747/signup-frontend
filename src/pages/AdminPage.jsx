import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch(
        `https://signup-backend-ten.vercel.app/api/v1/contact/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        return data.token;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await refreshAccessToken();
        if (!token) return;
      }

      const res = await fetch(
        `https://signup-backend-ten.vercel.app/api/v1/contact/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        token = await refreshAccessToken();
        if (!token) return;

        const retry = await fetch(
          `https://signup-backend-ten.vercel.app/api/v1/contact/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const retryData = await retry.json();
        setUsers(Array.isArray(retryData) ? retryData : retryData.users || []);
        return;
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <div className="admin-container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2>All Registered Users</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-container {
          padding: 20px;
          background-color: #cce3de;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .logout-btn {
          background-color: #b0c4b1;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 10px 20px;
          cursor: pointer;
          margin-top: 10px;
        }

        h1 {
          margin: 0;
        }

        h2 {
          margin-top: 30px;
          margin-bottom: 10px;
        }

        .table-wrapper {
          overflow-x: auto; /* Horizontal scroll on small devices */
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 400px;
        }

        th,
        td {
          padding: 10px;
          border: 1px solid #888;
          text-align: left;
        }

        @media (max-width: 600px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .logout-btn {
            width: 100%;
          }

          th,
          td {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
