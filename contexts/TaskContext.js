'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { addTask, getTasks } from '../public/utils/indexedDb';
import { addTaskToFirestore, getTasksFromFirestore } from '../public/utils/firebase';

// Criação do Contexto
const TaskContext = createContext();

// React Hook para usar o TaskContext
export const useTaskContext = () => {
    return useContext(TaskContext);
};

// Componente Provider
export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                // Obter tarefas do IndexedDB
                const tasksFromDB = await getTasks();
                
                // Obter tarefas do Firebase se estiver online
                if (navigator.onLine) {
                    const tasksFromFirestore = await getTasksFromFirestore();
                    
                    // Mesclar tarefas do IndexedDB com Firebase
                    // Criação de um Map para garantir que não haja duplicações
                    const tasksMap = new Map();
                    
                    tasksFromDB.forEach(task => tasksMap.set(task.id, task));
                    tasksFromFirestore.forEach(task => tasksMap.set(task.id, task));
                    
                    // Converter o Map de volta para um array
                    const mergedTasks = Array.from(tasksMap.values());
                    
                    // Atualizar o estado com as tarefas mescladas
                    setTasks(mergedTasks);
                    
                    // Atualizar IndexedDB com as tarefas do Firestore
                    await Promise.all(mergedTasks.map(task => addTask(task)));
                } else {
                    // Atualizar o estado com as tarefas do IndexedDB
                    setTasks(tasksFromDB);
                }
            } catch (error) {
                console.error("Erro ao carregar e mesclar tarefas:", error);
            }
        };

        loadTasks();
    }, []);

    const addNewTask = async (task) => {
        try {
            if (navigator.onLine) {
                await addTaskToFirestore(task); // Salvar no Firebase
            } else {
                await addTask(task); // Adicionar ao IndexedDB
            }
            
            // Recarregar e mesclar tarefas após adicionar uma nova tarefa
            await loadTasks();
        } catch (error) {
            console.error("Erro ao adicionar nova tarefa:", error);
        }
    };

    return (
        <TaskContext.Provider value = {{ tasks, addNewTask }}>
            {children}
        </TaskContext.Provider>
    );
};
