/**
 * Results Screen - Stats Dashboard
 * Shows daily stats, weekly progress, and achievements
 * WITH REAL DATA FROM DATABASE
 */

'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { usePostureStore } from '@/stores/posture-store'
import { TrendingUp, Target, Award, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'

interface TodayStats {
  average_score: number
  total_readings: number
  good_posture_count: number
  bad_posture_count: number
  good_posture_percentage: number
  good_posture_hours: number
  date: string
}

interface DailyScore {
  date: string
  average_score: number
}

interface WeekStats {
  daily_scores: DailyScore[]
}

export function ResultsScreen() {
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null)
  const [weekStats, setWeekStats] = useState<WeekStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get state from store
  const player = usePostureStore((state) => state.player)
  const currentPosture = usePostureStore((state) => state.currentPosture)
  const score = currentPosture?.score.overall ?? 0
  
  // Fetch stats
  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch today's stats
      const todayResponse = await fetch(`${API_BASE_URL}/api/stats/today`)
      if (!todayResponse.ok) throw new Error('Failed to fetch today stats')
      const todayData = await todayResponse.json()
      setTodayStats(todayData)
      
      // Fetch week stats
      const weekResponse = await fetch(`${API_BASE_URL}/api/stats/week`)
      if (!weekResponse.ok) throw new Error('Failed to fetch week stats')
      const weekData = await weekResponse.json()
      setWeekStats(weekData)
      
      console.log('✅ Stats loaded:', { todayData, weekData })
      
    } catch (err) {
      console.error('❌ Failed to fetch stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch on mount
  useEffect(() => {
    fetchStats()
  }, [])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground">Loading stats...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive">
        <div className="text-center">
          <p className="text-destructive mb-4">❌ {error}</p>
          <Button onClick={fetchStats} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button 
          onClick={fetchStats} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </Button>
      </div>
      
      {/* Today's Stats */}
      <Card className="p-6">
        <h2 className="mb-6 font-mono text-xl font-bold">
          Today&apos;s Stats
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            icon={Target}
            label="Average Posture Score"
            value={`${todayStats?.average_score.toFixed(1) || 0}/100`}
            color="text-primary"
          />
          <StatCard
            icon={Clock}
            label="Time in Good Posture"
            value={`${todayStats?.good_posture_hours.toFixed(1) || 0} hrs`}
            color="text-secondary"
          />
          <StatCard
            icon={Award}
            label="Total Readings"
            value={todayStats?.total_readings || 0}
            color="text-accent"
          />
          <StatCard
            icon={TrendingUp}
            label="Good Posture %"
            value={`${todayStats?.good_posture_percentage || 0}%`}
            color="text-primary"
          />
        </div>
        
        {/* Additional Info */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Good Posture</p>
              <p className="text-lg font-semibold text-secondary">
                {todayStats?.good_posture_count || 0} readings
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Poor Posture</p>
              <p className="text-lg font-semibold text-destructive">
                {todayStats?.bad_posture_count || 0} readings
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Weekly Progress */}
      <Card className="p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold">
          Weekly Progress
        </h3>
        
        <div className="space-y-3">
          {weekStats?.daily_scores && weekStats.daily_scores.length > 0 ? (
            weekStats.daily_scores.map((day) => {
              const date = new Date(day.date)
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
              const isToday = date.toDateString() === new Date().toDateString()
              
              // Show score, even if 0
              const displayScore = day.average_score
              const hasData = displayScore > 0
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className={`w-12 text-sm font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {dayName}
                    {isToday && ' •'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
                      {hasData ? (
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${displayScore}%` }}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                          No data
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-12 text-right text-sm font-mono">
                    {hasData ? displayScore.toFixed(0) : '-'}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No data yet. Start using the app to see your weekly progress!
            </p>
          )}
        </div>
      </Card>
      
      {/* Achievements */}
      <Card className="p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold">
          Achievements
        </h3>
        
        <div className="grid gap-3 md:grid-cols-2">
          <AchievementCard
            icon="🏆"
            title="First Session"
            description="Complete your first posture session"
            unlocked={todayStats ? todayStats.total_readings >= 1 : false}
          />
          <AchievementCard
            icon="🔥"
            title="3-Day Streak"
            description="Maintain good posture for 3 days"
            unlocked={player.streak >= 3}
          />
          <AchievementCard
            icon="⭐"
            title="Perfect Day"
            description="Achieve 90+ average score"
            unlocked={todayStats ? todayStats.average_score >= 90 : false}
          />
          <AchievementCard
            icon="💎"
            title="100 Readings"
            description="Log 100 posture readings"
            unlocked={todayStats ? todayStats.total_readings >= 100 : false}
          />
          <AchievementCard
            icon="🎯"
            title="80% Good"
            description="80%+ time in good posture"
            unlocked={todayStats ? todayStats.good_posture_percentage >= 80 : false}
          />
          <AchievementCard
            icon="🌟"
            title="Consistency King"
            description="7-day streak achieved"
            unlocked={player.streak >= 7}
          />
        </div>
      </Card>
      
      {/* Insights */}
      <Card className="p-6 bg-muted">
        <h3 className="mb-4 font-mono text-lg font-semibold">
          💡 AI Insights
        </h3>
        
        <div className="space-y-3">
          {todayStats && todayStats.average_score >= 80 && (
            <InsightCard
              text="Excellent work! Your average score is above 80. Keep maintaining this great posture!"
            />
          )}
          {todayStats && todayStats.average_score < 60 && (
            <InsightCard
              text="Your posture could use some improvement. Try recalibrating and being more mindful of your sitting position."
            />
          )}
          {todayStats && todayStats.good_posture_percentage >= 70 && (
            <InsightCard
              text={`You're maintaining good posture ${todayStats.good_posture_percentage}% of the time. Fantastic consistency!`}
            />
          )}
          {weekStats && weekStats.daily_scores.length >= 3 && (
            <InsightCard
              text={`You've been tracking for ${weekStats.daily_scores.length} days. Keep up the momentum!`}
            />
          )}
          {!todayStats || todayStats.total_readings === 0 && (
            <InsightCard
              text="Connect your camera and calibrate to start tracking your posture!"
            />
          )}
        </div>
      </Card>
    </div>
  )
}

// ============ STAT CARD ============

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  color: string
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
      <div className={`rounded-full bg-background p-3 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

// ============ ACHIEVEMENT CARD ============

interface AchievementCardProps {
  icon: string
  title: string
  description: string
  unlocked: boolean
}

function AchievementCard({ icon, title, description, unlocked }: AchievementCardProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg bg-muted p-3 transition-opacity ${
        unlocked ? 'opacity-100' : 'opacity-50'
      }`}
    >
      <div className="text-2xl">{icon}</div>
      
      <div className="flex-1">
        <div className="font-medium">
          {title}
          {unlocked && ' ✓'}
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

// ============ INSIGHT CARD ============

function InsightCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg bg-background p-3 text-sm">
      <p className="text-muted-foreground">{text}</p>
    </div>
  )
}