import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { communityEngine } from '@/lib/community/engine'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/useToast'
import { PlusCircle } from 'lucide-react'

interface ProjectGoal {
  title: string
  description: string
}

export function ProjectModal() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'education' | 'support' | 'challenge' | 'initiative'>('education')
  const [goals, setGoals] = useState<ProjectGoal[]>([{ title: '', description: '' }])

  const handleAddGoal = () => {
    setGoals([...goals, { title: '', description: '' }])
  }

  const handleGoalChange = (index: number, field: keyof ProjectGoal, value: string) => {
    const newGoals = [...goals]
    newGoals[index][field] = value
    setGoals(newGoals)
  }

  const handleSubmit = async () => {
    if (!title || !description || goals.some(goal => !goal.title || !goal.description)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await communityEngine.createProject(user!.uid, {
        title,
        description,
        category,
        goals: goals.map(goal => ({ ...goal, status: 'pending' as const })),
        startDate: new Date().toISOString()
      })

      toast({
        title: 'Success',
        description: 'Project created successfully'
      })
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('education')
    setGoals([{ title: '', description: '' }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter project title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter project description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={(value: typeof category) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="challenge">Challenge</SelectItem>
                <SelectItem value="initiative">Initiative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Goals</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddGoal}
                disabled={goals.length >= 5}
              >
                Add Goal
              </Button>
            </div>
            {goals.map((goal, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Goal title"
                  value={goal.title}
                  onChange={e => handleGoalChange(index, 'title', e.target.value)}
                />
                <Textarea
                  placeholder="Goal description"
                  value={goal.description}
                  onChange={e => handleGoalChange(index, 'description', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 