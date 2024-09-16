'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

export function OnboardingFlowComponent() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: undefined as Date | undefined,
    gender: ''
  })

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, dateOfBirth: date })
  }

  const handleGenderChange = (value: string) => {
    setFormData({ ...formData, gender: value })
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What's your name?</h2>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">When were you born?</h2>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Calendar
                mode="single"
                selected={formData.dateOfBirth}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What's your gender?</h2>
            <RadioGroup onValueChange={handleGenderChange} value={formData.gender}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Summary</h2>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Date of Birth:</strong> {formData.dateOfBirth ? format(formData.dateOfBirth, 'MMMM do, yyyy') : 'Not provided'}</p>
            <p><strong>Gender:</strong> {formData.gender || 'Not provided'}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Onboarding</h1>
          <span className="text-sm text-gray-500">Step {step} of 4</span>
        </div>
        <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <Button onClick={handleBack} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        {step < 4 ? (
          <Button onClick={handleNext} className="ml-auto">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => console.log('Form submitted:', formData)} className="ml-auto">
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}