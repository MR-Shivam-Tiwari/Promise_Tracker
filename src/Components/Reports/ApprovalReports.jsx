import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/joy/IconButton";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(props.initialOpen || false);

  return (
    <>
      <tr>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>
        <td scope="row">{row.user.name}</td>
        <td>{row.taskCounts.total}</td>
        <td>{row.taskCounts.inProgress}</td>
        <td>{row.taskCounts.completed}</td>
        <td>{row.taskCounts.cancelled}</td>
      </tr>
      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={6}>
          {open && row.groupData && Object.keys(row.groupData).length > 0 && (
            <Sheet
              variant="soft"
              sx={{
                p: 1,
                pl: 6,
                boxShadow: "inset 0 3px 6px 0 rgba(0 0 0 / 0.08)",
              }}
            >
              <Table
              className="lexend-bold"
                borderAxis="bothBetween"
                size="sm"
                aria-label="purchases"
                sx={{
                  "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)": { textAlign: "right" },
                  "--TableCell-paddingX": "0.5rem",
                }}
              >
                <thead className="bg-gray-200">
                  <tr className="">
                    <th>Group Name</th>
                    <th>TOTAL TASK</th>
                    <th>IN PROGRESS TASK</th>
                    <th>COMPLETED TASK</th>
                    <th>POSTPONED TASK</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(row.groupData).map((groupKey, index) => {
                    let groupName = "";
                    try {
                      const match = groupKey.match(/groupName:\s*'([^']+)'/);
                      if (match) {
                        groupName = match[1];
                      }
                    } catch (error) {
                      console.error("Error extracting group name:", error);
                    }
                    const group = row.groupData[groupKey];
                    return (
                      <tr key={index}>
                        <td>{groupName}</td>
                        <td>{group.totalTasks}</td>
                        <td>{group.inProgressTasks}</td>
                        <td>{group.completedTasks}</td>
                        <td>{group.cancelledTasks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Sheet>
          )}
        </td>
      </tr>
    </>
  );
}

Row.propTypes = {
  initialOpen: PropTypes.bool,
  row: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    taskCounts: PropTypes.shape({
      total: PropTypes.number.isRequired,
      inProgress: PropTypes.number.isRequired,
      completed: PropTypes.number.isRequired,
      cancelled: PropTypes.number.isRequired,
    }).isRequired,
    groupData: PropTypes.object.isRequired,
  }).isRequired,
};

function ApprovalReports() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + "/api/allusertask");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const convertToCSV = () => {
    const csvRows = [
      "User Name,Total Task,In progress Task,Completed Task,Cancelled Task,Group Name,Group Total Task,Group In Progress Task,Group Completed Task,Group Cancelled Task",
    ];

    userData.forEach((user) => {
      const userName = user.user.name;
      const userTaskCounts = user.taskCounts;
      const userCSVRow = [
        userName,
        userTaskCounts.total,
        userTaskCounts.inProgress,
        userTaskCounts.completed,
        userTaskCounts.cancelled,
        "",
        "",
        "",
        "",
        "",
      ];
      csvRows.push(userCSVRow.join(","));
      Object.keys(user.groupData).forEach((groupName) => {
        const group = user.groupData[groupName];
        const groupCSVRow = [
          "",
          "",
          "",
          "",
          "",
          groupName,
          group.totalTasks,
          group.inProgressTasks,
          group.completedTasks,
          group.cancelledTasks,
        ];
        csvRows.push(groupCSVRow.join(","));
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "group_reports.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-center items-center mt-20">
          <span className="loader"></span>
        </div>
      </div>
    );
  }

  if (!userData || !Array.isArray(userData) || userData.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <Sheet>
      <div className="flex justify-end p-2 lexend-bold   relative overflow-x-auto">
        <button
          className={`inline-flex gap-2 text-gray-800 items-center justify-center bg-blue-200  whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md`}
          onClick={convertToCSV}
        >
          Download File
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-file-earmark-arrow-down"
            viewBox="0 0 16 16"
          >
            <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto lexend-bold">
        <Table
          className="relative overflow-x-auto w-full"
          aria-label="collapsible table"
          sx={{
            "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)": { textAlign: "right" },
            '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]': { borderBottom: 0 },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 100 }}>Groups</th>
              <th>User Name</th>
              <th>TOTAL TASK</th>
              <th>IN PROGRESS TASK</th>
              <th>COMPLETED TASK</th>
              <th>POSTPONED TASK</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((row, index) => (
              <Row key={index} row={row} initialOpen={index === 0} />
            ))}
          </tbody>
        </Table>
      </div>
    </Sheet>
  );
}

export default ApprovalReports;
