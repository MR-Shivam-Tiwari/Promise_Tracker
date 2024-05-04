import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';

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
        <div className="flex flex-col gap-4 rounded-lg border h-full w-full" ref={drop}>
            <div className="flex items-center justify-between bg-gray-100 px-4 py-3 ">
                <h3 className="text-lg font-medium">{title}</h3>
                <div className="inline-flex w-fit items-center whitespace-nowrap border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground rounded-full px-3 py-1 text-sm">
                    {cards.length}
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 p-4">
                {cards.map((card) => (
                    <Card key={card.id} id={card.id} text={card.taskName} />
                ))}
            </div>
        </div>
    );
};

const Card = ({ id, text }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: { id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
        <div ref={drag} style={{ opacity, border: '1px solid black', padding: '10px', margin: '5px 0' }}>
            {text}
        </div>
    );
};

const DragAndDropComponent = () => {
    const [tasks, setTasks] = useState([]);
    const [sections, setSections] = useState({
        'Todo': [],
        'In Progress': [],
        'Completed': [],
        'Canceled': [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Update sections based on tasks
        const todoTasks = tasks;
        const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
        const completedTasks = tasks.filter(task => task.status === 'Completed');
        const canceledTasks = tasks.filter(task => task.status === 'Canceled');

        setSections({
            'Todo': todoTasks,
            'In Progress': [],
            'Completed': [],
            'Canceled': [],
        });
    }, [tasks]);

    const moveCard = (id, toSection) => {
        // Find the card with the given id
        const cardToMove = tasks.find(task => task.id === id);
    
        if (!cardToMove) {
            console.error(`Card with id ${id} not found`);
            return;
        }
    
        // Update tasks state to remove the card from its current section
        const updatedTasks = tasks.filter(task => task.id !== id);
    
        // Update the status of the card to the new section
        cardToMove.status = toSection;
    
        // Update tasks state to add the card to the new section
        const updatedTasksWithMovedCard = [...updatedTasks, cardToMove];
        setTasks(updatedTasksWithMovedCard);
    };
    

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-4 gap-6 h-full" style={{ display: 'flex' }}>
                {Object.entries(sections).map(([title, cards]) => (
                    <Section
                        key={title}
                        title={title}
                        cards={cards}
                        moveCard={moveCard}
                    />
                ))}
            </div>
        </DndProvider>
    );
};

export default DragAndDropComponent;
