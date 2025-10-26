'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HomeScreen } from '@/components/screens/home-screen'
import { QuestScreen } from '@/components/screens/quest-screen'
import { ResultsScreen } from '@/components/screens/results-screen'
import Image from "next/image"

export default function PosturemonApp() {
  const [activeTab, setActiveTab] = useState('home')
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <Image
            src="/images/posturemon-logo.png"
            alt="PostureMon Logo"
            width={300}
            height={100}
            className="w-full max-w-md mx-auto drop-shadow-lg"
            priority
          />
          <p className="text-sm text-muted-foreground sm-2">
            Turn good posture into a fun pixel-art adventure
          </p>
        </header>
        
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="home" className="font-mono">
              Home
            </TabsTrigger>
            <TabsTrigger value="quest" className="font-mono">
              Quest
            </TabsTrigger>
            <TabsTrigger value="results" className="font-mono">
              Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="mt-0">
            <HomeScreen onStartQuest={() => setActiveTab('quest')} />
          </TabsContent>
          
          <TabsContent value="quest" className="mt-0">
            <QuestScreen onComplete={() => setActiveTab('home')} />
          </TabsContent>
          
          <TabsContent value="results" className="mt-0">
            <ResultsScreen />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}