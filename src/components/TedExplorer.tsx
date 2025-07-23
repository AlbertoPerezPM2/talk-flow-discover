import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Compass, Sparkles, Clock, Wand2, ListMusic, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const moods = ['Inspirational', 'Educational', 'Contemplative', 'Energetic', 'Calming', 'Challenging'];
const activities = ['Work', 'Personal Growth', 'Creativity', 'Wellness', 'Learning', 'Relaxation'];

const handleGenerateTimeline = async () => {
  if (!topic.trim()) return;
  
  setLoading(true);
  try {
    const result = await callTeddyAPI('trace', { topic: topic });
    console.log('🗓️ Raw API response:', result);
    
    const apiTalks = result.timeline || result.talks || [];
    console.log('🗓️ API talks data:', apiTalks);
    
    // Process timeline using backend-provided formatted dates
    const processedTimeline = apiTalks.map((talk) => {
      console.log('🗓️ Processing talk:', {
        title: talk.title,
        display_date: talk.display_date,
        date_published: talk.date_published,
        timestamp: talk.timestamp
      });
      
      return {
        title: talk.title,
        thumbnail: talk.thumbnail || "/api/placeholder/200/150",
        url: talk.url,
        displayDate: talk.display_date || talk.date_published || 'Unknown Date',
        sortKey: talk.timestamp || 0
      };
    });
    
    // Sort by timestamp
    processedTimeline.sort((a, b) => a.sortKey - b.sortKey);
    console.log('✅ Final processed timeline:', processedTimeline);
    
    setTimeline(processedTimeline);
  } catch (error) {
    console.error('❌ Timeline Error:', error);
    toast({
      title: "Error",
      description: "Failed to generate timeline. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};





interface TalkRecommendation {
  title: string;
  speaker: string;
  url: string;
  thumbnail: string;
}

interface PlaylistTalk {
  title: string;
  speaker: string;
  url: string;
  thumbnail: string;
  tags: string[];
}

interface TimelineTalk {
  title: string;
  thumbnail: string;
  url: string;
  displayDate: string;
  sortKey: number;
}

// Real API function to connect to your Python backend
async function callTeddyAPI(endpoint: string, payload: any): Promise<any> {
  console.log('🚀 Making API call to:', endpoint, 'with payload:', payload);
  
  try {
    const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    console.log('📡 Response status:', response.status);
    
    const result = await response.json();
    console.log('📦 API Response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}


const MoodChip: React.FC<{ mood: string; selected: boolean; onClick: () => void }> = ({
  mood, selected, onClick
}) => (
  <button
    onClick={onClick}
    className={`ted-chip ${selected ? 'active' : ''}`}
  >
    {mood}
  </button>
);

const TedExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trace');
  const [loading, setLoading] = useState(false);
  const [talkUrl, setTalkUrl] = useState('');
  const [currentTalk, setCurrentTalk] = useState<{ title: string; thumbnail: string; url: string } | null>(null);
  const [whyWatch, setWhyWatch] = useState('');
  const [recommendations, setRecommendations] = useState<{ [category: string]: TalkRecommendation[] }>({});
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [customMood, setCustomMood] = useState('');
  const [playlist, setPlaylist] = useState<PlaylistTalk[]>([]);
  const [topic, setTopic] = useState('');
  const [timeline, setTimeline] = useState<TimelineTalk[]>([]);
  const { toast } = useToast();

const handleGenerate = async () => {
  const query = talkUrl;
  if (!query.trim()) return;
  
  setLoading(true);
  try {
    const result = await callTeddyAPI('explore', { query: query });
    
    // 🔍 DEBUG: Log the entire API response
    console.log('🐛 Full API Response:', JSON.stringify(result, null, 2));
    console.log('🖼️ Thumbnail value:', result?.data?.talk?.thumbnail);
    
    setCurrentTalk({
      title: result.data.talk.title,
      thumbnail: result.data.talk.thumbnail,
      url: result.data.talk.url
    });
    
    setWhyWatch(result.data.key_insight);
    setRecommendations({});
  } catch (error) {
    console.error('❌ API Error:', error);
    toast({
      title: "Error",
      description: "Failed to generate content. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
    }
  };



  const handleGeneratePlaylist = async () => {
  // Assuming you have separate state for mood and activity now
  // For example: const [selectedMood, setSelectedMood] = useState('');
  // const [selectedActivity, setSelectedActivity] = useState('');

  if (!selectedMood || !selectedActivity) {
    toast({
      title: "Input Required",
      description: "Please select both a mood and an activity.",
      variant: "destructive",
    });
    return;
  }
  
  setLoading(true);
  try {
    // FIX: Send 'mood', 'activity', and 'free_text' separately
    const result = await callTeddyAPI('discover', { 
      mood: selectedMood,
      activity: selectedActivity,
      free_text: customMood // 'customMood' can be used for the optional free text
    });
    
    // The rest of your function to set the playlist
    setPlaylist(result.recommendations);
    
  } catch (error) {
    toast({
      title: "Error", 
      description: "Failed to generate playlist. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
    }
  };


  const handleGenerateTimeline = async () => {
  if (!topic.trim()) return;
  
  setLoading(true);
  try {
    const result = await callTeddyAPI('trace', { topic: topic });
    console.log('🗓️ Raw API response:', result);
    
    const apiTalks = result.timeline || result.talks || [];
    console.log('🗓️ API talks data:', apiTalks);
    
    // Process timeline using backend-provided formatted dates
    const processedTimeline = apiTalks.map((talk) => {
      console.log('🗓️ Processing talk:', {
        title: talk.title,
        display_date: talk.display_date,
        date_published: talk.date_published,
        timestamp: talk.timestamp
      });
      
      return {
        title: talk.title,
        thumbnail: talk.thumbnail || "/api/placeholder/200/150",
        url: talk.url,
        displayDate: talk.display_date || talk.date_published || 'Unknown Date',
        sortKey: talk.timestamp || 0
      };
    });
    
    // Sort by timestamp
    processedTimeline.sort((a, b) => a.sortKey - b.sortKey);
    console.log('✅ Final processed timeline:', processedTimeline);
    
    setTimeline(processedTimeline);
  } catch (error) {
    console.error('❌ Timeline Error:', error);
    toast({
      title: "Error",
      description: "Failed to generate timeline. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};



  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">TED Suite 2.0 (Powered by "Teddy")</h1>
          <p className="text-lg text-muted-foreground">New ways to T.E.D. ideas worth spreading</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="trace" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Trace
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Discover
            </TabsTrigger>
          </TabsList>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-8">
            {/* URL Input Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-4">
                <Input
                  placeholder="What do you want to explore?"
                  value={talkUrl}
                  onChange={(e) => setTalkUrl(e.target.value)}
                  className="w-full"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !talkUrl.trim()}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  {loading ? 'Generating...' : 'Generate'}
                </Button>
              </CardContent>
            </Card>

            {/* Current Talk Thumbnail */}
            {currentTalk && (
              <Card className="w-full max-w-2xl mx-auto ted-card">
                <CardContent className="p-0">
                  <a
                    href={currentTalk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={currentTalk.thumbnail}
                      alt={`${currentTalk.title} thumbnail`}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer"
                    />
                  </a>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{currentTalk.title}</h3>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            <div className="w-full max-w-2xl mx-auto mt-8">
              {/* Why Watch */}
              <Card className="ted-card">
                <CardHeader>
                  <CardTitle>Teddy's Key Insight</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold italic min-h-[12rem] flex items-center justify-center text-center">
                    {whyWatch || "Teddy's thoughts will appear here..."}
                  </p>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-8">
            {/* Mood & Activity Selection Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-6">
                {/* Mood Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Pick a mood</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <MoodChip
                        key={mood}
                        mood={mood}
                        selected={selectedMood === mood}
                        onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Activity Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Now pick an activity</label>
                  <div className="flex flex-wrap gap-2">
                    {activities.map((activity) => (
                      <MoodChip
                        key={activity}
                        mood={activity}
                        selected={selectedActivity === activity}
                        onClick={() => setSelectedActivity(selectedActivity === activity ? '' : activity)}
                      />
                    ))}
                  </div>
                </div>
                
                <Input
                  placeholder="What do you want to discover?"
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                />
                <Button
                  onClick={handleGeneratePlaylist}
                  disabled={loading || (!selectedMood || !selectedActivity) && !customMood.trim()}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <ListMusic className="w-4 h-4" />
                  {loading ? 'Generating playlist...' : 'Generate playlist'}
                </Button>
              </CardContent>
            </Card>

            {/* Playlist Grid */}
            {playlist.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {playlist.map((talk, idx) => (
                  <Card key={idx} className="ted-card">
                    <CardContent className="p-0">
                      <img
                        src={talk.thumbnail}
                        alt={`${talk.title} thumbnail`}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold line-clamp-2">{talk.title}</h3>
                        <p className="text-sm text-muted-foreground">{talk.speaker}</p>
                        <a
                          href={talk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                        >
                          Watch Talk <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trace Tab */}
          <TabsContent value="trace" className="space-y-8">
            {/* Topic Input Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-4">
                <Input
                  placeholder="What topic do you want to trace? E.g. Artificial Intelligence"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Button
                  onClick={handleGenerateTimeline}
                  disabled={loading || !topic.trim()}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {loading ? 'Building timeline...' : 'Build timeline'}
                </Button>
              </CardContent>
            </Card>

            {/* Vertical Timeline */}
            {timeline.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-primary h-full"></div>
                  
                  {timeline.map((talk, idx) => (
                    <div key={idx} className={`relative flex items-center mb-12 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      {/* Timeline dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>
                      
                      {/* Content */}
                      <div className={`w-5/12 ${idx % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <Card className="ted-card">
                          <CardContent className="p-0">
                            <a
                              href={talk.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={talk.thumbnail}
                                alt={`${talk.title} thumbnail`}
                                className="w-full h-32 object-cover rounded-t-lg cursor-pointer"
                              />
                            </a>
                            <div className="p-4">
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{talk.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {talk.displayDate}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <footer className="mt-16 py-8 border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            Capstone Project for Data Science & AI Bootcamp done by Paul Petersohn and Alberto Pérez. Copyright 2025
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TedExplorer;
