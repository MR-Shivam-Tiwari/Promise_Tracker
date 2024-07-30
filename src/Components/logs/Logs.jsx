import moment from 'moment';
import React from 'react';

const Logs = ({ log }) => {
  const renderLogMessage = () => {
    switch (log.action) {
      case 'create':
        return (
         <>
             <p>
            <span className='font-bold text-blue-500'>{log?.userId?.name}</span> created task 
            <span className='font-bold text-orange-500'> {log?.taskId?.taskName}</span> on {moment(log?.timestamp).format('DD-MM-YYYY')}
          </p>
            <span className='font-bold text-md'>Assigned To :</span>
                <span className='font-bold text-gray-600'> {
                    log?.details?.member?.map((user, index) => {return (user?.name)}).join(', ')}</span>
           <hr/>
         </>
        );
      case 'assign':
        return (
          <p>
            <span className='font-bold'>{log?.userId?.name}</span> assigned task 
            <span className='font-bold'> {log?.taskId?.taskName}</span> to 
            <span className='font-bold'> {log?.details?.assignedUser}</span> on 
            {moment(log?.timestamp).format('DD-MM-YYYY')}
          </p>
        );
      case 'complete':
        return (
          <p>
            <span className='font-bold'>{log?.userId?.name}</span> completed task 
            <span className='font-bold'> {log?.taskId?.taskName}</span> on 
            {moment(log?.timestamp).format('DD-MM-YYYY')}
          </p>
        );
      case 'reject':
        return (
          <p>
            <span className='font-bold'>{log?.userId?.name}</span> rejected task 
            <span className='font-bold'> {log?.taskId?.taskName}</span> on 
            {moment(log?.timestamp).format('DD-MM-YYYY')}
          </p>
        );
      case 'approve':
        return (
          <p>
            <span className='font-bold'>{log?.userId?.name}</span> approved task 
            <span className='font-bold'> {log?.taskId?.taskName}</span> on 
            {moment(log?.timestamp).format('DD-MM-YYYY')}
          </p>
        );
        case 'edit':
            return (
              <p>
                <span className='font-bold'>{log?.userId?.name}</span> edit task 
                <span className='font-bold'> {log?.taskId?.taskName}</span> on 
                {moment(log?.timestamp).format('DD-MM-YYYY')}
              </p>
            );
      default:
        return <p>Unknown action</p>;
    }
  };

  return (
    <div>
      {renderLogMessage()}
    </div>
  );
};

export default Logs;
