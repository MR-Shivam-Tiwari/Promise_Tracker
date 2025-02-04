import moment from 'moment';
import React from 'react';

const Logs = ({ log }) => {
  const time = moment(log?.timestamp).format('Do MMMM [at] hh:mm A')
  const renderLogMessage = () => {
    switch (log.action) {
      case 'create':
        return (
          <>
            <div className='mb-2 mt-2'>
              <p className='text-gray-600'>
                <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> created task
                <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {time}
              </p>
              <span className='font-bold text-md ml-4'>Assigned To :</span>
              <span className='font-bold text-gray-600'> {
                log?.details?.member?.map((user, index) => { return (user?.name) }).join(', ')}</span>
            </div>
            <hr />
          </>
        );
      case 'assign':
        return (
          <p>
            <span className='font-bold'>"{log?.userId?.name}"</span> assigned task
            <span className='font-bold'> {log?.taskId?.taskName}</span> to
            <span className='font-bold'> {log?.details?.assignedUser}</span> on
            {time}
          </p>
        );
      case 'complete':
        return (
          <p>
            <span className='font-bold'>{log?.userId?.name}</span> completed task
            <span className='font-bold'> {log?.taskId?.taskName}</span> on
            {time}
          </p>
        );
      case 'reject':
        return (
          <p>
            <span className='font-bold'>{log?.userId?.name}</span> rejected task
            <span className='font-bold'> {log?.taskId?.taskName}</span> on
            {time}
          </p>
        );
      case 'approve':
        return (
          <p>
            <span className='font-bold'>{log?.userId?.name}</span> approved task
            <span className='font-bold'> {log?.taskId?.taskName}</span> on
            {time}
          </p>
        );
      case 'edit':
        return (
          <>
            {log?.details?.changes?.taskName && <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> udpate Task Name to
              <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {time}
            </div>}
            <hr />
            {log?.details?.changes?.description && <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> udpate Task Name to
              <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {time}
            </div>}
            <hr />
            {log?.details?.changes?.audioFile && <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> udpate Task Name to
              <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {time}
            </div>}
            <hr />
            {log?.details?.changes?.startDate && <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> udpate Task Name to
              <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {time}
            </div>}
            <hr />
            {log?.details?.changes?.endDate && <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> udpate Task Name to
              <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {time}
            </div>}
            <hr />

            {log?.details?.changes?.people && <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> udpate Task Name to
              <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {time}
            </div>}
            <hr />
            {log?.details?.changes?.pdfFile && <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> udpate Task Name to
              <span className='font-bold text-orange-500'> "{log?.taskId?.taskName}"</span> on {time}
            </div>}
            <hr />
          </>
        );
      case 'changeStatus':
        return (
          <>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '>change Status </span>
              <span className='font-bold text-orange-500'> "{log?.details?.fromStatus || "Todo"}"</span> to <span className='font-bold text-green-500'> "{log?.details?.toStatus || "Todo"}"</span> on {time}
            </div>
            <hr />
          </>
        );
      case 'reject_postponed':
        return (
          <>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-red-500'>Reject</span>  Postponed </span>  on {time}
            </div>
            <hr />
          </>
        );
      case 'approved_postponed':
        return (
          <>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-green-500'>Approve</span>  Postponed </span>  on {time}
            </div>
            <hr />
          </>
        );
      case 'apply_postponed':
        return (
          <>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-green-500'>Apply </span>For Postponed </span>  on {time}
            </div>
            <hr />
          </>
        );
      case 'unapproved':
        return (
          <>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-red-500'>Unapprove </span>this Task </span>  on {time}
            </div>
            <hr />
          </>
        );
      case 'approved':
        return (
          <>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '><span className='font-bold text-green-500'>Approve </span>this Task </span>  on {time}
            </div>
            <hr />
          </>
        );
      // subTask logs started here
      case 'create_subtask':
        return (
          <>
            <div className='mb-2 mt-2'>
              <p className='text-gray-600'>
                <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> created Sub-Task
                <span className='font-bold text-orange-500 capitalize'> "{log?.details?.subTaskName}"</span> on {time}
              </p>
              <span className='font-bold text-md ml-4'>Assigned To :</span>
              <span className='font-bold text-gray-600'> {
                log?.details?.assign_to?.map((user, index) => { return (user?.name) }).join(', ')}</span>
            </div>
            <hr />
          </>
        );
      case 'edit_subtask':
        return (
          <>
            <div className='mb-2 mt-2'>
              <p className='text-gray-600'>
                <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> udpate Sub-Task
                <span className='font-bold text-orange-500 capitalize'> "{log?.details?.subTaskName}"</span> on {time}
              </p>
              <span className='font-bold text-md ml-4'>Assigned To :</span>
              <span className='font-bold text-gray-600'> {
                log?.details?.assign_to?.map((user, index) => { return (user?.name) }).join(', ')}</span>
            </div>
            <hr />
          </>
        );
      case 'create_comment':
        return (
          <>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-gray-500 '>Add a comment<span className='font-semibold text-orange-500'>{` "${log?.details?.text}"`}</span> </span>  on {time}
            </div>
            <hr />
          </>
        );
      case 'done_subtask':
        return (
          <>
            <div className='mb-2 mt-2'>
              <p className='text-gray-600'>
                <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> change subtask
                <span className='font-bold text-orange-500 capitalize'> "{log?.details?.subTaskName}"</span> status to <span className='font-bold text-green-500'>Done</span> on {time}
              </p>

            </div>
            <hr />
          </>
        );
      case 'pending_subtask':
        return (
          <>
            <div className='mb-2 mt-2'>
              <p className='text-gray-600'>
                <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> change subtask
                <span className='font-bold text-orange-500 capitalize'> "{log?.details?.subTaskName}"</span> status to <span className='font-bold text-red-500'>Pending</span> on {time}
              </p>

            </div>
            <hr />
          </>
        );
      default:
        return <p>Unknown action</p>;
    }
  };

  const EditLogs = () => {
    return (
      <>
        {log?.details?.changes?.taskName && (
          <div className='px-2 py-1 bg-purple-100 rounded-lg mb-4'>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> updated Task Name from <span className='font-bold text-orange-500'>{log?.details?.changes?.taskName?.oldValue}</span> to
              <span className='font-bold text-green-500'> "{log?.details?.changes?.taskName?.newValue}"</span> on {time}
            </div>
            <hr />
          </div>
        )}

        {log?.details?.changes?.description && (
          <div className='px-2 py-1 bg-purple-100 rounded-lg mb-4'>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> updated Description to
              <span className='font-bold text-orange-500' dangerouslySetInnerHTML={{ __html: `${log?.details?.changes?.description}` }}></span> on {time}
            </div>
            <hr />
          </div>
        )}

        {log?.details?.changes?.audioFile && (
          <div className='px-2 py-1 bg-purple-100 rounded-lg mb-4'>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='text-black font-bold capitalize'>{log?.details?.changes?.audioFile?.status}</span> Audio File  on {time}
            </div>
            <hr />
          </div>
        )}

        {log?.details?.changes?.startDate && (
          <div className='px-2 py-1 bg-purple-100 rounded-lg mb-4'>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> change Start Date to <span className='text-black font-bold '>{log?.details?.changes?.startDate}</span> on {time}
            </div>
            <hr />
          </div>
        )}

        {log?.details?.changes?.endDate && (
          <div className='px-2 py-1 bg-purple-100 rounded-lg mb-4'>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> change End Date to <span className='text-black font-bold '>{log?.details?.changes?.endDate}</span> on {time}

            </div>
            <hr />
          </div>
        )}

        {log?.details?.changes?.people?.added && (
          <div className='px-2 py-1 bg-purple-100 rounded-lg mb-4'>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> added
              {
                log?.details?.changes?.people?.added?.map((i) => (
                  <>
                    <span className='font-semibold text-green-600 py-1  bg-green-300 mx-1 rounded-xl '> {i.name} </span>
                  </>
                ))
              } on task assignment
              on {time}
            </div>
            <hr />
          </div>
        )}

        {log?.details?.changes?.people?.removed && (
          <div className='px-2 py-1 bg-purple-100 rounded-lg mb-4'>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> removed
              {
                log?.details?.changes?.people?.removed?.map((i) => (
                  <>
                    <span className='font-semibold text-red-600 py-1  bg-red-300 mx-1 rounded-xl '> {i.name} </span>
                  </>
                ))
              } on task assignment
              on {time}
            </div>
            <hr />
          </div>
        )}

        {log?.details?.changes?.pdfFile && (
          <div className='px-2 py-1 bg-purple-100 rounded-lg mb-4'>
            <div className='text-gray-600 mt-2 mb-2'>
              <span className='font-bold text-blue-500'>"{log?.userId?.name}"</span> <span className='font-bold text-black capitalize'>{log?.details?.changes?.pdfFile?.status}</span>  File on {time}
            </div>
            <hr />
          </div>
        )}
      </>
    );
  };


  return (
    <>
      {log?.action == "edit" ? <EditLogs /> : <div className='px-2 py-1  bg-purple-100 rounded-lg mb-4'>
        {renderLogMessage()}
      </div>}
    </>
  );
};

export default Logs;
