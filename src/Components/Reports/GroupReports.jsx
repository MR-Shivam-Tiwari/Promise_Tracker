import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function TaskDetailsTable({ tasks }) {
  return (
    <table className="w-full text-sm text-left text-gray-500  bg-gray-100">
      <thead className="text-xs text-gray-700 uppercase bg-blue-200 ">
        <tr>
          <th scope="col" className="px-6 py-3">
            Task Name
          </th>
          <th scope="col" className="px-6 py-3">
            Description
          </th>
          <th scope="col" className="px-6 py-3">
            Start Date
          </th>
          <th scope="col" className="px-6 py-3">
            End Date
          </th>
          <th scope="col" className="px-6 py-3">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} className="bg-white border-b">
            <td className="px-6 py-4">{task.taskName}</td>
            <td className="px-6 py-4">
              {/* <div dangerouslySetInnerHTML={task.description} /> */}
              <div
                dangerouslySetInnerHTML={{
                  __html: (task?.description),
                }}
              />
            </td>
            <td className="px-6 py-4">{task.startDate}</td>
            <td className="px-6 py-4">{task.endDate}</td>
            <td className="px-6 py-4">{task.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GroupReports() {
  const [groupreport, setGroupReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/tasksByGroup`
        );
        const responseData = response.data;
        console.log("API Response:", responseData);

        const filteredData = responseData.filter((item) => item._id !== null);

        if (Array.isArray(filteredData)) {
          const sortedData = filteredData.sort((a, b) => {
            const nameA = a._id.groupName || "";
            const nameB = b._id.groupName || "";
            return nameA.localeCompare(nameB);
          });

          const dataWithUniqueKeys = sortedData.map((group, index) => ({
            ...group,
            uniqueKey: `${group._id.groupId}_${index}`,
          }));

          setGroupReport(dataWithUniqueKeys);
          setLoading(false);
        } else {
          console.error("Invalid API response format:", responseData);
          setLoading(false);
        }
      } catch (error) {
        console.log("Error Fetching Task ", error);
        setLoading(false);
      }
    };

    fetchGroupData();
  }, []);

  const toggleRowExpansion = (uniqueKey) => {
    setExpandedRows((prev) => ({ ...prev, [uniqueKey]: !prev[uniqueKey] }));
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Group Tasks");
  
    // Add headers
    sheet.addRow([
      "Group Name",
      "Total Tasks",
      "In Progress Tasks",
      "Completed Tasks",
      "Postponed Tasks",
      "Archived Tasks",
    ]);
  
    // Style headers
    sheet.getRow(1).font = { bold: true, size: 12 };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };
  
    // Function to strip HTML tags
    const stripHtml = (html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
    };
  
    // Function to add tasks to the sheet
    const addTasksToSheet = (tasks, status) => {
      if (tasks.length > 0) {
        // Add status header row
        const statusRow = sheet.addRow([`${status} Tasks`]);
        statusRow.font = { bold: true, size: 11 };
        statusRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "f3fab4" }, // Light gray background
        };
  
        // Add column headers
        const headerRow = sheet.addRow([
          "Task Name",
          "Description",
          "Start Date",
          "End Date",
          "Status",
        ]);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "9da9fc" }, // Slightly lighter gray for headers
        };
  
        // Add task rows with alternating gray background
        tasks.forEach((task, index) => {
          const taskRow = sheet.addRow([
            task.taskName,
            stripHtml(task.description), // Strip HTML tags from the description
            task.startDate,
            task.endDate,
            task.status,
          ]);
          if (index % 2 === 0) {
            taskRow.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF0F0F0" }, // Very light gray for even rows
            };
          }
        });
  
        sheet.addRow([]); // Add an empty row for spacing
      }
    };
  
    // Add data for each group
    groupreport.forEach((group) => {
      // Add group summary
      sheet.addRow([
        group._id.groupName,
        group.totalTasks,
        group.inProgressTasks,
        group.completedTasks,
        group.cancelledTasks,
        group.archivedTasks,
      ]);
  
      // Style group summary row
      const groupRow = sheet.lastRow;
      groupRow.font = { bold: true };
      groupRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF0F0F0" },
      };
  
      // Add tasks for the group
      addTasksToSheet(group.inProgressTaskDetails, "In Progress");
      addTasksToSheet(group.completedTaskDetails, "Completed");
      addTasksToSheet(group.cancelledTaskDetails, "Postponed");
      addTasksToSheet(group.archivedTaskDetails, "Archived");
  
      // Add an empty row for better readability between groups
      sheet.addRow([]);
    });
  
    // Auto-fit columns
    sheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
  
    // Generate and download the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "group_tasks_report.xlsx");
  };
  

  return (
    <div className="">
      <div className="flex justify-end p-2 lexend-bold">
        <button
          className={`inline-flex gap-2 items-center bg-blue-200 justify-center text-black whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            loading ? "pointer-events-none opacity-50" : ""
          } border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md`}
          onClick={downloadExcel}
          disabled={loading}
        >
          Download Excel
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-file-earmark-spreadsheet"
            viewBox="0 0 16 16"
          >
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h3v1a1 1 0 0 1-1 1h-2zm3-3h-3v-2h3v2zm-7 0v-2h3v2H6z" />
          </svg>
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md text-black bg-white lg:rounded-lg rounded-[3px]">
        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <span className="loader"></span>
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 bg-gray-200">
            <thead className="text-xs text-gray-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Group Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Task
                </th>
                <th scope="col" className="px-6 py-3">
                  In Progress Task
                </th>
                <th scope="col" className="px-6 py-3">
                  Completed Task
                </th>
                <th scope="col" className="px-6 py-3">
                  Postponed Task
                </th>
                <th scope="col" className="px-6 py-3">
                  Archived Task
                </th>
              </tr>
            </thead>
            <tbody>
              {groupreport.map((group) => (
                <React.Fragment key={group.uniqueKey}>
                  <tr
                    className="bg-white border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRowExpansion(group.uniqueKey)}
                  >
                    <td className="px-6 py-4 font-medium text-black whitespace-nowrap flex items-center">
                      {expandedRows[group.uniqueKey] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {group._id.groupName}
                    </td>
                    <td className="px-6 py-4">{group.totalTasks}</td>
                    <td className="px-6 py-4">{group.inProgressTasks}</td>
                    <td className="px-6 py-4">{group.completedTasks}</td>
                    <td className="px-6 py-4">{group.cancelledTasks}</td>
                    <td className="px-6 py-4">{group.archivedTasks}</td>
                  </tr>
                  {expandedRows[group.uniqueKey] && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="space-y-4">
                          {group.inProgressTasks > 0 && (
                            <div>
                              <div className="flex ">
                                <h4 className="font-semibold mb-2 p-1 rounded-sm text-white  bg-gray-400">
                                  In Progress Tasks
                                </h4>{" "}
                              </div>
                              <TaskDetailsTable
                                tasks={group.inProgressTaskDetails}
                              />
                            </div>
                          )}
                          {group.completedTasks > 0 && (
                            <div>
                              <div className="flex ">
                                <h4 className="font-semibold mb-2 p-1 rounded-sm text-white  bg-gray-400">
                                  Completed Tasks
                                </h4>
                              </div>
                              <TaskDetailsTable
                                tasks={group.completedTaskDetails}
                              />
                            </div>
                          )}
                          {group.cancelledTasks > 0 && (
                            <div>
                              <div className="flex ">
                                <h4 className="font-semibold mb-2 p-1 rounded-sm text-white  bg-gray-400">
                                  Postponed Tasks
                                </h4>{" "}
                              </div>
                              <TaskDetailsTable
                                tasks={group.cancelledTaskDetails}
                              />
                            </div>
                          )}
                          {group.archivedTasks > 0 && (
                            <div>
                              <div className="flex ">
                                <h4 className="font-semibold mb-2 p-1 rounded-sm text-white  bg-gray-400">
                                  Archived Tasks
                                </h4>
                              </div>
                              <TaskDetailsTable
                                tasks={group.archivedTaskDetails}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default GroupReports;
