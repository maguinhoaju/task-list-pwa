"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import TaskModal from '@/components/taskModal';

export default function OpenTaskModalButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className="bg-blue-500 text-white rounded p-6 m-6 text-xl" onClick={() => setIsOpen(true)}>Nova Tarefa</Button>
      <TaskModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}