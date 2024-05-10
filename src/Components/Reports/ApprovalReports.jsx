import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import IconButton from '@mui/joy/IconButton';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// function createData(name, calories, fat, carbs, protein, price) {
//     return {
//         name,
//         calories,
//         fat,
//         carbs,
//         protein,
//         price,
//         history: [
//             {
//                 date: '2020-01-05',
//                 customerId: '11091700',
//                 amount: 3,
//             },
//             {
//                 date: '2020-01-02',
//                 customerId: 'Anonymous',
//                 amount: 1,
//             },
//         ],
//     };
// }

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
                    {open && row.groupData && row.groupData.length > 0 && ( // Add check for row.history
                        <Sheet
                            variant="soft"
                            sx={{ p: 1, pl: 6, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)' }}
                        >
                            
                            <Table
                                borderAxis="bothBetween"
                                size="sm"
                                aria-label="purchases"
                                sx={{
                                    '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
                                        { textAlign: 'right' },
                                    '--TableCell-paddingX': '0.5rem',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th >Group Name</th>
                                        <th>TOTAL TASK	</th>
                                        <th>IN PROGRESS TASK	</th>
                                        <th>COMPLETED TASK	</th>
                                        <th>CANCELLED TASK</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.groupData.map((historyRow , index) => (
                                        <tr key={index}>
                                            <th scope="row">{historyRow.name}</th>
                                            <td>{historyRow.totalTasks}</td>
                                            <td>{historyRow.inProgressTasks}</td>
                                            <td>{historyRow.completedTasks}</td>
                                            <td>{historyRow.cancelledTasks}</td>
                                           
                                        </tr>
                                    ))}
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
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

function ApprovalReports() {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/allassignuser');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUserData(data);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Render loading indicator while fetching data
    }

    if (!userData || !Array.isArray(userData) || userData.length === 0) {
        return <div>No data available.</div>; // Handle case where userData is empty or not an array
    }

    return (
        <Sheet>
            <Table
                aria-label="collapsible table"
                sx={{
                    '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
                        { textAlign: 'right' },
                    '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
                    {
                        borderBottom: 0,
                    },
                }}
            >
                <thead>
                    <tr>
                        {/* <th style={{ width: 40 }} aria-label="empty" /> */}
                        <th style={{ width: 100 }} >Groups</th>
                        <th >User Name</th>
                        <th>TOTAL TASK	</th>
                        <th>IN PROGRESS TASK	</th>
                        <th>COMPLETED TASK	</th>
                        <th>CANCELLED TASK</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((row, index) => (
                        <Row key={index} row={row} initialOpen={index === 0} />
                    ))}
                </tbody>
            </Table>
        </Sheet>
    );
}


export default ApprovalReports;