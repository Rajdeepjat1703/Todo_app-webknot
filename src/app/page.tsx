'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Link from 'next/link'
import { Sun, Moon } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Load todos from localStorage on mount
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }

    // Check user's preferred color scheme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    // Save todos to localStorage whenever they change
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    // Apply dark mode class to body
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    const todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    setTodos([todo, ...todos])
    setNewTodo('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(todos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTodos(items)
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">TODO</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        <form onSubmit={addTodo} className="mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Create a new todo..."
            className="w-full p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                {filteredTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150`}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="w-5 h-5 mr-4"
                        />
                        <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.text}
                        </span>
                        <Link
                          href={`/Todo/${todo.id}`}
                          className="px-3 py-1 text-sm text-blue-500 hover:text-blue-600 mr-2"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-between items-center mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-sm">
          <span>{todos.filter(t => !t.completed).length} items left</span>
          <div className="space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-2 py-1 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : ''}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2 py-1 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : ''}`}
            >
              Completed
            </button>
          </div>
          <button
            onClick={clearCompleted}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  )
}