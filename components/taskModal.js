"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
    addTaskToFirestore,
    getTasksFromFirestore,
  } from "@/public/utils/firebase";
  import { addTask, getTasks } from "@/public/utils/indexedDb";
  

export default function TaskModal({ open, onOpenChange }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("")
  const [dateTime, setDateTime] = useState(new Date())
  const [completed, setCompleted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !dateTime) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }
    // Aqui você pode adicionar a lógica para salvar a tarefa
    console.log({ title, dateTime, completed })
    handleAddTask()
  }

  const handleAddTask = async (e) => {
//    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title,
      date: new Date(dateTime).toISOString(),
      completed,
      synced: navigator.onLine,
    };

    try {
      if (navigator.onLine) {
        const tasksFromFirestore = await getTasksFromFirestore();
        const exists = tasksFromFirestore.some(
          (task) =>
            task.title === newTask.title &&
            task.date === newTask.date &&
            task.completed === newTask.completed
        );
        if (!exists) {
          await addTaskToFirestore(newTask);
        }
      }
      await addTask(newTask);
      loadTasks();
    } catch (error) {
      console.error("Erro ao adicionar nova tarefa:", error);
    }

    setTitle("");
    setDateTime("");
    setCompleted(false);
    onOpenChange(false)
  };

  const handleClose = () => {
    setTitle("")
    setDateTime(new Date())
    setCompleted(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Descrição*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite a descrição da tarefa"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateTime">Data e Hora* </Label>
            <DatePicker
              id="dateTime"
              selected={dateTime}
              onChange={(date) => setDateTime(date)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="completed" checked={completed} onCheckedChange={setCompleted} />
            <Label htmlFor="completed">Completo</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button className="bg-blue-500 text-white rounded" type="submit">Adicionar tarefa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}