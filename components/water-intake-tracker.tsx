"use client"

import { useState, useEffect } from "react"
import { Droplet, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WaterIntakeData {
  date: string
  glasses: number
  goal: number
}

export function WaterIntakeTracker() {
  const [glasses, setGlasses] = useState(0)
  const [goal] = useState(8) // 8 glasses per day goal
  const [isAnimating, setIsAnimating] = useState(false)

  // Load today's water intake from localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem("waterIntake")

    if (stored) {
      const data: WaterIntakeData = JSON.parse(stored)
      if (data.date === today) {
        setGlasses(data.glasses)
      } else {
        // New day, reset counter
        const newData: WaterIntakeData = { date: today, glasses: 0, goal }
        localStorage.setItem("waterIntake", JSON.stringify(newData))
        setGlasses(0)
      }
    } else {
      const newData: WaterIntakeData = { date: today, glasses: 0, goal }
      localStorage.setItem("waterIntake", JSON.stringify(newData))
    }
  }, [goal])

  const updateWaterIntake = (newGlasses: number) => {
    if (newGlasses < 0) return

    const today = new Date().toDateString()
    const data: WaterIntakeData = { date: today, glasses: newGlasses, goal }
    localStorage.setItem("waterIntake", JSON.stringify(data))
    setGlasses(newGlasses)

    // Trigger animation
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const addGlass = () => {
    updateWaterIntake(glasses + 1)
  }

  const removeGlass = () => {
    updateWaterIntake(glasses - 1)
  }

  const percentage = Math.min((glasses / goal) * 100, 100)
  const isGoalReached = glasses >= goal

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-cyan-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center ${isAnimating ? "animate-bounce" : ""}`}
          >
            <Droplet className="w-6 h-6 text-white" fill={isGoalReached ? "white" : "none"} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Hidratação</h3>
            <p className="text-sm text-gray-600">Meta diária: {goal} copos</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-gray-900">{glasses}</span>
          <span className="text-gray-600">/{goal}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalReached
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-cyan-500 to-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1 text-center">
          {isGoalReached ? "🎉 Meta alcançada!" : `${Math.round(percentage)}% da meta`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          onClick={removeGlass}
          disabled={glasses === 0}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-cyan-300 hover:bg-cyan-50 hover:border-cyan-400 disabled:opacity-50 bg-transparent"
        >
          <Minus className="w-4 h-4 text-cyan-600" />
        </Button>

        <Button
          onClick={addGlass}
          className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Copo
        </Button>

        <Button
          onClick={removeGlass}
          disabled={glasses === 0}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-cyan-300 hover:bg-cyan-50 hover:border-cyan-400 disabled:opacity-50 opacity-0 pointer-events-none bg-transparent"
        >
          <Minus className="w-4 h-4 text-cyan-600" />
        </Button>
      </div>

      {/* Quick Add Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-600 mb-2 text-center">Adicionar rapidamente:</p>
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => updateWaterIntake(glasses + 2)}
            variant="outline"
            size="sm"
            className="text-xs border-cyan-200 hover:bg-cyan-50"
          >
            +2 copos
          </Button>
          <Button
            onClick={() => updateWaterIntake(glasses + 4)}
            variant="outline"
            size="sm"
            className="text-xs border-cyan-200 hover:bg-cyan-50"
          >
            +4 copos
          </Button>
        </div>
      </div>
    </div>
  )
}
