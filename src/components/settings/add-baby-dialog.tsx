'use client'

import { useState } from 'react'
import { useAddBaby, useSwitchBaby } from '@/hooks/use-babies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Baby, Calendar, Loader2, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function AddBabyDialog() {
  const { toast } = useToast()
  const addBaby = useAddBaby()
  const switchBaby = useSwitchBaby()
  const [open, setOpen] = useState(false)
  const [babyName, setBabyName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!dueDate && !birthDate) {
      toast({ title: 'Please enter a due date or birth date', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await addBaby.mutateAsync({
        baby_name: babyName || undefined,
        due_date: dueDate || undefined,
        birth_date: birthDate || undefined,
      })

      if (result.error) throw result.error
      if (result.baby) {
        // Switch to the new baby
        await switchBaby.mutateAsync(result.baby.id)
        toast({ title: `${babyName || 'Baby'} added!` })
      }

      setOpen(false)
      setBabyName('')
      setDueDate('')
      setBirthDate('')
    } catch (err) {
      toast({ title: 'Failed to add baby', variant: 'destructive' })
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-copper/30 text-copper hover:bg-copper/10 font-ui font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Add Another Baby
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[--surface] border-[--border]">
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-white flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Add Baby
          </DialogTitle>
          <DialogDescription className="font-body text-[--muted]">
            Add another baby to track. Each baby gets their own tasks, briefings, and tracker.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newBabyName" className="font-ui font-medium">Name (optional)</Label>
            <Input
              id="newBabyName"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Baby's name or nickname"
              className="bg-[--card] border-[--border]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newDueDate" className="font-ui font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </Label>
            <Input
              id="newDueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[--card] border-[--border]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newBirthDate" className="font-ui font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Birth Date (if born)
            </Label>
            <Input
              id="newBirthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="bg-[--card] border-[--border]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="font-ui"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-copper hover:bg-copper/80 font-ui font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Baby'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
