'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  Plus, 
  Droplets, 
  Scissors, 
  Bug, 
  Shovel,
  Leaf,
  CloudRain,
  Trash2,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  text: string
  completed: boolean
  icon: string
  autoStrikeOnRain?: boolean
}

const defaultTasks: Task[] = [
  { id: '1', text: 'Water the garden', completed: false, icon: 'water', autoStrikeOnRain: true },
  { id: '2', text: 'Pull weeds from flower beds', completed: false, icon: 'weed' },
  { id: '3', text: 'Check for pests', completed: false, icon: 'pest' },
  { id: '4', text: 'Harvest ripe tomatoes', completed: false, icon: 'harvest' },
  { id: '5', text: 'Fertilize container plants', completed: false, icon: 'fertilize' },
]

const taskIcons: Record<string, React.ReactNode> = {
  water: <Droplets className="h-4 w-4 text-blue-500" />,
  weed: <Scissors className="h-4 w-4 text-amber-600" />,
  pest: <Bug className="h-4 w-4 text-red-500" />,
  harvest: <Leaf className="h-4 w-4 text-emerald-500" />,
  fertilize: <Sparkles className="h-4 w-4 text-purple-500" />,
  plant: <Shovel className="h-4 w-4 text-amber-700" />,
  default: <CheckCircle2 className="h-4 w-4 text-primary" />,
}

interface TaskListProps {
  isRainy?: boolean
  compact?: boolean
}

export function TaskList({ isRainy = false, compact = false }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [newTask, setNewTask] = useState('')

  // Stored in localStorage for the demo, but this represents real task data that should map to care_tasks.
  useEffect(() => {
    const saved = localStorage.getItem('gardenTasks')
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch {
        setTasks(defaultTasks)
      }
    }
  }, [])

  // Keep current demo behavior unchanged during the audit.
  useEffect(() => {
    localStorage.setItem('gardenTasks', JSON.stringify(tasks))
  }, [tasks])

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      icon: 'default',
      autoStrikeOnRain: newTask.toLowerCase().includes('water')
    }
    
    setTasks([...tasks, task])
    setNewTask('')
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const completedCount = tasks.filter(t => t.completed || (t.autoStrikeOnRain && isRainy)).length
  const totalCount = tasks.length

  // Compact mode - just show first 3 tasks
  if (compact) {
    const displayTasks = tasks.slice(0, 3)
    return (
      <div className="space-y-2">
        {displayTasks.map((task) => {
          const isAutoCompleted = task.autoStrikeOnRain && isRainy
          const isCompleted = task.completed || isAutoCompleted
          
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-all",
                isCompleted 
                  ? "bg-muted/50" 
                  : "bg-accent/20"
              )}
            >
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => !isAutoCompleted && toggleTask(task.id)}
                disabled={isAutoCompleted}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
              />
              
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {taskIcons[task.icon] || taskIcons.default}
                <span className={cn(
                  "text-sm truncate",
                  isCompleted && "line-through text-muted-foreground"
                )}>
                  {task.text}
                </span>
              </div>

              {isAutoCompleted && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs shrink-0">
                  <CloudRain className="h-3 w-3" />
                  Rain
                </Badge>
              )}
            </div>
          )
        })}
        {tasks.length > 3 && (
          <p className="text-xs text-muted-foreground text-center pt-1">
            +{tasks.length - 3} more tasks
          </p>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Mom&apos;s Task List
          </span>
          <Badge variant="outline" className="font-normal">
            {completedCount}/{totalCount} done
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rainy day banner */}
        {isRainy && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <CloudRain className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Rainy day! Watering tasks are auto-completed.
            </span>
          </div>
        )}

        {/* Task list */}
        <div className="space-y-2">
          {tasks.map((task) => {
            const isAutoCompleted = task.autoStrikeOnRain && isRainy
            const isCompleted = task.completed || isAutoCompleted
            
            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  isCompleted 
                    ? "bg-muted/50 border-muted" 
                    : "bg-card hover:bg-accent/30"
                )}
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => !isAutoCompleted && toggleTask(task.id)}
                  disabled={isAutoCompleted}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                
                <div className="flex items-center gap-2 flex-1">
                  {taskIcons[task.icon] || taskIcons.default}
                  <span className={cn(
                    "text-sm flex-1",
                    isCompleted && "line-through text-muted-foreground"
                  )}>
                    {task.text}
                  </span>
                </div>

                {isAutoCompleted && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <CloudRain className="h-3 w-3" />
                    Rainy Day
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>

        {/* Add new task */}
        <div className="flex gap-2 pt-2 border-t">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <Button onClick={addTask} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick add buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { text: 'Water plants', icon: 'water' },
            { text: 'Pull weeds', icon: 'weed' },
            { text: 'Check pests', icon: 'pest' },
          ].map((quick) => (
            <Button
              key={quick.text}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const task: Task = {
                  id: Date.now().toString(),
                  text: quick.text,
                  completed: false,
                  icon: quick.icon,
                  autoStrikeOnRain: quick.icon === 'water'
                }
                setTasks([...tasks, task])
              }}
            >
              {taskIcons[quick.icon]}
              <span className="ml-1">{quick.text}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
