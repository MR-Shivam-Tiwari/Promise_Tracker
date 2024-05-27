import { Button, CardContent, Chip, Dropdown, IconButton, Menu, MenuButton, MenuItem, Modal, ModalDialog, Sheet, Typography } from '@mui/joy';
import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModalClose from '@mui/joy/ModalClose';
import ViewTask from '../ViewTask';
import EditTask from '../EditTask';
const ItemTypes = {
    CARD: 'card',
};

const Section = ({ title, cards, moveCard }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop(item, monitor) {
            moveCard(item.id, title);
        },
    });

    return (
        <div className="flex flex-col mt-5  gap-4 rounded-lg border h-[700px] w-full" ref={drop}>
            <div className="flex items-center justify-between bg-gray-100 px-4 py-3 ">
                <h3 className="text-lg font-medium">{title}</h3>
                <div className="inline-flex w-fit items-center whitespace-nowrap border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground rounded-full px-3 py-1 text-sm">
                    {cards.length}
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 p-4  overflow-y-scroll">
                {cards.map((card) => (


                    <Card key={card._id} card={card} id={card._id} text={card.taskName} status={card.status} />
                ))}
            </div>
        </div>
    );
};

const Card = ({ id, text, status, card }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);
    const [edit, setedit] = React.useState(false);
    const handleClick = (option) => {
        setSelectedOption(option);
        setShowOptions(false);

        // Navigate to corresponding page based on selected option
        switch (option) {
            case 'Option1':
                navigate('/option1');
                break;
            case 'Option2':
                navigate('/option2');
                break;
            case 'Option3':
                navigate('/option3');
                break;
            default:
                break;
        }
    };
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.5 : 1;

    const startDate = new Date(card.startDate);
    // Get day of the month
    const day = startDate.getDate();
    // Get abbreviated month name
    const month = startDate.toLocaleString('default', { month: 'short' });
    const endDate = new Date(card.endDate);
    const endday = endDate.getDate();
    const endMonth = endDate.toLocaleString('default', { month: 'short' })
    return (
        <div ref={drag} style={{ opacity }}>
            {/* {text} - {status} */}
            <div className="flex-1 shadow-md flex flex-col gap-4  border bg-blue-50 p-4 rounded" >
                <div className='mb-1 flex justify-between items-center font-bold text-xs'>
                    <p>{card?.taskName}</p>
                    <div>
                        <Dropdown>
                            <MenuButton
                                className="rounded-[50%]"
                                slots={{ root: IconButton }}
                                slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" style={{ color: "black" }} height="13" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                </svg>
                            </MenuButton>

                            <Menu className=''>
                                <MenuItem onClick={() => setedit(true)}>Edit</MenuItem>
                                <MenuItem onClick={() => setOpen(true)}>View</MenuItem>
                            </Menu>
                        </Dropdown>
                        <Modal
                            aria-labelledby="modal-title"
                            aria-describedby="modal-desc"
                            open={edit}
                            onClose={() => setedit(false)}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Sheet
                                className='overflow-auto bg-white '
                                sx={{
                                    
                                    borderRadius: 'md',
                                    boxShadow: 'lg',
                                }}
                            >
                                <ModalClose variant="plain" sx={{ m: 1 }} />

                                <div >

                                    <EditTask  setedit = {setedit} task={card} Taskid={id} />
                                </div>
                            </Sheet>
                        </Modal>
                        <Modal
                            aria-labelledby="modal-title"
                            aria-describedby="modal-desc"
                            open={open}
                            onClose={() => setOpen(false)}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Sheet
                                className='overflow-auto bg-white h-[700px]'
                                sx={{
                                    width: 1200,
                                    height: 800,
                                    borderRadius: 'md',
                                    boxShadow: 'lg',
                                }}
                            >
                                <ModalClose variant="plain" sx={{ m: 1 }} />

                                <div >

                                    <ViewTask task={card} />
                                </div>
                            </Sheet>
                        </Modal>
                    </div>
                </div>
                <div className="flex items-start">
                    <p className='text-sm mt-2 flex  gap-1 bg-gray-200 text-black border px-1 rounded-lg'>
                        <svg width="20px" height="20px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg">
                            <defs></defs>
                            <title>alarm</title>
                            <path d="M16,28A11,11,0,1,1,27,17,11,11,0,0,1,16,28ZM16,8a9,9,0,1,0,9,9A9,9,0,0,0,16,8Z" />
                            <polygon points="18.59 21 15 17.41 15 11 17 11 17 16.58 20 19.59 18.59 21" />
                            <rect fill="#000000" x="3.96" y="5.5" width="5.07" height="2" transform="translate(-2.69 6.51) rotate(-45.06)" />
                            <rect fill="#000000" x="24.5" y="3.96" width="2" height="5.07" transform="translate(2.86 19.91) rotate(-44.94)" />
                            <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" fill="none" width="32" height="32" />
                        </svg>

                        {day} {month} - {endday} {endMonth}
                    </p>
                </div>

                <div className='flex justify-between mt-1 items-center'>
                    <div className='flex font-bold text-gray-500 text-sm'>

                        <svg fill="#808080" width="20px" className='' height="20px" viewBox="-3 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <title>group</title>
                            <path d="M20.906 20.75c1.313 0.719 2.063 2 1.969 3.281-0.063 0.781-0.094 0.813-1.094 0.938-0.625 0.094-4.563 0.125-8.625 0.125-4.594 0-9.406-0.094-9.75-0.188-1.375-0.344-0.625-2.844 1.188-4.031 1.406-0.906 4.281-2.281 5.063-2.438 1.063-0.219 1.188-0.875 0-3-0.281-0.469-0.594-1.906-0.625-3.406-0.031-2.438 0.438-4.094 2.563-4.906 0.438-0.156 0.875-0.219 1.281-0.219 1.406 0 2.719 0.781 3.25 1.938 0.781 1.531 0.469 5.625-0.344 7.094-0.938 1.656-0.844 2.188 0.188 2.469 0.688 0.188 2.813 1.188 4.938 2.344zM3.906 19.813c-0.5 0.344-0.969 0.781-1.344 1.219-1.188 0-2.094-0.031-2.188-0.063-0.781-0.188-0.344-1.625 0.688-2.25 0.781-0.5 2.375-1.281 2.813-1.375 0.563-0.125 0.688-0.469 0-1.656-0.156-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.25-2.313 1.438-2.719 1-0.375 2.125 0.094 2.531 0.938 0.406 0.875 0.188 3.125-0.25 3.938-0.5 0.969-0.406 1.219 0.156 1.375 0.125 0.031 0.375 0.156 0.719 0.313-1.375 0.563-3.25 1.594-4.219 2.188zM24.469 18.625c0.75 0.406 1.156 1.094 1.094 1.813-0.031 0.438-0.031 0.469-0.594 0.531-0.156 0.031-0.875 0.063-1.813 0.063-0.406-0.531-0.969-1.031-1.656-1.375-1.281-0.75-2.844-1.563-4-2.063 0.313-0.125 0.594-0.219 0.719-0.25 0.594-0.125 0.688-0.469 0-1.656-0.125-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.219-2.313 1.406-2.719 1.031-0.375 2.156 0.094 2.531 0.938 0.406 0.875 0.25 3.125-0.188 3.938-0.5 0.969-0.438 1.219 0.094 1.375 0.375 0.125 1.563 0.688 2.75 1.313z"></path>
                        </svg>
                        {card?.taskGroup}
                    </div>
                    <Chip className='text-xs border' variant="soft" color={
                        card.status === 'In Progress' ? 'warning' :
                            card.status === 'Completed' ? 'success' :
                                card.status === 'Cancelled' ? 'danger' :
                                    'neutral'
                    }>
                        {card.status || 'Unapproved'}
                    </Chip>


                </div>
            </div>
        </div>
    );
};

