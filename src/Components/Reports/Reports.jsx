import React, { useState } from "react";
import GroupReports from "./GroupReports";
import UserReports from "./UserReports";
import ApprovalReports from "./ApprovalReports";

function Reports() {
  const [selectedStatus, setSelectedStatus] = useState("Group Reports");
  const renderSelectedComponent = () => {
    switch (selectedStatus) {
      case "Group Reports":
        return <GroupReports />;
      case "Assigned User Reports":
        return <UserReports />;
      case "Approval Reports":
        return <ApprovalReports />;
      default:
        return null;
    }
  };

  return (
    <div>
      <header className="bg-gray-100 lg:rounded-lg rounded-[3px] px-2 flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="bg-blue-50  lg:rounded-lg rounded-[3px] overflow-x-auto">
            <div className="flex  items-center overflow-x-auto gap-4 h-14 w-max">
              {[
                "Group Reports",
                "Assigned User Reports",
                "Approval Reports",
              ].map((status) => (
                <button
                  key={status}
                  className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 lg:rounded-lg rounded-[3px] ${
                    selectedStatus === status
                      ? "bg-blue-500 text-white"
                      : "bg-blue-200 text-black"
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-2">
        <div className="lg:rounded-lg rounded-[3px]">
          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  );
}

export default Reports;
