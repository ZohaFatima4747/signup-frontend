import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken"); // backend must return this
    if (!refreshToken) return null;

    try {
      const response = await fetch(`http://localhost:1000/api/v1/contact/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token); // update new access token
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

      // ⚠️ If expired OR missing → try refresh
      if (!token) {
        token = await refreshAccessToken();
        if (!token) return; // still null → user must login again
      }

      const res = await fetch(`http://localhost:1000/api/v1/contact/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If token expired (401) → refresh again
      if (res.status === 401) {
        token = await refreshAccessToken();
        if (!token) return;

        // Retry request
        const retry = await fetch(`http://localhost:1000/api/v1/contact/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const retryData = await retry.json();
        setUsers(Array.isArray(retryData) ? retryData : retryData.users || []);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) setUsers(data);
      else if (data.users && Array.isArray(data.users)) setUsers(data.users);
      else setUsers([]);
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
    <div style={{ backgroundColor: "#cce3de", padding: "50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#b0c4b1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <h2>All Registered Users</h2>
      <table
        border="1"
        cellPadding="10"
        cellSpacing="05"
        style={{ width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td style={{ paddingLeft: "10px", width: "20%" }}>
                  {user.name}
                </td>
                <td style={{ paddingLeft: "10px", width: "20%" }}>
                  {user.email}
                </td>
                <td style={{ paddingLeft: "10px", width: "20%" }}>
                  {user.role}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