const DragAndDropComponent = ({ tasksToDo, tasksCancelled, tasksCompleted, tasksInProgress }) => {
    const [sections, setSections] = useState({
        'Todo': tasksToDo,
        'In Progress': tasksInProgress,
        'Completed': tasksCompleted,
        'Cancelled': tasksCancelled,
    });

    useEffect(() => {
        setSections({
            'Todo': tasksToDo,
            'In Progress': tasksInProgress,
            'Completed': tasksCompleted,
            'Cancelled': tasksCancelled,
        });
    }, [tasksToDo, tasksInProgress, tasksCompleted, tasksCancelled]);

    const updateTaskStatus = async (taskId, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }

            const updatedTask = await response.json();
            toast.success("Task Status Updated")
            return updatedTask;
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error('Error updating task status:', error);
            throw error;
        }
    };

    const moveCard = async (id, toSection) => {
        const newSections = { ...sections };
        const fromSection = Object.keys(newSections).find(section => newSections[section].find(card => card._id === id));

        if (fromSection !== toSection) {
            try {
                let updatedStatus = toSection === 'Todo' ? '' : toSection; // Set status to '' for 'Todo', otherwise use the section name
                const updatedTask = await updateTaskStatus(id, updatedStatus);
                const cardToMove = newSections[fromSection].find((card) => card._id === id);
                newSections[fromSection] = newSections[fromSection].filter((card) => card._id !== id);
                newSections[toSection] = [...newSections[toSection], cardToMove];

                // Update card's status with section name
                cardToMove.status = toSection;

                setSections(newSections);
            } catch (error) {
                console.error('Error moving card:', error);
            }
        }
    };


    return (
        <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-4 gap-6 h-full" style={{ display: 'flex' }}>
                {Object.entries(sections).map(([title, cards]) => (
                    <Section key={title} title={title} cards={cards} moveCard={moveCard} />
                ))}
            </div>
        </DndProvider>
    );
};

export default DragAndDropComponent;
