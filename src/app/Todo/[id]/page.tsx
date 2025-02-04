'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export default function TodoDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [todo, setTodo] = useState<Todo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState('')

  useEffect(() => {
    if (params.id) {
      const todos = JSON.parse(localStorage.getItem('todos') || '[]')
      const foundTodo = todos.find((t: Todo) => t.id === params.id)
      if (foundTodo) {
        setTodo(foundTodo)
        setEditedText(foundTodo.text)
      }
    }
  }, [params.id])

  if (!todo) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const handleUpdate = () => {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]')
    const updatedTodos = todos.map((t: Todo) =>
      t.id === params.id ? { ...t, text: editedText } : t
    )
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    setTodo({ ...todo, text: editedText })
    setIsEditing(false)
  }

  const handleDelete = () => {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]')
    const updatedTodos = todos.filter((t: Todo) => t.id !== params.id)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    router.push('/')
  }

  const toggleComplete = () => {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]')
    const updatedTodos = todos.map((t: Todo) =>
      t.id === params.id ? { ...t, completed: !t.completed } : t
    )
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    setTodo({ ...todo, completed: !todo.completed })
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
            >
              ← Back to list
            </Link>
            <span className="text-sm text-gray-500">
              Created: {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </div>

          {isEditing ? (
            <div className="mb-4">
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="mt-2 space-x-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h2 className={`text-xl ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </h2>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Edit
            </button>
            <button
              onClick={toggleComplete}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}