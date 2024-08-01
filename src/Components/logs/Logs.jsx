import moment from 'moment';
import React from 'react';

const Logs = ({ log }) => {
  const renderLogMessage = () => {
    switch (log.action) {
      case 'create':
        return (
         <>
             <div className='mb-2 mt-2'>
             <p className='text-gray-600'>
            <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> created task 
            <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {moment(log?.timestamp).format('DD-MM-YYYY')}
          </p>
            <span className='font-bold text-md ml-4'>Assigned To :</span>
                <span className='font-bold text-gray-600'> {
                    log?.details?.member?.map((user, index) => {return (user?.name)}).join(', ')}</span>
             </div>
           <hr/>
         </>
        );
      case 'assign':
        return (
          <p>
            <span className='font-bold'>"{log?.userId?.name}"</span> assigned task 
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
             <>
                 <div className='text-gray-600 mt-2 mb-2'>
                <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> edit task 
                <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {moment(log?.timestamp).format('DD-MM-YYYY')}
              </div>
              <hr/>
             </>
            );
            case 'changeStatus':
              return (
               <>
                   <div className='text-gray-600 mt-2 mb-2'>
                  <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '>change Status </span>
                  <span className='font-bold text-orange-500'> "{log?.details?.fromStatus || "Todo"}"</span> to <span className='font-bold text-green-500'> "{log?.details?.toStatus || "Todo"}"</span> on {moment(log?.timestamp).format('DD-MM-YYYY')}
                </div>
                <hr/>
               </>
              );
              case 'reject_postponed':
                return (
                 <>
                     <div className='text-gray-600 mt-2 mb-2'>
                    <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-red-500'>Reject</span>  Postponed </span>  on {moment(log?.timestamp).format('DD-MM-YYYY')}
                  </div>
                  <hr/>
                 </>
                );
                case 'approved_postponed':
                  return (
                   <>
                       <div className='text-gray-600 mt-2 mb-2'>
                      <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-green-500'>Approve</span>  Postponed </span>  on {moment(log?.timestamp).format('DD-MM-YYYY')}
                    </div>
                    <hr/>
                   </>
                  );
                  case 'apply_postponed':
                  return (
                   <>
                       <div className='text-gray-600 mt-2 mb-2'>
                      <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-green-500'>Apply </span>For Postponed </span>  on {moment(log?.timestamp).format('DD-MM-YYYY')}
                    </div>
                    <hr/>
                   </>
                  );
                  
                  case 'unapproved':
                  return (
                   <>
                       <div className='text-gray-600 mt-2 mb-2'>
                      <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-red-500'>Unapprove </span>this Task </span>  on {moment(log?.timestamp).format('DD-MM-YYYY')}
                    </div>
                    <hr/>
                   </>
                  );
                  case 'approved':
                  return (
                   <>
                       <div className='text-gray-600 mt-2 mb-2'>
                      <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-green-500'>Approve </span>this Task </span>  on {moment(log?.timestamp).format('DD-MM-YYYY')}
                    </div>
                    <hr/>
                   </>
                  );
      default:
        return <p>Unknown action</p>;
    }
  };

  return (
    <div className='px-2 py-1  bg-purple-100 rounded-lg mb-4'>
      {renderLogMessage()}
    </div>
  );
};

export default Logs;
